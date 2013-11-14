var login_submitBtn = "#submitBtn";

// associa il gestore alla perssione del tasto di effettua login
function init_loginPage(){
	$("form").on("submit", false);
	$(login_submitBtn).on("click", handleLogin);
}

// controlla il valore della variabile userid e blocca il tasto
// effettua login della index
function check_Login(){
	if(userid == null || userid <= 0)
		$(index_loginBtn).removeClass("ui-disabled");
}

// gestore del tasto effettua login
function handleLogin() {
	
	var form = $("#loginForm");
	$(login_submitBtn, form).attr("disabled", "disabled");
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

// funzione di callback login effettuato
function successLogin(result){
	
	// SETTA LA VARIABILE DI SESSIONE
	window.localStorage.setItem("userid", parseInt(result));

	// CAMBIA PAGINA E TORNA A QUELLA PRINCIPALE
	$.mobile.changePage("#indexPage");

	// DISABILITA PULSANTE LOGIN SE NON EFFETTUATO
    $(index_loginBtn).addClass("ui-disabled");
    
    console.log("LOGIN EFFETTUTATO CON SUCCESSO");
    
    service_sync_url += "&user_id="+parseInt(result);
    DBSYNC.setServerUrl = service_sync_url;

	// riabilita tasto login
	$(login_submitBtn, form).removeAttr("disabled");

}

// funzione di callback login error
function errorLogin(titolo,messaggio){
	
	navigator.notification.alert(messaggio, function() {},titolo);
	console.log("LOGIN FALLITO");
	
	// riabilita tasto login
	$(login_submitBtn, form).removeAttr("disabled");

}
/* END LOGIN FUNCTION */
