var censimento_ins = -1;

function save_infoGenerali(){
	
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


function save_Segnaletica(){	
	
	// SE I DATI SONO VALIDATI
	if(validate_Segnaletica()){
				
		//console.log("chiamo la funzione di salvataggio");
	    db.transaction(dataSave_Segnaletica, errordataSave_Segnaletica,successdataSave_Segnaletica);
	    
	    // DISABILITO IL PULSANTE
	    $("#salva-SegnaleticaBtn").button('disable').addClass("ui-disabled");
		$('#salve-SegnaleticaBtn').button('refresh');  
	} 
}

function successdataSave_Segnaletica(){
	
	// azzero il censiemnto inserito
	azzera_censimento_inserito();
		
	// CANCELLA IL FORM PER IL PROSSIMO INSERIMENTO	
	inizializza_Segnaletica();
    
	// RIABILITO IL PULSANTE
    $("#salva-SegnaleticaBtn").button('enable').removeClass("ui-disabled");
	$('#salva-SegnaleticaBtn').button('refresh');    
	
	// controlla se ci sono dati da trasmettere
	//check_data_to_sync(db);
	
	// ritorna alla prima schermata
	$.mobile.changePage("#indexPage");
	
}

function errordataSave_Segnaletica(){
	alert("Errore Durante il Salvataggio delle informazioni di Segnaletica");
}


function dataSave_Segnaletica(tx){
	
	//alert("salvo i dati");
	
	//console.log("sono in data save");

		var numero_cartelli = $("#numero_cartelli").val();

		// ESEGUO LA TRANSAZIONE RECUPERANDO TUTTO IL RESTO
		tx.executeSql("SELECT rowid FROM censimento WHERE rowid = ?",[censimento_ins],function(tx,res){
			
			// RECUPERA E PROCESSA CARTELLI
			if(numero_cartelli > 0){
								
				//RECUPERA DATI CARTELLO
				for(var i=0;i<numero_cartelli;i++){
					
					var cartello_segnale = $("#cartello_segnale_"+i).val();
					var cartello_supporto = $("select[name='cartello_supporto_"+i+"']").val();
					var cartello_pellicola = $("select[name='cartello_pellicola_"+i+"']").val();
					
					// RECUPERO OMOLOGAZIONE
					var cartello_omologato = "off";
					if($("#omologato_"+i).is(':checked'))
						cartello_omologato = "on";
						
					// RECUPERO CARTELLO MARCHIATO CE
					var cartello_marchiato_ce = "off";
					var marchiato_ce = 0;
					if($("#marchiato_ce_"+i).is(':checked')){
						cartello_marchiato_ce = "on";
						marchiato_ce = 1;
					}
						
					// RECUPERO NECESSARIO INTERVENTO E ESAME
					var necessario_intervento_tipo = $("#cartello_necessario_intervento_tipo_"+i).val();
					var necessario_intervento_descrizione = $("#cartello_necessario_intervento_descrizione_"+i).val();
					
					var forma = $("#cartello_forma_"+i).val();
					var lato = $("#cartello_lato_"+i).val();
					var altezza = $("#cartello_altezza_"+i).val();
					var particolari_descrizione = $("#particolari_descrizione_"+i).val();
										
					// RECUPERA DATI OMOLOGAZIONE
					var omologato = "";
					var ditta_prod = "";
					var ditta_inst = "";
					var data_inst = "";
					var ord_n = "";
					var ord_del = "";
					
					// CONTROLLA IL FLAG OMOLOGATO
					if(cartello_omologato == "on"){
						omologato = 1;
						ditta_prod = $("input[name='cartello_ditta_produttrice_"+i+"']").val();
						ditta_inst = $("input[name='cartello_ditta_installatrice_"+i+"']").val();
						data_inst = $("input[name='cartello_data_installazione_"+i+"']").val();
						ord_n = $("input[name='cartello_ordinanza_numero_"+i+"']").val();
						ord_del = $("input[name='cartello_ordinanza_del_"+i+"']").val();
					}
					
					
					//console.log("omologato "+omologato);
					//console.log("se marchiato_ce: "+marchiato_ce);
					//console.log("prod "+ditta_prod);
					//console.log("install "+ditta_inst);
					//console.log("data inst "+data_inst);
					//console.log("ord n "+ord_n);
					//console.log("ord_del "+ord_del);
					//console.log("necessario intervento tipo"+necessario_intervento_tipo);
					//console.log("necessario intervento descrizione:"+necessario_intervento_descrizione);
					//console.log("cartello_forma "+forma);
					//console.log("cartello_lato "+lato);
					//console.log("cartello_altezza "+altezza);
					//console.log("particolari_descrizione"+particolari_descrizione);
					
					tx.executeSql('INSERT INTO censimento_cartello (censimento_id,segnale_id,pellicola_id,supporto_id,marchiato_ce_ck,omologato_ck,ditta_produttrice,ditta_installatrice,data_installazione,ordinanza_n,ordinanza_del,necessario_intervento_tipo,necessario_intervento_descrizione,forma,lato,altezza,particolari_descrizione) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[censimento_ins,cartello_segnale,cartello_pellicola,cartello_supporto,marchiato_ce,omologato,ditta_prod,ditta_inst,data_inst,ord_n,ord_del,necessario_intervento_tipo,necessario_intervento_descrizione,forma,lato,altezza,particolari_descrizione]);

				}

			}

			// RECUPERA E PROCESSA IL NUMERO DEI PALI
			if(numero_pali > 0){
				
				//console.log("quanti pali "+numero_pali);
				
				for(var i=0;i<numero_pali;i++){
					
					var palo_dimensione = $("input[name='palo_dimensione_"+i+"']").val();
					var palo_controvento = $("input[name='palo_controvento_"+i+"']").val();
					var palo_controvento_dimensione = $("input[name='palo_controvento_dimensione_"+i+"']").val();
					
					
					if(palo_controvento == "on")
						palo_controvento = 1;
						
					//console.log("palo dimensione :"+palo_dimensione);
					//console.log("palo_controvento :"+palo_controvento);
					//console.log("palo_controvento_dimensione: "+palo_controvento_dimensione);
					
					tx.executeSql('INSERT INTO censimento_palo (censimento_id,dimensione,palo_controvento,dimensione_controvento) VALUES (?,?,?,?)',[censimento_ins,palo_dimensione,palo_controvento,palo_controvento_dimensione]);

				}
				
			}
			
			// RECUPERA E PROCESSA IL NUMERO DELLE STAFFE
			if(numero_staffe > 0){
				
				//console.log("numero staffe:"+numero_staffe);
				for(var i=0;i<numero_staffe;i++){
					
					var staffa = $("select[name='staffa_"+i+"']").val();
					//console.log("staffa "+staffa);
					tx.executeSql('INSERT INTO censimento_staffa (censimento_id, modello_staffa) VALUES (?,?)',[censimento_ins,staffa]);
  
				}
				
			}
			
		});
}

function save_Beni(){
	
	// SE I DATI SONO VALIDATI
	if(validate_Beni()){
				
		//console.log("chiamo la funzione di salvataggio");
	    db.transaction(dataSave_Beni, errordataSave_Beni,successdataSave_Beni);
	    
	    // DISABILITO IL PULSANTE
	    $("#salva-beniBtn").button('disable').addClass("ui-disabled");
		$('#salva-beniBtn').button('refresh');  
	} 
}

function dataSave_Beni(tx){
	
	// RECUPERO I VALORI
	var tipologia_bene_id = $("#tipologia_bene_id").val()
	var nome = $("#nome").val();
	var descrizione = $("#descrizione").val();
	var annotazioni = $("#annotazioni").val();
	
	// INSERISCO IL CENSIMENTO
	tx.executeSql("INSERT INTO censimento_bene (censimento_id,tipologia_bene_id,nome,descrizione,annotazioni) VALUES (?,?,?,?,?)",[censimento_ins,tipologia_bene_id,nome,descrizione,annotazioni]);
	
}

function successdataSave_Beni(){
	
	// azzero il censiemnto inserito
	azzera_censimento_inserito();
		
	// azzera view dati generali
	inizializza_Beni();
	
	// RIABILITO IL PULSANTE
    $("#salva-BeniBtn").button('enable').removeClass("ui-disabled");
	$('#salva-BeniBtn').button('refresh');    
	
	// ritorna alla prima schermata
	$.mobile.changePage("#indexPage");
	
}

function errordataSave_Beni(){
	alert("Errore Durante il Salvataggio");
}

function azzera_censimento_inserito(){
	censimento_ins = -1;
}
