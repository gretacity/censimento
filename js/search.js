String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function cerca_cartello(index){
				
	// MOSTRO IL CARICAMENTO
	var cercato = $("#cerca_segnale_"+index).val();
	
	var pattern_codice = new RegExp(/^[\d]+(\/)?([\w]+)?/);

	// regex per simulare comportamento like
	var expression = "^"+cercato+".*";
	var reg_exp = new RegExp(expression,'i');
	
	// true numero
	// false stringa
	var cosa_cercato = false;
	
	if(cercato.match(pattern_codice))
		cosa_cercato = true;
		
	
	str = new Array();
	
	// pulisci suggerimenti
	$("#suggestions_"+index).empty();
					
	// cicla elementi
	$.mobile.loading('show');		

	$.each(ss_segnale, function(indice, value){	
		
		// STO CERCANDO UN CODICE
		if(cosa_cercato && cercato != ""){
			
			if(value.codice == cercato){
								
				// AGGIUNGI AI RISULTATI DI RICERCA
				add_li(index,value,str);
					
			}
				
		} 
		// STO CERCANDO UNA STRINGA
		else if(!cosa_cercato && cercato != ""){     
			
			if(value.label.search(reg_exp) != -1){
				// AGGIUNGI AI RISULTATI DI RICERCA
				add_li(index,value,str);
			}
			
		}
		
	});
	// nascondi il caricamento
	$.mobile.loading('hide');

	// aggancia e renderizza elemento
	$("#suggestions_"+index).html(str).listview("refresh");
	

}

function add_li(index,value,str){
	
	// per ogni dato prepara il li
	var jq_string_sel = "seleziona_cartello("+index+","+value.value+")";
	var svg_obj = "<div style='width:72px;height:65px;float:left;margin-right:8px'></div>";
	
	if(value.img != "" && value.img != undefined)
		svg_obj = '<object style="width:72px;height:65px;float:left;margin-right:8px" type="image/svg+xml" data="./img/Segnali/'+value.img+'"></object>';

	// aggancia li a stringa finale
	str.push('<li id="'+value.value+'">'+
				 '<a onclick="'+jq_string_sel+'" >'+  
				     //'<img src="'+value.img+'" class="ui-li-thumb"/>'+
				     // ADATTAMENTO ALLE IMMAGINI VETTORIALI
				     ''+svg_obj+''+
					 '<span class="ui-li-heading">'+value.label+'</span>'+
					 '<p class="ui-li-desc">'+value.codice+'<br />'+value.figura+'</p>'+
				 '</a>'+
			 '</li>'); 
	
}
