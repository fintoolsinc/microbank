//---------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: object.form.js
// Created: 2021-03-23
// Updates: 2021-03-23
// Copyright - All Rights Reserved
//---------------------------------------------------------//
//---------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('object',component['object'].id);
})();
//---------------------------------------------------------//
//LEVEL 1
async function processPage(clas,id){
    if(component[clas].id!==""){
        await recordAssociation(clas,component['object'].mid,component['object'].id);
    }
    if(document.getElementById(clas+'_modal')){
        var myModal = new bootstrap.Modal(document.getElementById(clas+'_modal'), {keyboard: false})
        myModal.show();
    }

    let data = {'tab':'class.property','clas':'class.property','sflds':'id','svals':component['object'].id,'clasDesc':'Object','desMas':1,'hiddenCols':'0,8','foot':'no'};

    await search(data);

    loadEventListener(clas);
     
}
async function collectionObject(clas){
    event.preventDefault();
    
    let status = await objectCollection(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Objects');
}
async function classObject(clas){
    event.preventDefault();
    
    let status = await objectClass(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Objects');
 
}
async function generateObject(clas){
    event.preventDefault();
    
    let status = await objectGenerate(clas);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'Objects');
 
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
    if(document.getElementById(clas+'.collection')){document.getElementById(clas+'.collection').addEventListener('click', async  event => { collectionObject(clas); })}
    if(document.getElementById(clas+'.class')){document.getElementById(clas+'.class').addEventListener('click', async  event => { classObject(clas); })}
    if(document.getElementById(clas+'.save')){document.getElementById(clas+'.save').addEventListener('click', async  event => { generateObject(clas); })}
    if(document.getElementById(clas+'.remove')){document.getElementById(clas+'.remove').addEventListener('click', async  event => { removeObject(clas); })}
}
async function loadEventChange(clas){

}
//-------------------------------------------------------//
// AUXILIAR
