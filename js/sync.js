var responseServer = "";

function sync_data(){
	
	if(confirm("Questa procedura potrebbe impiegare del tempo, vuoi continuare?")){
		
		// DEVO CONTROLLARE LA PRESENZA DELLE CREDENZIALI
		var userid = window.localStorage.getItem("userid");
		
		if(userid != null && userid > 0){
			
			// DISABILITA PULSANTE  
			$("#sync_data").addClass('ui-disabled');   
					
			// VISUALIZZA ROTELLA
			//$.mobile.loading('show');		
		
			DBSYNC.syncNow(callbacksync_data, callbacksync_data_end); 
			
			
		} // fine if userid
		
		// devi effettuare il login
		else{
			// cambia pagina e vai alla form di login
			$.mobile.changePage("#loginPage");
			return;
			
		} // fine devi effettuare il login
		
	} // fine messaggio di notifica
	
} // fine funzione sync_data

function callbacksync_data(messaggio,percentuale,cosa){
	
	   // aggiorna area di notifica
	   $("#sync_info_operation").val(messaggio);
		
	   // aggiorna progress bar
	  // $('#progress-bar').val(percentuale);
	  // $('#progress-bar').slider('refresh');
	
}

function callbacksync_data_end(result){
	
	if(result.syncOK === true && result.serverAnswer.message != "undefined") {
		    
	    	 // NASCONDI ROTELLA
	    	 //$.mobile.loading('hide');		
	 	     $("#sync_info_response").append(result.serverAnswer.message).keyup();

	         
	         // PULISCI IL DATABASE
	         check_data_to_sync(db);
	         
	         //$.mobile.loading('hide');		
 
     } // fine if	    
 }
 
function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}