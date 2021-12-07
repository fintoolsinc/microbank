//---------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: user.accordion.js
// Created: 2018-02-18
// Updates: 2019-06-05,2020-09-01
// Copyright - All Rights Reserved
//---------------------------------------------------------//
//---------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('user',component['user'].id);
})();
//---------------------------------------------------------//
//LEVEL 1
async function processPage(clas,id){
    loadRecordAccordion(clas,id,1,'Main Record');
    loadSearchAccordion('user.role',id,2,'User Roles');

    eventClick('user');    
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
