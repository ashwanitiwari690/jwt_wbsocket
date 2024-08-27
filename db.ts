import mysql from 'mysql';


const con = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "curd",
    port: 3306
});

con.connect((err: any) => {

    if (err) { console.log(err, 'error'); }
    console.log("Connected Database")

});


module.exports = con;