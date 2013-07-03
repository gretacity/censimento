function sync_data(){
	
	// DISABILITA PULSANTE  
	$("#sync_data").addClass('ui-disabled');   
			
	// VISUALIZZA ROTELLA
	$.mobile.loading('show');		

	DBSYNC.syncNow(callBackSyncProgress, function(result) {
		
     if (result.syncOK === true && result.serverAnswer.message != "undefined") {
    
    	 // NASCONDI ROTELLA
    	 $.mobile.loading('hide');		

     	 // LOGGA LA RISPOSTA DEL SERVER
     	 console.log(result.serverAnswer.message);
     	 
     	 //	MOSTRA LA RISPOSTA DEL SERVER 
         alert(result.serverAnswer.message);
         
         // PULISCI IL DATABASE
         check_data_to_sync(db);

     }
     
     else{
     	alert("problema durante la sincronizzazione");
     }
     
	});
}

function callBackSyncProgress(){
	console.log("sincronizzazione in corso");
}