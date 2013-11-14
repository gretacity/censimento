// controller del tasto inizia a censire
function handler_iniziacensire(){
			
	// CONTROLLO CHE NON SIA STATO LASCIATO UN CENSIMENTO A META
	if(censimento_ins == -1){
							
		// CONSOLE LOG
		console.log("aggiorna e azzera i valori di info generali");		
	    navigator.geolocation.getCurrentPosition(successPosition, errorPosition);
	   
	    // CAMBIA PAGINA (PRINCIPALE)
	    $.mobile.changePage("#infoGeneraliPage");	
	    
	    // pulisci caselle gps e bordale di rosso
	    clean_generali_GPS();
	
	}
	// scegli cosa censire
	else{
	    $.mobile.changePage("#cosa_censirePage");	
	}
}

// pulisce tutti i campi di infoGenerali
function inizializza_Generali(){
	
	// azzero i campi principali
	$("#qr_code").val("");	

	// cancello le foto
	$("#foto_fronte").val("");
	$("#foto_retro").val("");
	$("#foto_prospettiva").val("");
	
	// elimino i tag di foto selezionate
	$("#tag_foto_fronte").remove();
	$("#tag_foto_retro").remove();
	$("#tag_foto_prospettiva").remove();
	
}

// pulisce e colora i campi gps di generali
function clean_generali_GPS(){
	
	// SVUOTA I CAMPI IMPORTANTI 
    $("#latitude").val("");
	$("#longitude").val("");
	$("#accuracy").val("");
		
	// elimino i tag di foto selezionate
	$("#tag_foto_fronte").remove();
	$("#tag_foto_retro").remove();
	$("#tag_foto_prospettiva").remove();
	
	// IMPOSTA IL COLORE ROSSO SU I TEXTBOX IMPORTANTI
	$("#latitude, #longitude,#accuracy").css("background-color","#f2dede");	
}

// gestore bottone acquisisci in infogenerali
function handler_infogenerali_acquisisci(){
			
	var pattern_qr = new RegExp(/[\d]+$/);
	
	// BLOCCA TASTO QR
	$(this).button('disable').addClass("ui-disabled");
	$(this).button('refresh');    

	// ABILITA LA SCANSIONE
	scanner.scan( 
		
		 function(result) {
			
			var qr = result.text.match(pattern_qr);
			$("#qr_code").val(qr);	
			// SBLOCCA QR
			$(infogenerali_acquisisciBtn).button('enable').removeClass("ui-disabled");			
	     },
	     function(error) {
	     	
		    alert("SCANSIONE FALLITA: " + error);
		    // SBLOCCA QR
		    $(infogenerali_acquisisciBtn).button('enable').removeClass("ui-disabled");
		 }
   );
}

// CONTROLLER SALVATAGGIO GENERALI ---------------------------------------------------------------------------------------------------
function save_infoGenerali(){
	
	console.log("salva informazioni generali di censimento");
	
	// SE I DATI SONO VALIDATI
	if(validate_Generali()){
				
		//console.log("chiamo la funzione di salvataggio");
	    db.transaction(dataSave_generali, errordataSave_generali,successdataSave_generali);
	    
	    // DISABILITO IL PULSANTE
	    $("#salva-info_generaliBtn").button('disable').addClass("ui-disabled");
		$('#salva-info_generaliBtn').button('refresh');  
	} 
}

function dataSave_generali(tx){
		
	// ESEGUO LA TRANSAZIONE RECUPERANDO TUTTO IL RESTO

		// RECUPERA I DATI E CONTROLLA SE BENE O SEGNALETICA
		var qr_code = $("#qr_code").val();
		var latitude = $("#latitude").val();
		var longitude = $("#longitude").val();
		
		// INSERISCO IL CENSIMENTO
		tx.executeSql("INSERT INTO censimento (qr_code, lat,lon,sync) VALUES (?,?,?,0)",[qr_code,latitude,longitude],function(tx,res){
		
			// imposto il xid 
			censimento_ins = res.insertId;
						
			// RECUPERA LE FOTO
			var foto_fronte = $("#foto_fronte").val();
			var foto_retro = $("#foto_retro").val();
			var foto_prospettiva = $("#foto_prospettiva").val();
			
			if(foto_fronte != "")
				tx.executeSql('INSERT INTO censimento_foto (censimento_id,foto,tipo_foto) VALUES (?,?,?)',[censimento_ins,foto_fronte,1]);
		
			if(foto_retro != "")
				tx.executeSql('INSERT INTO censimento_foto (censimento_id,foto,tipo_foto) VALUES (?,?,?)',[censimento_ins,foto_retro,2]);
				
			if(foto_prospettiva != "")
				tx.executeSql('INSERT INTO censimento_foto (censimento_id,foto,tipo_foto) VALUES (?,?,?)',[censimento_ins,foto_prospettiva,3]);
			
		});
	
}

function successdataSave_generali(){
		
	// azzera view dati generali
	inizializza_Generali();
	
	// RIABILITO IL PULSANTE
    $("#salva-info_generaliBtn").button('enable').removeClass("ui-disabled");
	$('#salva-info_generaliBtn').button('refresh');    
	
	// controlla se ci sono dati da trasmettere
	//check_data_to_sync(db);
	
	// ritorna alla prima schermata
	$.mobile.changePage("#cosa_censirePage");
	
}

function errordataSave_generali(){
	alert("Errore Durante il Salvataggio");
}
// FINE CONTROLLER SALVATAGGIO ----------------------------------------------------------------------------------------------------
