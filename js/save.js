function save(){	
	
	alert("salvo");	
	
	if(validate()){
		
		alert("valida");
		
		//console.log("chiamo la funzione di salvataggio");
	    db.transaction(dataSave, errorDataSave,successDataSave);
	    
	    // DISABILITO IL PULSANTE
	    $("#save").button('disable').addClass("ui-disabled");
		$('#save').button('refresh');  
	} 
	
}

function dataSave(tx){
	
	//alert("salvo i dati");
	
	//console.log("sono in data save");
	
	var qr_code = $("#qr_code").val();
	var latitude = $("#latitude").val();
	var longitude = $("#longitude").val();
	
	var numero_cartelli = parseInt($("#numero_cartelli").val());
	var numero_pali = parseInt($("#numero_pali").val());
	var numero_staffe = parseInt($("#numero_staffe").val());
	
	// INSERISCO IL CENSIMENTO
	tx.executeSql("INSERT INTO censimento (qr_code, lat,lon,sync) VALUES (?,?,?,0)",[qr_code,latitude,longitude],
	
		// ESEGUO LA TRANSAZIONE RECUPERANDO TUTTO IL RESTO
		function(tx,res){
			
			var censimento_ins = res.insertId;
			
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
					var cartello_necessario_intervento = "off";
					var cartello_esame_obiettivo = "";
					var necessario_intervento = 0;
					if($("#necessario_intervento_"+i).is(':checked')){
						cartello_necessario_intervento = "on";
						cartello_esame_obiettivo = $("#esame_obiettivo_"+i).val();
						necessario_intervento = 1;

					}
					
			
					
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
					
					/*
					console.log("omologato "+omologato);
					console.log("se marchiato_ce: "+marchiato_ce);
					console.log("prod "+ditta_prod);
					console.log("install "+ditta_inst);
					console.log("data inst "+data_inst);
					console.log("ord n "+ord_n);
					console.log("ord_del "+ord_del);
					console.log("necessario intervento"+necessario_intervento);
					console.log("esame obiettivo:"+cartello_esame_obiettivo);
					*/
					
					tx.executeSql('INSERT INTO censimento_cartello (censimento_id,segnale_id,pellicola_id,supporto_id,marchiato_ce_ck,omologato_ck,ditta_produttrice,ditta_installatrice,data_installazione,ordinanza_n,ordinanza_del,necessario_intervento_ck,esame_obiettivo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',[censimento_ins,cartello_segnale,cartello_pellicola,cartello_supporto,marchiato_ce,omologato,ditta_prod,ditta_inst,data_inst,ord_n,ord_del,necessario_intervento,cartello_esame_obiettivo]);

				}

			}
			
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
				
			
			// RECUPERA E PROCESSA IL NUMERO DEI PALI
			if(numero_pali > 0){
				
				//console.log("quanti pali "+numero_pali);
				
				for(var i=0;i<numero_pali;i++){
					
					var palo_dimensione = $("input[name='palo_dimensione_"+i+"']").val();
					var palo_controvento = $("input[name='palo_controvento_"+i+"']").val();
					var palo_controvento_dimensione = $("input[name='palo_controvento_dimensione_"+i+"']").val();
					
					
					if(palo_controvento == "on")
						palo_controvento = 1;
					/*	
					console.log("palo dimensione :"+palo_dimensione);
					console.log("palo_controvento :"+palo_controvento);
					console.log("palo_controvento_dimensione: "+palo_controvento_dimensione);
					*/
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


function successDataSave(){
	
	//alert("Censimento Memorizzato");
	
	// CANCELLA IL FORM PER IL PROSSIMO INSERIMENTO	
	inizializza_road();
    
	// RIABILITO IL PULSANTE
    $("#save").button('enable').removeClass("ui-disabled");
	$('#save').button('refresh');    
	
	// controlla se ci sono dati da trasmettere
	check_data_to_sync(db);
	
	// ritorna alla prima schermata
	$.mobile.changePage( "#sync", { transition: "none"} );
	
}

function errorDataSave(){
	alert("Errore Durante il Salvataggio");
}