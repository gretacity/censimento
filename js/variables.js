var index_syncdataBtn = "#sync_dataBtn";
var index_loginBtn = "#loginBtn";
var index_infogeneraliBtn = "#infogeneraliBtn";

var cosa_beneBtn = "#bene_censimentoBtn";
var cosa_segnaleticaBtn = "#segnaletica_censimentoBtn";

var infogenerali_acquisisciBtn = "#acquisisci_qr";
var infogenerali_saveBtn = "#salva-info_generaliBtn";
var infogenerali_fotofronteBtn = "#cattura_foto_fronte";
var infogenerali_fotoretroBtn = "#cattura_foto_retro";
var infogenerali_fotoprospettivaBtn = "#cattura_foto_prospettiva";

var segnaletica_add_dettcartelli = "#add_dettaglio_cartelli";
var segnaletica_add_dettpali = "#add_dettaglio_pali";
var segnaletica_add_dettstaffe = "#add_dettaglio_staffe";

var userid = window.localStorage.getItem("userid");

var censimento_ins = -1;

var service_sync_url = "http://www.gretacity.com/Service/index.php?s=sync_client";

// building con android
//var scanner = window.plugins.barcodeScanner;
// building con phonegap build
var scanner = cordova.require("cordova/plugin/BarcodeScanner");

var db = null;
