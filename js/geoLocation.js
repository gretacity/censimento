function successCallback(position){
			
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
	$("#latitude").val(lat_r);
        $("#longitude").val(lon_r);
        $("#accuracy").val(acc_r);
        
        $("#latitude, #longitude,#accuracy").css("background-color","#dff0d8");
    
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
