//---------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: interface.form.js
// Created: 2018-02-18
// Updates: 2019-06-05,2021-03-05
// Copyright - All Rights Reserved
//---------------------------------------------------------//
//---------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('interface',component['interface'].mid);
})();
//---------------------------------------------------------//
//LEVEL 1
async function processPage(clas,id){
    if(component[clas].id!==""){
        await recordAssociation(clas,id,component['interface'].id);
    }
    if(document.getElementById(clas+'_modal')){
        var myModal = new bootstrap.Modal(document.getElementById(clas+'_modal'), {keyboard: false})
        myModal.show();
    }
    let data = {};
    if(component['interface'].id.split(".").pop()=="record"){
        data = {'tab':'view.record','clas':'view.record','sflds':'id','svals':component['interface'].id,'clasDesc':'Interface','desMas':1,'hiddenCols':'0,10','foot':'no'};
    }
    if(component['interface'].id.split(".").pop()=="search"){
        data = {'tab':'view.search','clas':'view.search','sflds':'id','svals':component['interface'].id,'clasDesc':'Interface','desMas':1,'hiddenCols':'0,6','foot':'no'};
    }
    if(component['interface'].id.split(".").pop()=="form"){
        data = {'tab':'view.form','clas':'view.form','sflds':'id','svals':component['interface'].id,'clasDesc':'Interface','desMas':1,'hiddenCols':'0,6','foot':'no'};
    }	
    if(component['interface'].id.split(".").pop()=="accordion"){
        document.getElementById(clas+".xml").disabled = true;
        data = {'tab':'view.form','clas':'view.accordion','sflds':'id','svals':component['interface'].id,'clasDesc':'Interface','desMas':1,'hiddenCols':'0,6','foot':'no'};
    }
    await search(data);

    loadEventListener(clas);
     
}
async function xmlInterface(clas){
    event.preventDefault();

    let status = await interfaceXml(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'interfaces');
}
async function htmlInterface(clas){
    event.preventDefault();
    
    let status = await interfaceHtml(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'interfaces');
}
async function jsInterface(clas){
    event.preventDefault();
    
    let status = await interfaceJs(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'interfaces');
}
async function generateInterface(clas){
    event.preventDefault();
    
    let status = await interfaceGenerate(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'interfaces');
}
//---------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas){
    loadEventClick(clas);
    loadEventChange(clas);
}
async function loadCombos(clas){

}
//------------------------------------------------------//
//Level 3
async function loadEventClick(clas){
    if(document.getElementById(clas+'.xml')){document.getElementById(clas+'.xml').addEventListener('click', async  event => { xmlInterface(clas); })}
    if(document.getElementById(clas+'.html')){document.getElementById(clas+'.html').addEventListener('click', async  event => { htmlInterface(clas); })}
    if(document.getElementById(clas+'.js')){document.getElementById(clas+'.js').addEventListener('click', async  event => { jsInterface(clas); })}    
    if(document.getElementById(clas+'.save')){document.getElementById(clas+'.save').addEventListener('click', async  event => { generateInterface(clas); })}
    if(document.getElementById(clas+'.remove')){document.getElementById(clas+'.remove').addEventListener('click', async  event => { removeInterface(clas); })}
}
async function loadEventChange(clas){

}
//-------------------------------------------------------//
// AUXILIAR