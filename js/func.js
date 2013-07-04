// INIZIALIZZA IL GPS
var watchID;

function initApplication(){

	if(navigator.geolocation){
	    
		watchID = navigator.geolocation.watchPosition(successCallback, errorCallback,{
			enableHighAccuracy : true,
			timeout : 30000,
			maximumAge: 3000, 	
			frequency:250
			}
		);
		
	}
	else{
		console.log("geolocalizzazione non supportata");
	    disableSubmit();
	}
	
	// STICKY FOOTER
	$(document).on("pagecreate", ".ui-page", function () {
	    var $page  = $(this),
	        vSpace = $page.children('.ui-header').outerHeight() + $page.children('.ui-footer').outerHeight() + $page.children('.ui-content').height();
	
	    if (vSpace < $(window).height()) {
	        var vDiff = $(window).height() - $page.children('.ui-header').outerHeight() - $page.children('.ui-footer').outerHeight() - 30;
	        $page.children('.ui-content').height(vDiff);
	    }
	});
	
	$("#acquisisci_qr").tap(function(){
		
		var scanner = cordova.require("cordova/plugin/BarcodeScanner");
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

	
	// SE CAMBIA NUMERO CARTELLI 
	$("#add_dettaglio_cartelli").tap(function(){
	
		// SVUOTA IL DETTAGLIO CARTELLI E IL RETRO
		$("#dettaglio_cartelli").empty();
		$("#dettaglio_omologazione").empty();
		
		var numero_cartelli = $("#numero_cartelli").val();
		if(numero_cartelli > 0){
			
			//$("#numero_cartelli").attr("readonly","readonly");
			
			// MOSTRO IL CARICAMENTO
			$.mobile.loading('show');
			
			// GENERA DETTAGLIO CARTELLI 
			dettaglio_cartelli(numero_cartelli);
			
			//NASCONDO IL CARICAMENTO        
			$.mobile.loading('hide');
			
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
		if(numero_pali > 0){
			
			//$("#numero_pali").attr("readonly","readonly");
			
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
		if(numero_staffe > 0){
			
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
	    	mediaType: Camera.MediaType.PICTURE
	 
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
	    	mediaType: Camera.MediaType.PICTURE
	 
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
	    	mediaType: Camera.MediaType.PICTURE
	 
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

function dettagli_esame(indice){
	
	// SE NECESSARIO INTERVENTO
    if($("#necessario_intervento_"+indice).is(':checked')) {		
    		      			      
	 	// MOSTRA ESAME OBIETTIVO 
     	$("#cartello_esame_"+indice).trigger('create');
        $("#cartello_esame_"+indice).fadeIn("slow");
	 	
    } 
    else{
    	
		// NASCONDI ESAME OBIETTIVO
   	  	if($("#cartello_esame_"+indice).css('display') != "none")
   	  		
			$("#cartello_esame_"+indice).fadeOut("slow");
   	  	
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

function dettagli_staffe(indice){
	
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

// SELEZIONA CARTELLO DA LISTA DI RICERCA
function seleziona_cartello(index,value){

	// RIMUOVI GLI ALTRI RISULTATI DELLA RICERCA		
	$('#suggestions_'+index+' li[id!='+value+']').remove();
	
	// INSERISCI DATO IN CAMPO NASCOSTO
	$('#cartello_segnale_'+index).val(value);
	
	// SCRIVI CARTELLO SELEZIONATO
	$('#cartello_selezionato_messaggio_'+index).html("<i>Cartello Selezionato</i>").css("color","green");

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
              "  <div data-role='fieldcontain' >"+
		      "     <fieldset data-role='controlgroup'>"+
			  "     <input type='checkbox' name='cartello_necessario_intervento_"+i+"' id='necessario_intervento_"+i+"' onclick='dettagli_esame("+i+")' class='custom' />"+
			  "        <label for='necessario_intervento_"+i+"'>Necessario Intervento</label>"+
			  "     </fieldset>"+
		  	  "  </div>"+ 
			  "</p>"+
			  "<p style='display:none' id='cartello_esame_"+i+"'>"+
              "   <label>Esame Obiettivo:</label>"+
			  "     <textarea name='cartello_esame_obiettivo_"+i+"' id='esame_obiettivo_"+i+"'></textarea>"+
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
	//$("#latitude").val("");
	//$("#longitude").val("");
	//$("#accuracy").val("");
	$("#foto_fronte").val("");
	$("#foto_retro").val("");
	$("#foto_prospettiva").val("");
	
	$("#tag_foto_fronte").remove();
	$("#tag_foto_retro").remove();
	$("#tag_foto_prospettiva").remove();

	// azzera cartelli
	$("#numero_cartelli").val("0");
	$("#numero_cartelli").removeAttr('readonly');
	$("#dettaglio_cartelli").html("").css('display','none');

	// azzera retro cartelli
	$( "#col_retro_cartello h3" ).addClass( "ui-disabled" );
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
    $("#roadpage div[data-role='content']").trigger('create');
	
}