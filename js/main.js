var db = null;

document.addEventListener("deviceready", init, false);
        	
function init(){
	 		   		
	// DISABILITA RETRO CARTELLO FINQUANDO 
    // NON INSERISCO IL NUMERO DEI CARTELLI
	$( "#col_retro_cartello h3" ).addClass( "ui-disabled" );
	
	// APRI DATABASE
	db = window.openDatabase('record', '1.0', 'Censimenti da Sincronizzare',10485760);
	// INIZIALIZZA DATABASE
	db.transaction(initDb, errorInitDb,successInitDb);
	
	/* funzionaaa */
	/*
	$("#qr_code").keyup(function(e){
	    if(e.which == 13){ 
	        alert("ciao");
	    }
	});
	*/
	
}

function initDb(tx){
	
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento (qr_code,lat,lon,sync)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_cartello (censimento_id,segnale_id,pellicola_id,supporto_id,marchiato_ce_ck,omologato_ck,ditta_produttrice,ditta_installatrice,data_installazione,ordinanza_n,ordinanza_del,necessario_intervento_ck,esame_obiettivo)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_foto (censimento_id,foto,tipo_foto)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_palo (censimento_id,dimensione,palo_controvento,dimensione_controvento)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS censimento_staffa (censimento_id, modello_staffa)');
  
  
  TABLES_TO_SYNC = [
    {tableName : 'censimento', idName : 'rowid'},
    {tableName : 'censimento_cartello', idName : 'rowid'},
    {tableName : 'censimento_foto', idName : 'rowid'},
    {tableName : 'censimento_palo', idName : 'rowid'},
    {tableName : 'censimento_staffa', idName : 'rowid'}
  ];

  sync_info = new Array();
    
  // ABILITA IL MONITORAGGIO DELLE TABELLE PER LA SINCRONIZZAZIONE
  var service_sync_url = "http://www.gretacity.com/Service/index.php?s=sync_client";
  DBSYNC.initSync(TABLES_TO_SYNC, db, sync_info, service_sync_url , function(){console.log("init sync ok");});
  
  // CONTROLLA SE SONO PRESENTI DATI DA SINCRONIZZARE
  check_data_to_sync(db);
}

function successInitDb(){
	console.log("database inizializzato con successo");
	
	// abilita il pulsante di inizia censimento
    $("#inizia_censimento").removeClass('ui-disabled');   

}

function errorInitDb(){
	alert("errore init db");
}

function check_data_to_sync(db){
	  
  	if(db != null){
  		
  		// CONTROLLA PRESENZA DATI SU DISPOSITIVO
		db.transaction(function (tx) {
		   tx.executeSql('SELECT * FROM new_elem', [], 
		   	function (tx, results) {
			   var len = results.rows.length, i;
			   len = parseInt(len);
			   			   
			   if(len == 0)
			    	$("#sync_data").addClass('ui-disabled');   
			   else
			   		$("#sync_data").removeClass('ui-disabled');
			   
			   
			   
			}, null);
		});
  		
  	}
  	
}
        	