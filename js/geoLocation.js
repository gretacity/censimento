function successPosition(position){
			
<<<<<<< HEAD
	//console.log("gps callback");
	$("#latitude, #longitude,#accuracy").css("border","2px solid tranparent");
										
=======
>>>>>>> da0c585071e2d5f6541fecba25427fdda34d7344
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
<<<<<<< HEAD
	$("#longitude").val(lon_r);
	$("#accuracy").val(acc_r);
	
	$("#latitude, #longitude,#accuracy").css("background-color","#dff0d8");
};
						
function errorPosition(error){
=======
        $("#longitude").val(lon_r);
        $("#accuracy").val(acc_r);
        
        $("#latitude, #longitude,#accuracy").css("background-color","#dff0d8");
    
};
						
function errorCallback(error){
    
>>>>>>> da0c585071e2d5f6541fecba25427fdda34d7344
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

