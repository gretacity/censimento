// pulisce i campi di censimentoSegnaletica
function inizializza_Segnaletica(){
	// azzera cartelli
	$("#numero_cartelli").val("0");
	$("#numero_cartelli").removeAttr('readonly');
	$("#dettaglio_cartelli").html("").css('display','none');

	// azzera retro cartelli
	$("#col_retro_cartello h3" ).addClass( "ui-disabled" );
	$("#dettaglio_omologazione").html("").css('display','none');

	// azzero i pali
	$("#numero_pali").val("0");
	$("#numero_pali").removeAttr('readonly');
	$("#dettaglio_pali").html("").css('display','none');
	
	// azzero le staffe	
	$("#numero_staffe").val("0");
	$("#numero_staffe").removeAttr('readonly');
	$("#dettaglio_staffe").html("").css('display','none');
	
    // reinizializzo la pagina
    $("#censimentoSegnaleticaPage div[data-role='content']").trigger('create');
}

// gestore del bottone segnaletica in cosa censire
function handler_cosasegnaletica(){
	// CAMBIA PAGINA (PRINCIPALE)
    $.mobile.changePage("#censimentoSegnaleticaPage");	
    
    // SVUOTA I CAMPI IMPORTANTI
    inizializza_Segnaletica();
  	
	// FORZA APERTURA DIV INFO GENERALI SU CENSIMENTO
	$('#info_generali').trigger('expand').trigger('updatelayout');
}

// gestore add dettaglio cartelli in segnaletica
function handler_segnaletica_add_dettcartelli(){
	
	// SVUOTA IL DETTAGLIO CARTELLI E IL RETRO
	$("#dettaglio_cartelli").empty();
	$("#dettaglio_omologazione").empty();
	
	var numero_cartelli = $("#numero_cartelli").val();

	// CONTROLLO IL NUMERO DI CARTELLI
	var check = false;
	if(numero_cartelli >= 10)
		check = confirm("Questa operazione potrebbe richiedere del tempo, Continuare?");
	else
		check = true;

	// CONTROLLA IL NUMERO DI CARTELLI
	if(numero_cartelli > 0 && check){
		
		// GENERA DETTAGLIO CARTELLI 
		dettaglio_cartelli(numero_cartelli);
		
		$("#dettaglio_cartelli").fadeIn("slow");
		
		// GENERA DETTAGLIO OMOLOGAZIONE
		dettaglio_omologazione(numero_cartelli);

		$("#dettaglio_omologazione").fadeIn("slow");
		
		// RENDI VISIBILE RETRO CARTELLO
		$("#col_retro_cartello h3").removeClass("ui-disabled");
		
	}
}

// gestore add dettaglio pali in segnaletica
function handler_segnaletica_add_dettpali(){
		
	// SVUOTA IL DETTAGLIO PALI
	$("#dettaglio_pali").empty();
			
	var numero_pali = $("#numero_pali").val();
	
	// CONTROLLO IL NUMERO DI PALI
	var check = false;
	if(numero_pali >= 10)
		check = confirm("Questa operazione potrebbe richiedere del tempo, Continuare?");
	else
		check = true;

	// CONTROLLA IL NUMERO DI CARTELLI
	if(numero_pali > 0 && check){
					
		// GENERA DETTAGLIO PALI
		dettaglio_pali(numero_pali);
		
		$("#dettaglio_pali").fadeIn("slow");
		
	}
}

// gestore add dettaglio staffe in segnaletica
function handler_segnaletica_add_dettstaffe(){
		
	// SVUOTA IL DETTAGLIO STAFFE
	$("#dettaglio_staffe").empty();
	
	var numero_staffe = $("#numero_staffe").val();
	
	// CONTROLLO IL NUMERO DI PALI
	var check = false;
	if(numero_staffe >= 10)
		check = confirm("Questa operazione potrebbe richiedere del tempo, Continuare?");
	else
		check = true;

	// CONTROLLA IL NUMERO DI CARTELLI
	if(numero_staffe > 0 && check){
				
		// GENERA DETTAGLIO PALI
		dettaglio_staffe(numero_staffe);
		
		$("#dettaglio_staffe").fadeIn("slow");
	}
}

//################################################################################################################
// FUNZIONI ASSOCIATE AGLI EVENTI

// SELEZIONA CARTELLO DA LISTA DI RICERCA
function seleziona_cartello(index,value){
	
	// RIMUOVI GLI ALTRI RISULTATI DELLA RICERCA		
	$('#suggestions_'+index+' li[id!='+value+']').remove();
	
	// INSERISCI DATO IN CAMPO NASCOSTO
	$('#cartello_segnale_'+index).val(value);
	
	// CAMBIO COLORE DI SFONDO ALL'ELEMENTO DELLA LISTA
	$('#suggestions_'+index+' li[id='+value+']').attr("data-theme", "b").removeClass("ui-btn-up-c").removeClass('ui-btn-hover-c').addClass("ui-btn-up-selezionato").addClass("ui-btn-hover-selezionato");

	// SCRIVI CARTELLO SELEZIONATO
	//$('#cartello_selezionato_messaggio_'+index).html("<i>Cartello Selezionato</i>").css("color","green");

}

function dettaglio_intervento_descrizione(indice){
	
	
	var valore = $("#cartello_necessario_intervento_tipo_"+indice).val();
	
	// SE NECESSARIO INTERVENTO
    if(valore == 1 || valore == 3 ) {		
    		      			      
	 	// MOSTRA DESCRIZIONE 
     	$("#div_necessario_intervento_descrizione_"+indice).trigger('create');
        $("#div_necessario_intervento_descrizione_"+indice).fadeIn("slow");
	 	
    } 
    else{
    	
		// NASCONDI DESCRIZIONE
        $("#div_necessario_intervento_descrizione_"+indice).fadeOut("slow");
   	}
	
}

function dettaglio_forma(indice){
	
	var forma = $("#cartello_forma_"+indice).val();
		
	// FORMA RETTANGOLO 2 MISURE
	if(forma == 2){
		
		 // APRI DETTAGLI OMOLOGAZIONE
       	$("#div_altezza_"+indice).trigger('create');
        $("#div_altezza_"+indice).fadeIn("slow");
    }
    else{
    	
    	$("#div_altezza_"+indice).fadeOut("slow");

    }
   
}

function dettagli_omologazione(indice){
	
	// SE OMOLOGATO CHECK
    if($("#omologato_"+indice).is(':checked')) {		
    		      			      
      // APRI DETTAGLI OMOLOGAZIONE
      $("#cartello_omologato_dettagli_"+indice).trigger('create');
      $("#cartello_omologato_dettagli_"+indice).fadeIn("slow");
      
    } 
    else{
    
      // SE DETTAGLI OMOLOGAZIONE APERTO
   	  if($("#cartello_omologato_dettagli_"+indice).css('display') != "none")
   	  		
   	  		 // CHIUDI DETTAGLI OMOLOGAZIONE
     		 $("#cartello_omologato_dettagli_"+indice).fadeOut("slow");
    }
}

function dettagli_palo_controvento(indice){

	
	// SE PALO CONTROVENTO CHECK				
    if($("#palo_controvento_"+indice).is(':checked')) {		
    		      			      
      // APRI DETTAGLI PALO CONTROVENTO
      $("#palo_controvento_dettagli_"+indice).trigger('create');
      $("#palo_controvento_dettagli_"+indice).fadeIn("slow");
      
    } 
    else{
    
      // SE DETTAGLI PALO CONTROVENTO APERTO
   	  if($("#palo_controvento_dettagli_"+indice).css('display') != "none")
   	  		
   	  		 // CHIUDI DETTAGLI PALO CONTROVENTO
     		 $("#palo_controvento_dettagli_"+indice).fadeOut("slow");
    }
}

function cambia_tipologia(select_tipologia_name,index){
	// IMPOSTA LA TIPOLOGIA SELEZIONATA NELL'ARRAY DELLE TIPOLOGIE
	tipologia[index] = $(select_tipologia_name).val();
}

//################################################################################################################
//PAGINE GENERATE DINAMICAMENTE IN BASE AI DATI INSERITI

function dettaglio_cartelli(numero_cartelli){
		
	var str = "";
	
	for(var i=0;i<numero_cartelli;i++){

		str = "<h3>Cartello "+(i+1)+"</h3>"+
			  "<p>"+				  
			  "<label>Inserisci Figura C.d.S. o breve Descrizione:</label>"+		
			  " <p>"+
						"<input type='search' id='cerca_segnale_"+i+"' name='cerca_segnale_"+i+"' placeholder='Cerca Segnale'/>"+
						"<a onclick='cerca_cartello("+i+")' data-role='button'>Cerca</a>"+ 
						"<input type='hidden' id='cartello_segnale_"+i+"' name='cartello_segnale_"+i+"' />"+
						"<ul id='suggestions_"+i+"' data-role='listview' data-inset='true' data-split-theme='d'></ul>"+
			  " </p>"+
			  "</p>"+
		      "<p>"+
	          "   <label>Supporto:</label>"+
			  "	    <select name='cartello_supporto_"+i+"'>"+
			  "        <option value='1' selected>Ferro</option>"+
			  "        <option value='2'>Alluminio</option>"+
			  "     </select>"+
	          "</p>"+
        	  "<p>"+
              "   <label>Pellicola:</label>"+
			  "     <select name='cartello_pellicola_"+i+"'>"+
			  "        <option value='1' selected>E.G. Classe I</option>"+
			  "        <option value='2'>H.I. Classe II</option>"+
			  "        <option value='3'>H.I. Special III</option>"+
			  "     </select>"+
			  "</p>"+
			  "<hr />"+
			  "<p>"+
	          "   <label>Tipo Intervento:</label>"+
			  "      <select onchange='dettaglio_intervento_descrizione("+i+")' id='cartello_necessario_intervento_tipo_"+i+"' name='cartello_necessario_intervento_tipo_"+i+"'>"+
			  "        <option value='0' selected>Non Necessario</option>"+
			  "        <option value='1'>Sostituzione Parziale</option>"+
			  "        <option value='2'>Sostituzione Totale</option>"+
  			  "        <option value='3'>Soggetto a Manutenzione</option>"+
			  "      </select>"+
			  "</p>"+
			  "<p id='div_necessario_intervento_descrizione_"+i+"' style='display:none;'>"+
	          "   <label>Descrizione dell'intervento:</label>"+
			  "	    <textarea id='cartello_necessario_intervento_descrizione_"+i+"' name='cartello_necessario_intervento_descrizione_"+i+"'></textarea>"+
	          "</p>"+
			  "<hr />"+
			  "<p>"+
	          "   <label>Forma:</label>"+
			  "      <select onchange='dettaglio_forma("+i+")' id='cartello_forma_"+i+"' name='cartello_forma_"+i+"'>"+
			  "        <option value='0' selected>Quadrato</option>"+
			  "        <option value='1'>Rombo</option>"+
			  "        <option value='2'>Rettangolo</option>"+
  			  "        <option value='3'>Triangolo</option>"+
			  "        <option value='4'>Cerchio</option>"+
  			  "        <option value='5'>Ottagono</option>"+
			  "      </select>"+
			  "</p>"+
			  "<p >"+
	          "   <label>Lato (cm):</label>"+
			  "      <input type='text' id='cartello_lato_"+i+"' name='cartello_lato_"+i+"' placeholder='Dimensione (cm)'/>"+
	          "</p>"+
	          "<p id='div_altezza_"+i+"' style='display:none;' >"+
	          "   <label>Altezza (cm):</label>"+
			  "      <input type='text' id='cartello_altezza_"+i+"' name='cartello_altezza_"+i+"' placeholder='Dimensione (cm)'/>"+
	          "</p>"+
  	          "<p id='div_particolari_descrizione_"+i+"' >"+
	          "   <label>Particolari Descrizione:</label>"+
			  "	    <textarea id='particolari_descrizione_"+i+"' name='particolari_descrizione_"+i+"'></textarea>"+
	          "</p>"+
	          "<hr />";
		  
		 
			 $('#dettaglio_cartelli').append(str);
	}	
	
	$('#dettaglio_cartelli').trigger('create');
}

function dettaglio_omologazione(numero_cartelli){
	
	var str = "";
		
	for(var i=0;i<numero_cartelli;i++){
		
		str = "<h3>Cartello "+(i+1)+"</h3>"+
			  "<div data-role='fieldcontain' >"+
		      "     <fieldset data-role='controlgroup'>"+
			  "     <input type='checkbox' name='cartello_marchiato_ce_"+i+"' id='marchiato_ce_"+i+"' onclick='controlla_marchiatura("+i+")' class='custom' />"+
			  "        <label for='marchiato_ce_"+i+"'>Marchiato CE</label>"+
			  "     </fieldset>"+
			  "</div>"+ 
			  "<div data-role='fieldcontain' id='omologato_check_"+i+"' >"+
		      "     <fieldset data-role='controlgroup'>"+
			  "     <input type='checkbox' name='cartello_omologato_"+i+"' id='omologato_"+i+"' onclick='dettagli_omologazione("+i+")' class='custom' />"+
			  "        <label for='omologato_"+i+"'>Omologato</label>"+
			  "     </fieldset>"+
		  	  "</div>"+ 
			  "<!-- se il cartello è omologato -->"+
			  "<div id='cartello_omologato_dettagli_"+i+"' style='display:none'>"+
			  " <p>"+
			  "    <label>Ditta Produttrice:</label><br />"+
			  "    <input type='text' name='cartello_ditta_produttrice_"+i+"' />"+
			  " </p>"+
			  " <p>"+
			  "    <label>Ditta Installatrice:</label><br/>"+
			  "    <input type='text' name='cartello_ditta_installatrice_"+i+"' />"+ 
			  " </p>"+
			  " <p>"+
			  "    <label>Data Installazione:</label><br/>"+
			  "    <input type='text' name='cartello_data_installazione_"+i+"' />"+ 
			  " </p>"+
			  " <p>"+
			  "    <label>Ordinanza n&deg;:</label><br/>"+
			  "    <input type='text' name='cartello_ordinanza_numero_"+i+"' />"+ 
			  " </p>"+
			  " <p>"+
			  "    <label>Ordinanza del:</label><br/>"+
			  "    <input type='text' name='cartello_ordinanza_del_"+i+"' />"+ 
			  " </p>"+ 
			  "</div>";
			  
			  
			  $("#dettaglio_omologazione").append(str);
	}
	
	$('#dettaglio_omologazione').trigger('create');
	 
}

function dettaglio_pali(numero_pali){
	
	var str = "";
		
	for(var i=0;i<numero_pali;i++){
	
		str = "<h3>Palo "+(i+1)+"</h3>"+
			  "<p>"+
            	 "<label>Dimensione:</label>"+
				 "<input id='palo_dimensione_"+i+"' type='number' name='palo_dimensione_"+i+"' title='Formato 1.20' placeholder='Formato 1.20' />"+
			  "</p>"+
        	  "<p>"+
    			 "<div data-role='fieldcontain' >"+					 
					"<fieldset data-role='controlgroup'>"+
						"<input type='checkbox' name='palo_controvento_"+i+"' id='palo_controvento_"+i+"' onclick='dettagli_palo_controvento("+i+")' class='custom' />"+
						"<label for='palo_controvento_"+i+"'>Palo Controvento</label>"+
				    "</fieldset>"+
				 "</div>"+
			     "<!-- se il cartello è omologato -->"+
			     "<div id='palo_controvento_dettagli_"+i+"' style='display:none'>"+
			    	"<p>"+
			    		"<label>Dimensione Palo Controvento:</label><br />"+
			    		"<input id='palo_controvento_dimensione_"+i+"' type='number' name='palo_controvento_dimensione_"+i+"' placeholder='Formato 1.20'/>"+
			    	"</p>"+
			   	 "</div>"+
        	  "</p>"+
        	  "<hr />";
	
		$("#dettaglio_pali").append(str);
		
	}
	
	$('#dettaglio_pali').trigger('create');
}

function dettaglio_staffe(numero_staffe){
	
	var str = "";
	
	for(var i=0;i<numero_staffe;i++){
	
		str = "<h3>Staffa "+(i+1)+"</h3>"+
			  "<p>"+
        	  "<select name='staffa_"+i+"'>"+
        	  "  <option value='1' selected>Monofacciale</option>"+
        	  "  <option value='2'>Bifacciale</option>"+
        	  "</select>"+
        	  "</p>";
       
    	$("#dettaglio_staffe").append(str);
	     
   	}
	
	$('#dettaglio_staffe').trigger('create');
	
}

function controlla_marchiatura(indice){
	
  	if($("#marchiato_ce_"+indice).is(':checked')) {		
    
      // NASCONDI OMOLOGATO
   	  if($("#omologato_check_"+indice).css('display') != "none"){
   	  		
   	  		 // CHIUDI DETTAGLI PALO CONTROVENTO
     		 $("#omologato_check_"+indice).fadeOut("slow");
     	
      }
    				      
      // CHECK OMOLOGATO
	  $("#omologato_"+indice).attr("checked","checked");	  	  
	       			      
      // APRI DETTAGLI OMOLOGATO
      dettagli_omologazione(indice);
      
    } 
    else{
    	    	
        // TOGLI LA SPUNTA DA OMOLOGATO
  	    $("#omologato_"+indice).removeAttr("checked");	
  	    
        // NASCONDI OMOLOGATO
   	    if($("#omologato_check_"+indice).css('display') == "none"){
   	  		
   	  		 // CHIUDI DETTAGLI PALO CONTROVENTO
     		 $("#omologato_check_"+indice).fadeIn("slow");
     	
        }
	}
}

// INIZIO CONTROLLER SALVATAGGIO SEGNALETICA -----------------------------------------------------------------------------------------------
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
	
	var numero_cartelli = $("#numero_cartelli").val();
	var numero_pali = $("#numero_pali").val();
	var numero_staffe = $("#numero_staffe").val();
	
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
// FINE CONTROLLER SALVATAGGIO SEGNALETICA ------------------------------------------------------------------------------------------------------------------