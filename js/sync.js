function sync_data(){
	
	if(confirm("Questa procedura potrebbe impiegare del tempo, vuoi continuare?")){
		
		// DEVO CONTROLLARE LA PRESENZA DELLE CREDENZIALI
		var userid = window.localStorage.getItem("userid");
		
		if(userid != null && userid > 0){
	
			// DISABILITA PULSANTE  
			$("#sync_data").addClass('ui-disabled');   
					
			// VISUALIZZA ROTELLA
			$.mobile.loading('show');		
		
			DBSYNC.syncNow(callbacksync_data, function(result) {
				
		     if (result.syncOK === true && result.serverAnswer.message != "undefined") {
		    
		    	 // NASCONDI ROTELLA
		    	 $.mobile.loading('hide');		
		
		     	 // LOGGA LA RISPOSTA DEL SERVER
		     	 console.log(result.serverAnswer.message);
		     	 
		     	 //	MOSTRA LA RISPOSTA DEL SERVER 
		         alert(result.serverAnswer.message);
		         
		         // PULISCI IL DATABASE
		         check_data_to_sync(db);
		         
		     } // fine if
		     
		     else{		     	
	 			// ATTIVA PULSANTE
	     		$("#sync_data").removeClass('ui-disabled');   
		     	
	 			// NASCONDI ROTELLA
				$.mobile.loading('hide');
				
				return;		
		     } // fine else
			}); // fine sincronizzazione
			
		} // fine if userid
		
		// devi effettuare il login
		else{
			// cambia pagina e vai alla form di login
			$.mobile.changePage("#loginPage");
			return;
			
		} // fine devi effettuare il login
		
	} // fine messaggio di notifica
	
} // fine funzione sync_data

function callbacksync_data(){
	console.log("sincronizzazione in corso");
}