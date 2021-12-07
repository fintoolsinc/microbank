//-------------------------------------------------------//
// Author:Rodolfo Machon
// Company:WebSoft, SA de CV
// File Name: /bsb/desk.js
// Created: 2020-09-09
// Updates: 2019-09-09, 2021-02-01
// Copyright - All Rights Reserved
//-------------------------------------------------------//
//-------------------------------------------------------//
const db =  require('./db.js');
//-------------------------------------------------------//
// LEVEL 0
this.nav = async function(req , res){
    let id    = req.body.id;
    try {
        let menu  = await getNav(id);
        res.status(200).json(menu);
    } catch (err) {
        console.log(err.message);
    }
}
//-------------------------------------------------------//
// LEVEL 1
async function getNav(id) {
    let conn = await db.getConnection();
    const sql = "SELECT  a.`bar.id` as 'bar_id',"+
                        "c.desc as 'bar_des',"+
                        "c.text as 'bar_icon',"+						
                        "a.`menu.id` as 'menu_id',"+
                        "d.desc as 'menu_des',"+
                        "a.`option.id` as 'opcion_id',"+
                        "b.desc as 'opcion_des',"+
                        "e.`id` as 'entidad',"+
                        "f.`id` as 'componente',"+
                        "b.`id` as 'opciontipo_id',"+
                        "b.`container.id` as 'contenedor_id'," +
                        "b.`text` as 'url'," +
                        "c.`index` as 'bindex'," +
                        "d.`index` as 'mindex'," +
                        "a.`index` as 'rindex' " +
                        "FROM `role.options` as a " +
                        "LEFT JOIN `options` as b ON b.id = a.`option.id` "+
                        "LEFT JOIN `bars` as c ON c.id = a.`bar.id` "+
                        "LEFT JOIN `menus` as d ON d.id = a.`menu.id` "+
                        "LEFT JOIN `entities` as e ON e.id = b.`entity.id` "+
                        "LEFT JOIN `components` as f ON f.id = b.`component.id` "+
                        "WHERE a.`id` IN (SELECT `role.id` FROM `user.roles` WHERE id=?)"+
                        "ORDER BY a.`index` desc";
    const rowSet = await conn.query(sql,[id]);
    conn.end();
    if (rowSet && rowSet.length) {
        return rowSet;
    }else{
        return 0;
    }	
}
//-------------------------------------------------------//
// LEVEL 2
