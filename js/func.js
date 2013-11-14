function inizializzaAPP(){

	// ELIMINA FUNZIONAMENTO TASTO OK/CERCA 
	$("input").keyup(function(e){ if(e.which == 13){}});
	
	// APRI DATABASE
	db = window.openDatabase('record', '1.0', 'Censimenti da Sincronizzare',10485760);
	
	// INIZIALIZZA DATABASE
	db.transaction(inizializzaDB, errorDB,successDB);
	
	// controlla geolocalizzazione
	check_Geolocation();

	// CONTROLLA SE UTENTE LOGGATO
	check_Login();
		
	// wrapping tasto Sincronizza Censimenti
	// chiama la funzione sync_data
	$(index_syncdataBtn).tap(sync_data);
	
	// wrapping tasto Inizia a Censire
	// chiama la funzione handler_iniziacensire
	$(index_infogeneraliBtn).tap(handler_iniziacensire);
	
	// wrapping bottone salva in generali
	// chiama la funzione save_infoGenerali
	$(infogenerali_saveBtn).tap(save_infoGenerali);

	// wrapping bottone SEGNALETICA STRADALE
	$(cosa_segnaleticaBtn).tap(handler_cosasegnaletica);
	
	// wrapping botton BENI COMUNALI
	$(cosa_beneBtn).tap(handler_cosabene);

	// CONTROLLA DATI DA SINCRONIZZARE OGNI VOLTA CHE APRI INDEX
	$(document).on('pageshow',"#indexPage",show_indexPage);
	
	// GESTISCI IL FORM SULLA LOGIN PAGE
	$(document).on('pageinit', '#loginPage', init_loginPage);
	
	// FUNZIONI DELLA BENE PAGE
	$(document).on('pageinit', '#censimentoBenePage', init_benePage);

	// wrapping bottone acquisisci su generali
	$(infogenerali_acquisisciBtn).tap(handler_infogenerali_acquisisci);
	
	// DISABILITO IL RETRO CARTELLO ALL'INIZIO DELL'APP
	$("#col_retro_cartello h3" ).addClass( "ui-disabled" );
	
	// SE CAMBIA NUMERO CARTELLI 
	$(segnaletica_add_dettcartelli).tap(handler_segnaletica_add_dettcartelli);
	
	// SE CAMBIA NUMERO PALI
	$(segnaletica_add_dettpali).tap(handler_segnaletica_add_dettpali);
	
	// SE CAMBIA NUMERO STAFFE
	$(segnaletica_add_dettstaffe).tap(handler_segnaletica_add_dettstaffe);
	
	// SE CLICCO CATTURA FOTO FRONTE
	$(infogenerali_fotofronteBtn).tap(function(){

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
		}
		
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	
	});

	// SE CLICCO CATTURA FOTO RETRO
	$(infogenerali_fotoretroBtn).tap(function(){

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
		}
		
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	
	});
	
	// SE CLICCO CATTURA FOTO PROSPETTIVA
	$(infogenerali_fotoprospettivaBtn).tap(function(){

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
		}
		
		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	
	});
		
}

function show_indexPage(){	
	// se il db è pronto 
	// controlla se c'è da sincronizzare qualcosa	
	if(db != null){
		check_data_to_sync(db);
	}
}

function disableSubmit(){ $("#submit").attr('disabled','disabled');}
function enableSubmit(){ $("#submit").removeAttr('disabled');}



