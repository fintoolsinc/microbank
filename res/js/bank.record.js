//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: bank.record.js
// Created: 2021-02-28
// Updates: 2021-02-28
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
//LEVEL 0
( async function() {
    processPage('bank');
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

    let response = await createBank(clas);
    console.log(response);

    let modalButton = document.getElementById(clas+'-close-modal');

    modalButton.click();
    
    destroyRecord(clas);

    loadOption(clas+".search",'banks');

}
async function createBank(clas){
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
    data['bank_routings'] = [dataRouting];
    data['attributes'] = [dataAttributes];
    //console.log(data);
    data1 = {
        "id": data.id,
        "short_name": data.short_name,
        "full_name": data.full_name,
        "logo": data.logo,
        "website": data.website,
        "bank_routings": [
            {
                "scheme": dataRouting.scheme,
                "address": dataRouting.address
            }
        ],
        "attributes": [
            {
                "name": dataAttributes.name,
                "value":dataAttributes.value
            }
        ]
    }
    console.log(JSON.stringify(data1));
    //return await (await fetch('https://obp-apisandbox.bancohipotecario.com.sv/obp/v4.0.0/banks', {method: 'post',headers: {'Content-Type': 'application/json','Authorization':'DirectLogin token=eyJhbGciOiJIUzI1NiJ9.eyIiOiIifQ.d6cAdiLL46TgJ_fUF3mHXqP8WHSu-pgn4AHIg-enpYE'},body: JSON.stringify(data1)})).json();
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