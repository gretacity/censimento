function inizializzaAPP(){

	// GENERALE ----------------------------------------------------------------------------
	
	// APRI DATABASE
	db = window.openDatabase('record', '1.0', 'Censimenti da Sincronizzare',10485760);
	
	// INIZIALIZZA DATABASE
	db.transaction(inizializzaDB, errorDB,successDB);
	
	// CONTROLLO LA DISPONIBILITA DEL GPS
	if(navigator.geolocation)
	    navigator.geolocation.getCurrentPosition(successPosition, errorPosition);
	else{
		console.log("geolocalizzazione non supportata");
	    disableSubmit();
	}

	// ELIMINA FUNZIONAMENTO TASTO OK/CERCA 
	$("input").keyup(function(e){ if(e.which == 13){}});

	// CONTROLLA SE UTENTE LOGGATO
	var userid = window.localStorage.getItem("userid");
	if(userid == null || userid <= 0)
		$("#loginbtn").removeClass("ui-disabled");
		
	function disableSubmit(){ $("#submit").attr('disabled','disabled');}
	function enableSubmit(){ $("#submit").removeAttr('disabled');}


	// PAGINA SYNC -------------------------------------------------------------------------
	
	// SE CLICCO SU INIZIA A CENSIRE
	$("#inizia_censimento").tap(function(){
		
		// CONSOLE LOG
		console.log("aggiorna e azzera i valori");		
	    navigator.geolocation.getCurrentPosition(successPosition, errorPosition);
	   
	    // CAMBIA PAGINA (PRINCIPALE)
	    $.mobile.changePage("#censimentoPage");	
	    
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
				
		// FORZA APERTURA DIV INFO GENERALI SU CENSIMENTO
		$('#info_generali').trigger('expand').trigger('updatelayout');
		

	});

	// GESTISCI IL FORM SULLA LOGIN PAGE
	$(document).on('pageinit', '#loginPage', function() {
		$("form").on("submit", false);
		$('#submitBtn').on("click", handleLogin);
	});
	
	// PAGINA CENSIMENTO -------------------------------------------------------------------	
	
	$("#acquisisci_qr").tap(function(){
		
		// building con android
		var scanner = window.plugins.barcodeScanner;
		// building con phonegap build
		//var scanner = cordova.require("cordova/plugin/BarcodeScanner");
		var pattern_qr = new RegExp(/[\d]+$/);
		
		// BLOCCA TASTO QR
 		$(this).button('disable').addClass("ui-disabled");
		$(this).button('refresh');    

		// ABILITA LA SCANSIONE
		scanner.scan( function(result) {
			
			var qr = result.text.match(pattern_qr);
			$("#qr_code").val(qr);	
			
			// SBLOCCA QR
			$("#acquisisci_qr").button('enable').removeClass("ui-disabled");

						
	    },function(error) {
		    alert("SCANSIONE FALLITA: " + error);
		    
		    // SBLOCCA QR
		    $("#acquisisci_qr").button('enable').removeClass("ui-disabled");

		}
	   );
		
	});
	
	// DISABILITO IL RETRO CARTELLO ALL'INIZIO DELL'APP
	$("#col_retro_cartello h3" ).addClass( "ui-disabled" );
	
	// SE CAMBIA NUMERO CARTELLI 
	$("#add_dettaglio_cartelli").tap(function(){
	
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
	});
	
	// SE CAMBIA NUMERO PALI
	$("#add_dettaglio_pali").tap(function(){
		
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
	});
	
	// SE CAMBIA NUMERO STAFFE
	$("#add_dettaglio_staffe").tap(function(){
		
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
					
			//$("#numero_staffe").attr("readonly","readonly");
			
			// GENERA DETTAGLIO PALI
			dettaglio_staffe(numero_staffe);
			
			$("#dettaglio_staffe").fadeIn("slow");
		
		}
	});
	
	// SE CLICCO CATTURA FOTO FRONTE
	$("#cattura_foto_fronte").tap(function(){

		// CATTURA FOTO
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 25,
	    	destinationType: Camera.DestinationType.DATA_URL,
	    	sourceType : Camera.PictureSourceType.CAMERA,
	    	mediaType: Camera.MediaType.PICTURE,
	    	correctOrientation : true
		 }); 
		
		function onSuccess(imageData) {
		    //var image = document.getElementById('foto_fronte_img');
		    //image.src = "data:image/jpeg;base64," + imageData;
		    $("#foto_fronte").val(imageData);
		    $("#foto_fronte").after("<h4 id='tag_foto_fronte'>Foto Selezionata</h4>");

		   // alert(imageData);
		}
		
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	
	});

	// SE CLICCO CATTURA FOTO RETRO
	$("#cattura_foto_retro").tap(function(){

		// CATTURA FOTO
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 25,
	    	destinationType: Camera.DestinationType.DATA_URL,
	    	sourceType : Camera.PictureSourceType.CAMERA,
	    	mediaType: Camera.MediaType.PICTURE,
	    	correctOrientation : true

		 }); 
		
		function onSuccess(imageData) {
		    //var image = document.getElementById('foto_retro_img');
		    //image.src = "data:image/jpeg;base64," + imageData;
		    $("#foto_retro").val(imageData);
		    $("#foto_retro").after("<h4 id='tag_foto_retro'>Foto Selezionata</h4>");

		   // alert(imageData);
		}
		
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	
	});
	
	// SE CLICCO CATTURA FOTO PROSPETTIVA
	$("#cattura_foto_prospettiva").tap(function(){

		// CATTURA FOTO
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 25,
	    	destinationType: Camera.DestinationType.DATA_URL,
	    	sourceType : Camera.PictureSourceType.CAMERA,
	    	mediaType: Camera.MediaType.PICTURE,
	    	correctOrientation : true
	    	
		 }); 
		
		function onSuccess(imageData) {
		    //var image = document.getElementById('foto_prospettiva_img');
		    //mage.src = "data:image/jpeg;base64," + imageData;
		    $("#foto_prospettiva").val(imageData);
		    $("#foto_prospettiva").after("<h4 id='tag_foto_prospettiva'>Foto Selezionata</h4>");
		    //alert(imageData);
		}
		
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	
	});
		
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

function inizializza_road(){
	
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
    $("#censimentoPage div[data-role='content']").trigger('create');
	
}
