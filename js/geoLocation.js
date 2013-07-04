var watchID;

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

function successCallback(position){
			
	console.log("gps callback");
																
	// SCRIVO LATITUDINE E LONGITUDINE
	var lon,lat,acc;
	lat = $("#latitude").val();
	lon = $("#longitude").val(); 
	acc = $("#accuracy").val();
	
	// ACQUISISCI
	var lat_r = position.coords.latitude;
	var lon_r = position.coords.longitude;
	var acc_r = position.coords.accuracy;
	
	// POPOLA LA PRIMA VOLTA I DATI
	if(lat == "" && lon == "" && acc == ""){
		$("#latitude").val(lat_r);
		$("#longitude").val(lon_r);
		$("#accuracy").val(acc_r);
	}
	else{

		// SE MIGLIORA LA PRECISIONE AGGIORNA
		if(parseInt(acc_r) < parseInt(acc)){
			$("#latitude").val(lat_r);
			$("#longitude").val(lon_r);
			$("#accuracy").val(acc_r);
		}
	}
    
};
						
function errorCallback(error){
    switch(error.code){
    case error.PERMISSION_DENIED:
        //document.write("PERMISSION DENIED");
		disableSubmit();        
	break;
    case error.POSITION_UNAVAILABLE:
        //alert("POSIZIONE NON DISPONIBILE");
		disableSubmit();        
	break;
    case error.TIMEOUT:
        //alert("TIMEOUT");
		disableSubmit();        
	break;
    case error.UNKNOW_ERROR:
        //document.write("Unknown error");
		disableSubmit();
        break;              
    }
}

function disableSubmit(){
	$("#submit").attr('disabled','disabled');
}

function enableSubmit(){
	$("#submit").removeAttr('disabled');
}
function clearWatch(){
   navigator.geolocation.clearWatch(watchID);
}
