/* LOGIN FUNCTION */
function handleLogin() {
	
	var form = $("#loginForm");
	$("#submitBtn", form).attr("disabled", "disabled");
	var username = $("#username", form).val();
	var password = $("#password", form).val();
	
	/* CONTROLLO INTEGRITA' */
	if (username != '' && password != '') {
		
		$.ajax({
			type : "POST",
			url : "http://www.gretacity.com/Service/index.php?s=censiq-login",
			data : {
				action : "login",
				username : username,
				password : password
			}
		}).done(function(result) {
						
			if (result > 0)
				successLogin(result);
			else
				errorLogin("Errore Login","Login Fallito");
				
		}); // FINE RICHIESTA AJAX

	}// FINE CONTROLLO INTEGRITA'
	
	else 
		errorLogin("Errore Login","Inserire username e password");

}

function successLogin(result){
	
	// SETTA LA VARIABILE DI SESSIONE
	window.localStorage.setItem("userid", parseInt(result));

	// CAMBIA PAGINA E TORNA A QUELLA PRINCIPALE
	$.mobile.changePage("#indexPage");

	// DISABILITA PULSANTE LOGIN SE NON EFFETTUATO
    $("#loginbtn").addClass("ui-disabled");
    
    console.log("LOGIN EFFETTUTATO CON SUCCESSO");
	
}
function errorLogin(titolo,messaggio){
	
	navigator.notification.alert(messaggio, function() {},titolo);
	console.log("LOGIN FALLITO");

}
/* END LOGIN FUNCTION */
