var dimensione = new RegExp(/^(-?)(\d+)(\.\d+)?$/);
var numerico = new RegExp(/^[\d]+$/);

function validate_Generali(){
	
   	var validate = true;
   	var message = "";
	
    var qr_code = $("#qr_code").val();
    var latitude = $("#latitude").val();
    var longitude = $("#longitude").val();
	
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
 	
 	return evaluate(validate,message);

}

function validate_Segnaletica(){

   	var validate = true;
   	var message = "";
   	   	  
    // BLOCCHI
    var numero_cartelli = $("#numero_cartelli").val();
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
 	
	return evaluate(validate,message);

}

function validate_Beni(){
	
 	var validate = true;
   	var message = "";
   	
   	var tipologia_bene_id = $("#tipologia_bene_id").val();
   	   	
   	if(tipologia_bene_id == -1){
   		prec = "#tipologia_bene_id";
   		message = "Seleziona Tipologia del Bene";
   		validate = false;
   	}
	
	return evaluate(validate,message);
}

function evaluate(validate,message){
	
	if(validate)
		return true;
	
	alert(message);
	return false;
}
