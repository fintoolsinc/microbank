//---------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: view.accordion.js
// Created: 2018-02-18
// Updates: 2019-06-05,2021-03-05
// Copyright - All Rights Reserved
//---------------------------------------------------------//
//---------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('view',component['view'].id);
})();
//---------------------------------------------------------//
//LEVEL 1
async function processPage(clas,id){
    loadRecordAccordion(clas,id,1,'Main Record');

    if(id.split(".").pop().toLowerCase()=="search"){loadSearchAccordion('view.search',id,2,'View Search');}
    if(id.split(".").pop().toLowerCase()=="record"){loadSearchAccordion('view.record',id,2,'View Record');}
    if(id.split(".").pop().toLowerCase()=="form"){loadSearchAccordion('view.form',id,2,'View Form');}
    //if(id.split(".").pop().toLowerCase()=="accordion"){loadSearchAccordion('view.accordion',id,2,'View Accordion');}
	
    eventClick(clas);    
}
//---------------------------------------------------------//
//LEVEL 2
async function eventClick(clas){
    document.getElementById(clas+'-accordion-close').addEventListener('click', async  event => { destroyForm(clas); });
    document.getElementById(clas+'-accordion-maxmin').addEventListener('click', async  event => { toggleMaxMin(clas); });
}
//----------------------------------------------------------//
// AUXILIAR
