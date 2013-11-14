// pulisce campi di censimentoBeni
function inizializza_Beni(){		
	// SELEZIONA -seleziona- in tipologia bene
	$("#tipologia_bene_id").val('-1');
	$("#nome").val("");
	$("#descrizione").val("");
	$("#annotazioni").val("");
	
	// aggiorna la select
    $('#tipologia_bene_id').selectmenu('refresh', true);
	
    $("#censimentoBenePage div[data-role='content']").trigger('create');

}

// prepara la schermata di censimentoBeni per l'utente
function init_benePage(){
	// inserisci seleziona nella lista delle tipologie
	$("#tipologia_bene_id").append("<option value='-1'>-seleziona-</option>");

	$.each(bn_bene_tipologia,function(key,data){			
		$("#tipologia_bene_id").append("<option value='"+data.value+"'>"+data.label+"</option>");
	});
	
	// aggiorna la select
    $('#tipologia_bene_id').selectmenu('refresh', true);
}

// gestore del botton bene in cosa censire
function handler_cosabene(){	
	// CONSOLE LOG
	console.log("aggiorna e azzera i valori beni");		
   
    // CAMBIA PAGINA (PRINCIPALE)
    $.mobile.changePage("#censimentoBenePage");	
    
    // SVUOTA I CAMPI IMPORTANTI 
    inizializza_Beni();
}

// INIZIO CONTROLLER SALVATAGGIO BENI -----------------------------------------------------------------------------------------------------------------------
function save_Beni(){
	
	// SE I DATI SONO VALIDATI
	if(validate_Beni()){
				
		//console.log("chiamo la funzione di salvataggio");
	    db.transaction(dataSave_Beni, errordataSave_Beni,successdataSave_Beni);
	    
	    // DISABILITO IL PULSANTE
	    $("#salva-beniBtn").button('disable').addClass("ui-disabled");
		$('#salva-beniBtn').button('refresh');  
	} 
}

function dataSave_Beni(tx){
	
	// RECUPERO I VALORI
	var tipologia_bene_id = $("#tipologia_bene_id").val();
	var nome = $("#nome").val();
	var descrizione = $("#descrizione").val();
	var annotazioni = $("#annotazioni").val();
	
	// INSERISCO IL CENSIMENTO
	tx.executeSql("INSERT INTO censimento_bene (censimento_id,tipologia_bene_id,nome,descrizione,annotazioni) VALUES (?,?,?,?,?)",[censimento_ins,tipologia_bene_id,nome,descrizione,annotazioni]);
	
}

function successdataSave_Beni(){
	
	// azzero il censiemnto inserito
	azzera_censimento_inserito();
		
	// azzera view beni
	inizializza_Beni();
	
	// RIABILITO IL PULSANTE
    $("#salva-BeniBtn").button('enable').removeClass("ui-disabled");
	$('#salva-BeniBtn').button('refresh');    
	
	// ritorna alla prima schermata
	$.mobile.changePage("#indexPage");
	
}

function errordataSave_Beni(){
	alert("Errore Durante il Salvataggio");
}

function azzera_censimento_inserito(){
	censimento_ins = -1;
}
// FINE CONTROLLER SALVATTAGGIO BENI -----------------------------------------------------------------------------------------------------------
