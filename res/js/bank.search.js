//-------------------------------------------------------//
// Company:WebSoft, SA de CV
// Author:Rodolfo Machon
// File Name: bank.search.js
// Created: 2021-11-26
// Updates: 2021-11-26
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
// LEVEL 0
( async function() {
    processPage('bank','Bank');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas,desc){
    let data = {'tab':clas,'clas':clas,'clasDesc':desc,'desMas':1,'recBut':'yes'};

    await getBanks(clas);

    //await search(data);

    document.getElementById('nav-'+clas+'-tab').click();

    loadEventListener(clas,desc);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas,desc){
    loadEventClick(clas,desc);
}
async function getBanks(clas){
    let response = await (await fetch('https://obp-apisandbox.bancohipotecario.com.sv/obp/v4.0.0/banks', {method: 'get',headers: {'Content-Type': 'application/json',}})).json();
    let dataSet = [];
    response.banks.forEach(bank => {
		const { id, short_name, full_name, logo, website } = bank;  
        const array = [id,short_name,full_name,logo,website];
        dataSet.push(array);
	})
    $('#'+clas+'_tab').DataTable( {
        data: dataSet,
        bLengthChange: false,        
        iDisplayLength : 50,
        columns: [
            { title: "ID" },
            { title: "SHORT NAME" },
            { title: "FULL NAME" },
            { title: "LOGO" },
            { title: "WEBSITE" }
        ],
    } );
}
//-------------------------------------------------------//
//LEVEL 3
async function loadEventClick(clas,desc){
    if(document.getElementById('nav-'+clas+'-tab')){document.getElementById('nav-'+clas+'-tab').addEventListener('dblclick', async  event => { destroyTab(clas) })}
    
    if(document.getElementById(clas+'_add')){document.getElementById(clas+'_add').addEventListener('click', async  event => { loadRecordAlert(clas,'record','',desc,'') })}
}
//-------------------------------------------------------//
// AUXILIAR