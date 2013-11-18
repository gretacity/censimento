/*******************************************************************
 * Sync a local WebSQL DB (SQLite) with a server.
 * Thanks to Lee Barney and QuickConnect for his inspiration
 ******************************************************************/
/*
 Copyright (c) 2012, Samuel Michelot,  MosaCrea Ltd
 Permission is hereby granted, free of charge, to any person obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.


 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.DBSYNC = factory();
    }
}(this, function () {

var DBSYNC = {
    serverUrl: null,
    db: null,
    tablesToSync: [],//eg.  [{tableName : 'myDbTable', idName : 'myTable_id'},{tableName : 'stat'}]
    idNameFromTableName : {}, //map to get the idName with the tableName (key)
    syncInfo: {//this object can have other useful info for the server ex. {deviceId : "XXXX", email : "fake@g.com"}
        lastSyncDate : null// attribute managed by webSqlSync
    },
    syncResult: null,
    firstSync: false,
    cbEndSync: null,
    clientData: null,
    serverData: null,

    /*************** PUBLIC FUNCTIONS ********************/
    /**
     * Initialize the synchronization (should be called before any call to syncNow)
     * (it will create automatically the necessary tables and triggers if needed)
     * @param {Object} theTablesToSync : ex : [{ tableName: 'card_stat', idName: 'card_id'}, {tableName: 'stat'}] //no need to precise id if the idName is "id".
     * @param {Object} dbObject : the WebSQL database object.
     * @param {Object} theSyncInfo : will be sent to the server (useful to store any ID or device info).
     * @param {Object} theServerUrl
     * @param {Object} callBack(firstInit) : called when init finished.
     */
    initSync: function(theTablesToSync, dbObject, theSyncInfo, theServerUrl, callBack) {
        var self = this, i = 0;
        this.db = dbObject;
        this.serverUrl = theServerUrl;
        this.tablesToSync = theTablesToSync;
        this.syncInfo = theSyncInfo;
        //Handle optional id :
        for (i = 0; i < self.tablesToSync.length; i++) {
            if (typeof self.tablesToSync[i].idName === 'undefined') {
                self.tablesToSync[i].idName = 'id';//if not specified, the default name is 'id'
            }
            self.idNameFromTableName[self.tablesToSync[i].tableName] = self.tablesToSync[i].idName;
        }

        self.db.transaction(function(transaction) {
            //create new table to store modified or new elems
            self._executeSql('CREATE TABLE IF NOT EXISTS new_elem (table_name TEXT NOT NULL, id TEXT NOT NULL);', [], transaction);
            self._executeSql('CREATE INDEX IF NOT EXISTS index_tableName_newElem on new_elem (table_name)', [], transaction);
            self._executeSql('CREATE TABLE IF NOT EXISTS sync_info (last_sync TIMESTAMP);', [], transaction);

            //create triggers to automatically fill the new_elem table (this table will contains a pointer to all the modified data)
            for (i = 0; i < self.tablesToSync.length; i++) {
                var curr = self.tablesToSync[i];
                self._executeSql('CREATE TRIGGER IF NOT EXISTS update_' + curr.tableName + '  AFTER UPDATE ON ' + curr.tableName + ' ' +
                        'BEGIN INSERT INTO new_elem (table_name, id) VALUES ("' + curr.tableName + '", new.' + curr.idName + '); END;', [], transaction);

                self._executeSql('CREATE TRIGGER IF NOT EXISTS insert_' + curr.tableName + '  AFTER INSERT ON ' + curr.tableName + ' ' +
                        'BEGIN INSERT INTO new_elem (table_name, id) VALUES ("' + curr.tableName + '", new.' + curr.idName + '); END;', [], transaction);
                //TODO the DELETE is not handled. But it's not a pb if you do a logic delete (ex. update set state="DELETED")
            }
        });//end tx
        self._selectSql('SELECT last_sync FROM sync_info', null, function(res) {

            if (res.length === 0 || res[0] == 0) {//First sync (or data lost)
                self._executeSql('INSERT OR REPLACE INTO sync_info (last_sync) VALUES (0)', []);
                self.firstSync = true;
                self.syncInfo.lastSyncDate = 0;
                callBack(true);
            } else {
                self.syncInfo.lastSyncDate = res[0].last_sync;
                if (self.syncInfo.lastSyncDate === 0) {
                    self.firstSync = true;
                }
                callBack(false);
            }
        });
    },

    /**
     *
     * @param {function} callBackProgress
     * @param {function} callBackEnd (result.syncOK, result.message).
     * @param {boolean} saveBandwidth (default false): if true, the client will not send a request to the server if there is no local changes
     */
    syncNow: function(callBackProgress, callBackEndSync, saveBandwidth) {
    	var quanti_censimenti = 0;
        var self = this;
        if (this.db === null) {
            throw 'You should call the initSync before (db is null)';
        }

        self.syncResult = {syncOK: false, codeStr: 'noSync', message: 'No Sync yet', nbSent : 0, nbUpdated:0};
        
        self.cbEndSync = function() {
            callBackProgress(self.syncResult.message, 100, self.syncResult.codeStr);
            callBackEndSync(self.syncResult);
        };
        
        callBackProgress('Recupera dati dal db', 0, 'getData');
		
		// RECUPERO CENSIMENTI DA SINCRONIZZARE
		var query = "SELECT id FROM new_elem WHERE table_name = 'censimento'";
		self._getDataToSave(query,null,function(censimenti){
			
			// PER OGNI CENSIMENTO		
			censimenti.forEach(function(censimento){
				
	            callBackProgress("Censimenti da trasmettere: "+censimenti.length-quanti_censimenti, 0, 'infoStatus');

				self.log("censimento.id: "+censimento.id);
				
				  self._getDataToBackup(censimento.id,function(data) {
		            self.clientData = data;
		            if (saveBandwidth && self.syncResult.nbSent === 0) {
		                self.syncResult.localDataUpdated = false;
		                self.syncResult.syncOK = true;
		                self.syncResult.codeStr = 'nothingToSend';
		                self.syncResult.message = 'No new data to send to the server';
		                self.cbEndSync(self.syncResult);
		                return
		            }
		
		            callBackProgress('Invio ' + self.syncResult.nbSent + ' elementi al server', 20, 'sendData');
		
		            self._sendDataToServer(data, function(serverData) {
		
		                callBackProgress('Aggiornamento dati locali', 70, 'updateData');
		
		                self._updateLocalDb(serverData, function() {
		                    self.syncResult.localDataUpdated = self.syncResult.nbUpdated > 0;
		                    self.syncResult.syncOK = true;
		                    self.syncResult.codeStr = 'syncOk';
		                    self.syncResult.message = 'Dati inviati. (attendi risposta)';
		                    self.syncResult.serverAnswer = serverData;//include the original server answer, just in case
		                    self.cbEndSync(self.syncResult);
		                });
		            });
		        });
				
				quanti_censimenti++;
				
			}); // FINE PER OGNI CENSIMENTO
			
			
		}); // FINE RECUPERO CENSIMENTI DA SINCRONIZZARE	        	   
    },

    /* You can override the following methods to use your own log */
    log: function(message) {
        console.log(message);
    },
    error: function(message) {
        console.error(message);
    },
    getLastSyncDate : function() {
        return this.syncInfo.lastSyncDate;
    },
      // Usefull to tell the server to resend all the data from a particular Date (val = 1 : the server will send all his data)
    setServerUrl: function(val) {
        this.serverUrl = val;
    },
    // Usefull to tell the server to resend all the data from a particular Date (val = 1 : the server will send all his data)
    setSyncDate: function(val) {
        this.syncInfo.lastSyncDate = val;
        this._executeSql('UPDATE sync_info SET last_sync = "'+this.syncInfo.lastSyncDate+'"', []);
    },
    //Useful to tell the client to send all his data again (like the firstSync)
    setFirstSync: function() {
        this.firstSync = true;
        this.syncInfo.lastSyncDate = 0;
        this._executeSql('UPDATE sync_info SET last_sync = "'+this.syncInfo.lastSyncDate+'"', []);
    },
    /*************** PRIVATE FUNCTIONS ********************/

    _getDataToBackup: function(censimento_id,callBack)  {
        var self = this, nbData = 0;
        
        self.log('recupero dati di censimento: '+censimento_id);
        var dataToSync = {
            info: self.syncInfo,
            data: {}
        };
        
        // inizia la transazione del recupero dati
        self.db.transaction(function(tx) {
        
        	var contatoreTabelle = 0, countTables = self.tablesToSync.length; 
        
			// ciclo le tabelle e recupero gli associati al censimento
			self.tablesToSync.forEach(function(currTable){
				
				var current = currTable.tableName;
				
				var query = "SELECT rowid,* FROM "+current+" WHERE censimento_id = "+censimento_id;
				if(current == "censimento")		
					query = "SELECT rowid,* FROM censimento WHERE rowid = "+censimento_id;
				
				
				self._getDataToSave(query,tx,function(data){
					
					dataToSync.data[current] = data;
	                nbData += data.length;
					contatoreTabelle++;
					
				 	if (contatoreTabelle === countTables) {//only call the callback at the last table
	                        self.log('Dati recuperati dal db');
	                        dataToSync.info.nbDataToBackup = nbData;
	                        self.syncResult.nbSent = nbData;
	                        callBack(dataToSync);
	                }
					
				});	
			});
			
		}); // end transaction
		       		
    },

    _getDataToSave: function(query, tx, dataCallBack) {
        var self = this;
        self._selectSql(query, tx, dataCallBack);
    },
    
    _sendDataToServer: function(dataToSync, callBack) {
        var self = this;

        var XHR = new window.XMLHttpRequest(),
        data = JSON.stringify(dataToSync);
        XHR.overrideMimeType = 'application/json;charset=UTF-8';
        XHR.open("POST", self.serverUrl, true);
        XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        XHR.onreadystatechange = function () {
            var serverAnswer;
            if(4 === XHR.readyState) {
                try {
                    serverAnswer = JSON.parse(XHR.responseText);
                } catch(e) {
                    serverAnswer = XHR.responseText;
                }
                self.log('Server answered: ');
                self.log(serverAnswer);
                //I want only json/object as response
                if(XHR.status == 200 && serverAnswer instanceof Object) {
                    callBack(serverAnswer);
                } else {
                    serverAnswer = {
                        result : 'ERROR',
                        status : XHR.status,
                        message : XHR.statusText
                    };
                    callBack(serverAnswer);
                }
            }
        };

        XHR.send(data);

    },

    _updateLocalDb: function(serverData, callBack) {
    	
        var self = this;
        self.serverData = serverData;
        
        if (!serverData || serverData.result === 'ERROR') {
            self.syncResult.syncOK = false;
            self.syncResult.codeStr = 'syncKoServer';
            if (serverData) {
                self.syncResult.message = serverData.message;
            } else {
                self.syncResult.message = 'No answer from the server';
            }
            self.cbEndSync(self.syncResult);
            return;
        }
        if (typeof serverData.data === 'undefined' || serverData.data.length === 0) {
        	
            //nothing to update
            self.db.transaction(function(tx) {            	
                //We only use the server date to avoid dealing with wrong date from the client
                self._finishSync(serverData.syncDate, tx, callBack(0));
            });
            return;
        }
        self.db.transaction(function(tx) {
            var counterNbTable = 0, nbTables = self.tablesToSync.length;
            var counterNbElm = 0;
            self.tablesToSync.forEach(function(table) {
                var currData = serverData.data[table.tableName];
                if (typeof currData === "undefined") {
                    //Should always be defined (even if 0 elements)
                    currData = [];
                }
                var nb = currData.length;
                counterNbElm += nb;
                self.log('There are ' + nb + ' new or modified elements in the table ' + table.tableName + ' to save in the local DB');

                var i = 0, listIdToCheck = [];
                for (i = 0; i < nb; i++) {
                    listIdToCheck.push(serverData.data[table.tableName][i][table.idName]);
                }
                
                self._getIdExitingInDB(table.tableName, table.idName, listIdToCheck, tx, function(idInDb) {
                    
                    var curr = null, sql = null;

                    for (i = 0; i < nb; i++) {

                        curr = serverData.data[table.tableName][i];
    
                        if (idInDb[curr[table.idName]]) {//update
                            
                            /*ex : UPDATE "tableName" SET colonne 1 = [valeur 1], colonne 2 = [valeur 2]*/
                            sql = self._buildUpdateSQL(table.tableName, curr);
                            sql += ' WHERE ' + table.idName + ' = "' + curr[table.idName] + '"';

                            self._executeSql(sql, [], tx);

                        } else {//insert
                            //'ex INSERT INTO tablename (id, name, type, etc) VALUES (?, ?, ?, ?);'
                            var attList = self._getAttributesList(curr);
                            sql = self._buildInsertSQL(table.tableName, curr, attList);
                            var attValue = self._getMembersValue(curr, attList);

                            self._executeSql(sql, attValue, tx);
                        }
                    }//end for
                    counterNbTable++;
                    if (counterNbTable === nbTables) {
                        //TODO set counterNbElm to info
                        self.syncResult.nbUpdated = counterNbElm;
                        self._finishSync(serverData.syncDate, tx, callBack);
                    }
                });//end getExisting Id
            });//end forEach
        });//end tx
    },
    /** return the listIdToCheck curated from the id that doesn't exist in tableName and idName
     * (used in the DBSync class to know if we need to insert new elem or just update)
     * @param {Object} tableName : card_stat.
     * @param {Object} idName : ex. card_id.
     * @param {Object} listIdToCheck : ex. [10000, 10010].
     * @param {Object} dataCallBack(listIdsExistingInDb[id] === true).
     */
    _getIdExitingInDB: function(tableName, idName, listIdToCheck, tx, dataCallBack) {
        if (listIdToCheck.length === 0) {
            dataCallBack([]);
            return;
        }
        var self = this;
        var SQL = 'SELECT ' + idName + ' FROM ' + tableName + ' WHERE ' + idName + ' IN ("' + self._arrayToString(listIdToCheck, '","') + '")';
        self._selectSql(SQL, tx, function(ids) {
            var idsInDb = [];
            for (var i = 0; i < ids.length; ++i) {
                idsInDb[ids[i][idName]] = true;
            }
            dataCallBack(idsInDb);
        });
    },
    _finishSync: function(syncDate, tx, callBack) {
    	    	
        var self = this, tableName, idsToDelete, idName, i, idValue, idsString;
        this.firstSync = false;
        this.syncInfo.lastSyncDate = syncDate;
        this._executeSql('UPDATE sync_info SET last_sync = "' + syncDate + '"', [], tx);

        // Remove only the elem sent to the server (in case new_elem has been added during the sync)
        // We don't do that anymore: this._executeSql('DELETE FROM new_elem', [], tx);
        for (tableName in self.clientData.data) {
        	        	        	
            idsToDelete = new Array();
            idName =  self.idNameFromTableName[tableName];
            for (i=0; i < self.clientData.data[tableName].length; i++) {
                idValue = self.clientData.data[tableName][i][idName];
                idsToDelete.push('"'+idValue+'"');
            }
            
            
            if (idsToDelete.length > 0) {
                 idsString = self._arrayToString(idsToDelete, ',');
                 
                 // AGGIUNGO LA QUERY A CASCATA PER ELIMINARE I DATI NELLE ALTRE
                 // TABELLE ASSOCIATE
                 self._executeSql('DELETE FROM new_elem WHERE table_name = "'+tableName+'" AND id IN ('+idsString+')', [],tx);
            	 self._executeSql('DELETE FROM '+tableName+' WHERE '+idName+' = '+idsString, [], tx);
            }
            
        }
        
        // RIMUOVO LA CALLBACK CHE MI CREA ERRORE
        //callBack();
        self.clientData = null;
        self.serverData = null;
    },


/***************** DB  util ****************/

    _selectSql: function(sql, optionalTransaction, callBack) {
        var self = this;
        self._executeSql(sql, [], optionalTransaction, function(tx, rs) {
        callBack(self._transformRs(rs));
        }, self._errorHandler);
    },
    _transformRs: function(rs) {
        var elms = [];
        if (typeof(rs.rows) === 'undefined') {
            return elms;
        }

        for (var i = 0; i < rs.rows.length; ++i) {
            elms.push(rs.rows.item(i));
        }
        return elms;
    },

    _executeSql: function(sql, params, optionalTransaction, optionalCallBack) {
        var self = this;
        self.log('_executeSql: ' + sql + ' with param ' + params);
        if (!optionalCallBack) {
            optionalCallBack = self._defaultCallBack;
        }
        if (optionalTransaction) {
            self._executeSqlBridge(optionalTransaction, sql, params, optionalCallBack, self._errorHandler);
        } else {
            self.db.transaction(function(tx) {
                self._executeSqlBridge(tx, sql, params, optionalCallBack, self._errorHandler);
            });
        }
    },
    _executeSqlBridge: function(tx, sql, params, dataHandler, errorHandler) {
        var self = this;

        //Standard WebSQL
        tx.executeSql(sql, params, dataHandler, errorHandler);

    },

    _defaultCallBack: function(transaction, results) {
        //DBSYNC.log('SQL Query executed. insertId: '+results.insertId+' rows.length '+results.rows.length);
    },

    _errorHandler: function(transaction, error) {
        DBSYNC.error('Error : ' + error.message + ' (Code ' + error.code + ') Transaction.sql = ' + transaction.sql);
    },

    _buildInsertSQL: function(tableName, objToInsert) {
        var members = this._getAttributesList(objToInsert);
        if (members.length === 0) {
            throw 'buildInsertSQL : Error, try to insert an empty object in the table ' + tableName;
        }
        //build INSERT INTO myTable (attName1, attName2) VALUES (?, ?) -> need to pass the values in parameters
        var sql = 'INSERT INTO ' + tableName + ' (';
        sql += this._arrayToString(members, ',');
        sql += ') VALUES (';
        sql += this._getNbValString(members.length, '?', ',');
        sql += ')';
        return sql;
    },

    _buildUpdateSQL: function(tableName, objToUpdate) {
        /*ex UPDATE "nom de table" SET colonne 1 = [valeur 1], colonne 2 = [valeur 2] WHERE {condition}*/
        var self = this;
        var sql = 'UPDATE ' + tableName + ' SET ';
        var members = self._getAttributesList(objToUpdate);
        if (members.length === 0) {
            throw 'buildUpdateSQL : Error, try to insert an empty object in the table ' + tableName;
        }
        var values = self._getMembersValue(objToUpdate, members);

        var nb = members.length;
        for (var i = 0; i < nb; i++) {
            sql += '"' + members[i] + '" = "' + values[i] + '"';
            if (i < nb - 1) {
                sql += ', ';
            }
        }

        return sql;
    },
    _getMembersValue: function(obj, members) {
        var memberArray = [];
        for (var i = 0; i < members.length; i++) {
            memberArray.push(obj[members[i]]);
        }
        return memberArray;
    },
    _getAttributesList: function(obj, check) {
        var memberArray = [];
        for (var elm in obj) {
            if (check && typeof this[elm] === 'function' && !obj.hasOwnProperty(elm)) {
                continue;
            }
            memberArray.push(elm);
        }
        return memberArray;
    },
    _getNbValString: function(nb, val, separator) {
        var result = '';
        for (var i = 0; i < nb; i++) {
            result += val;
            if (i < nb - 1) {
                result += separator;
            }
        }
        return result;
    },
    _getMembersValueString: function(obj, members, separator) {
        var result = '';
        for (var i = 0; i < members.length; i++) {
            result += '"' + obj[members[i]] + '"';
            if (i < members.length - 1) {
                result += separator;
            }
        }
        return result;
    },
    _arrayToString: function(array, separator) {
        var result = '';
        for (var i = 0; i < array.length; i++) {
            result += array[i];
            if (i < array.length - 1) {
                result += separator;
            }
        }
        return result;
    }
};

return DBSYNC;

}));
