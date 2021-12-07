//---------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: model.accordion.js
// Created: 2018-02-18
// Updates: 2019-06-05,2021-03-05
// Copyright - All Rights Reserved
//---------------------------------------------------------//
//---------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('model',component['model'].id);
})();
//---------------------------------------------------------//
//LEVEL 1
async function processPage(clas,id){
    loadRecordAccordion(clas,id,1,'Main Record');

    loadSearchAccordion('model.class',id,2,'Model Classes');
    loadSearchAccordion('model.view',id,3,'Model Views');	

    eventClick(clas);    
}
//---------------------------------------------------------//
//LEVEL 2
async function eventClick(clas){
    document.getElementById(clas+'-accordion-close').addEventListener('click', async  event => { 
        destroyForm(clas);
    });
    document.getElementById(clas+'-accordion-maxmin').addEventListener('click', async  event => { 
        toggleMaxMin(clas);
    });
}
//----------------------------------------------------------//
// AUXILIAR
