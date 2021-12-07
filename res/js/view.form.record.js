//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: view.search.record.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('view.form');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas){
    await loadEventListener(clas);

    await loadCombos(clas);

    if(component[clas].id!==""){
        await record(clas,component[clas].id);
		loadProperties(clas);
		let data = {'clase':clas,'key':'pid','key2':'count','id':document.getElementById(clas+'.count').value};
		let d = JSON.parse(await getRecordPair(data));
		document.getElementById(clas+'.pid').value = d[clas].pid;
    }
    if(document.getElementById(clas+'_modal')){
        var myModal = new bootstrap.Modal(document.getElementById(clas+'_modal'), {keyboard: false})
        myModal.show();
    }     
}
async function saveForm(clas){
    event.preventDefault();
    
    if(document.getElementById(clas+'.id').value==""){document.getElementById(clas+'.id').value = component[clas].mid}

    let valid = await validateRecord(clas);

    if (valid==false){return;}
    
    await saveRecord(clas);

    let mid = component[clas].mid;
    if(component[clas].mid==""){ mid = document.getElementById(clas+'.id').value; }

    loadSearchAccordion(clas,mid,2,'View Form');

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();

    destroyRecord(clas);
}
async function setId(clas){
    document.getElementById(clas+'.id').value = document.getElementById('class.id').value +".form"; 
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas){
    loadEventClick(clas);
    loadEventChange(clas);
}
async function loadCombos(clas) {
    let cla = await getCollectionPair('class','id','desc');
              await fillSelect(cla,clas+'.cid');
}
async function loadProperties(clas) {
    let cla = await getCollectionFiltered('class.property','pid','pid','id',document.getElementById(clas+'.cid').value);
              await fillSelect(cla,clas+'.pid');
}
//------------------------------------------------------//
//Level 3
async function loadEventClick(clas){
    if(document.getElementById(clas+'.save')){document.getElementById(clas+'.save').addEventListener('click', async  event => { saveForm(clas) })}
}
async function loadEventChange(clas){
    if(document.getElementById(clas+'.cid')){document.getElementById(clas+'.cid').addEventListener('change', async  event => { loadProperties(clas) })}
}
// AUXILIAR
//-------------------------------------------------------//
async function validateRecord(clas){
    let count = 0;
    let valid = true;
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach((form) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          if(count==0){
            valid = false;
            count++;
          }
        }
        form.classList.add('was-validated');
    });
    return valid;
}
