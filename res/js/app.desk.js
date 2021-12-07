//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: app.desk.js
// Created: 2021-03-11
// Updates: 2021-03-11
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
// LEVEL 0
( async function() {
    processPage('app.desk');
})();
//-------------------------------------------------------//
//LEVEL 1
async function processPage(clas){
    let app = await session({'sid':window.sid});

    document.getElementById('app-style').href='/res/css/desk.css';

    await nav({'sid':window.sid,'id':app.user.id,'lang':app['desk.lang']});

    loadEventListener(clas);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventListener(clas){
    loadEventClick(clas);
}
//-------------------------------------------------------//
//LEVEL 2
async function loadEventClick(clas){
    document.getElementById('sidebarCollapse').addEventListener('click', async () => { showSideBar() });
    document.getElementById('app.desk').addEventListener('click', async () => { route('app.desk'); });
}
//-------------------------------------------------------//
// AUXILIAR
