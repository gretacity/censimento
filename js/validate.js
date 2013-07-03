$("#form-installazione").live('submit', function(){
	
	var dimensione = new RegExp(/^((\d)+)(\.(\d)+)?$/);
	var numerico = new RegExp(/^[\d]+$/);

   	var validate = true;
   	var message = "";
   	
    var qr_code = $("#qr_code").val();
    var latitude = $("#latitude").val();
    var longitude = $("#longitude").val();
    var numero_cartelli = $("#numero_cartelli").val();
        
    // BLOCCHI
 	if( (qr_code == "" || !(qr_code.match(numerico))) && validate ){
 		prec = "#qr_code";
 		message = "Qr-Code non valido , formato numerico";
 		validate = false;
 	}
 	
 	if( (latitude == "" || !(latitude.match(dimensione))) && validate ){
 		prec = "#latitude";
 		message = "Latitudine non valida , formato dd.dd";
 		validate = false;	
 	}
 	
 	if( (longitude == "" || !(longitude.match(dimensione))) && validate ){
 		prec = "#longitude";
 		message = "Longidutine non valida , formato dd.dd";
 		validate = false;	
 	}
 	
 	if( (numero_cartelli == "" || !(numero_cartelli.match(numerico))) && validate){
 		prec = "#numero_cartelli";
 		message = "Numero Cartelli non valido , maggiore di 0";
 		validate = false;
 	}
 	
 	// CONTROLLA SE TUTTI I CARTELLI SONO STATI SELEZIONATI
 	if( numero_cartelli > 0 && validate){

 		for(var i=0;i<numero_cartelli;i++){
 			
 			var cartello_segnale = $("#cartello_segnale_"+i).val(); 			
 			if(cartello_segnale == ""){
 				prec = "#searchField_"+i;
 				message = "Seleziona Cartello "+(i+1)+" da lista ricerca";
 				validate = false;
 				
 				break;
 			}
 			
 		}
 	}
 	
 	
 	

	if(!validate)
		alert(message);
		
	else{
		
		clearWatch(watchID);
		
		// INVIA I DATI
		return true;

	}
	
	return false;
});