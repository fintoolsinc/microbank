//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: customer.record.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('customer');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas){
    await loadEventListener(clas);

    await loadCombos(clas);

    if(component[clas].id!==""){
        await record(clas,component[clas].id);
    }

    if(document.getElementById(clas+'_modal')){
        var myModal = new bootstrap.Modal(document.getElementById(clas+'_modal'), {keyboard: false})
        myModal.show();
    }
}

async function saveForm(clas){
    event.preventDefault();
    
    validateRecord(clas);
    
    //let id = await saveRecord(clas);

    let response = await createcustomer(clas);
    console.log(response);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'customers');

}
async function createcustomer(clas){
    let dataForm = await getRecordElements(clas);
    //console.log(dataForm);
    let data = {};
    let dataRouting = {};
    let dataAttributes = {}
    Object.entries(dataForm).forEach(([key, val]) => {
        let keyP = key.split(".");
        if(keyP.length>1){
            if(keyP[0]=="routing"){dataRouting[keyP[1]]=val;}
            if(keyP[0]=="attribute"){dataAttributes[keyP[1]]=val;}
        }else{
            if(key!="clase"){
                data[key]=val;
            }
        }
	});
    data['customer_routings'] = [dataRouting];
    data['attributes'] = [dataAttributes];
    console.log(data);
    return await (await fetch('https://obp-apisandbox.bancohipotecario.com.sv/obp/v4.0.0/customers', {method: 'post',headers: {'Content-Type': 'application/json','Authorization':'DirectLogin token=eyJhbGciOiJIUzI1NiJ9.eyIiOiIifQ.d6cAdiLL46TgJ_fUF3mHXqP8WHSu-pgn4AHIg-enpYE'},body: data})).json();
}
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
    if(document.getElementById(clas+'.save')){document.getElementById(clas+'.save').addEventListener('click', async  event => { saveForm(clas); })}
}
async function loadEventChange(clas){

}
// AUXILIAR
//-------------------------------------------------------//
async function validateRecord(clas){
    const forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach((form) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
    });
}