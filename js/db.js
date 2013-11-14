function inizializzaDB(tx){
	
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento (qr_code,lat,lon,sync)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_cartello (censimento_id,segnale_id,pellicola_id,supporto_id,marchiato_ce_ck,omologato_ck,ditta_produttrice,ditta_installatrice,data_installazione,ordinanza_n,ordinanza_del,necessario_intervento_tipo,necessario_intervento_descrizione,forma,lato,altezza,particolari_descrizione)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_foto (censimento_id,foto,tipo_foto)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_palo (censimento_id,dimensione,palo_controvento,dimensione_controvento)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_staffa (censimento_id, modello_staffa)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_bene (censimento_id, tipologia_bene_id,nome,descrizione,annotazioni)');

  
  TABLES_TO_SYNC = [
    {tableName : 'censimento', idName : 'rowid'},
    {tableName : 'censimento_cartello', idName : 'rowid'},
    {tableName : 'censimento_foto', idName : 'rowid'},
    {tableName : 'censimento_palo', idName : 'rowid'},
    {tableName : 'censimento_staffa', idName : 'rowid'},
    {tableName : 'censimento_bene', idName : 'rowid'}
  ];

  sync_info = new Array();
    
  // ABILITA IL MONITORAGGIO DELLE TABELLE PER LA SINCRONIZZAZIONE
  DBSYNC.initSync(TABLES_TO_SYNC, db, sync_info, service_sync_url , function(){console.log("INIZIALIZZAZIONE SYNC OK");});
  
  // CONTROLLA SE SONO PRESENTI DATI DA SINCRONIZZARE
  check_data_to_sync(db);
}

function successDB(){
	console.log("DATABASE INIZIALIZZATO CON SUCCESSO");
	
	// abilita il pulsante di inizia censimento (cosa censire)
    $(index_infogeneraliBtn).removeClass('ui-disabled');   

}

function errorDB(){
	alert("Errore durante l'inizializzazione del database");
}

function check_data_to_sync(db){
	 
	// CONTROLLO LA PRESENZA DEL DATABASE
  	if(db != null){
  		  		
  		// CONTROLLA PRESENZA DATI SU DISPOSITIVO
		db.transaction(function (tx) {
		   tx.executeSql('SELECT * FROM new_elem', [], 
		   	function (tx, results) {
			   var len = results.rows.length, i;
			   len = parseInt(len);
			   			   
			   if(len == 0)
			    	$(index_syncdataBtn).addClass('ui-disabled');   
			   else
			   		$(index_syncdataBtn).removeClass('ui-disabled');
			}, null);
		});	
  	}
  	else
  		console.log("database non creato");
}
        	