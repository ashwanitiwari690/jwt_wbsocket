import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
const con = require('./db')
const app = express();
const secretkey = 'secretkey';

app.use(cors());
app.use(bodyparser.json());



//// user register


app.post('/register', checkvalidation, (req, res) => {
    let fdata = req.body
    let pass = md5(fdata.password)
    let checkuser = "SELECT id FROM `user` WHERE username = '" + fdata.username + "'";
    con.query(checkuser, (error: any, result: any) => {
        if (result[0] == null) {
            let regis = "INSERT INTO `user`(`username`,`email`,`password`) VALUES ('" + fdata.username + "','" + fdata.email + "','" + pass + "')"
            con.query(regis, (error: any, result1: any) => {
                res.send({ error: 0, message: 'Success Register' })
            })
        } else {
            res.send({ error: 1, message: "username already exsit" })
        }
    })

})


/// check validation input user

function checkvalidation(req: any, res: any, next: any) {
    let checkdata = req.body
    if (checkdata.username != '' && checkdata.email != '' && checkdata.password != '') {
        next()
    } else {
        res.send({ error: 1, message: 'All field must be required' })
    }
}




//// user login with authorization

app.post('/login', (req, res) => {
    let sdata = req.body
    let veripassw = md5(sdata.password)
    let query = "SELECT password FROM `user` WHERE username = '" + sdata.username + "'"
    con.query(query, (error: any, result: any) => {
        if (result.length > 0) {
            if (result[0].password == veripassw) {
                console.log('success login')
                jwt.sign({ sdata }, secretkey, { expiresIn: '300s' }, (error, token) => {
                    res.send({ error: 0, message: 'successfully login ', authkey: token })
                })
            } else {
                res.send({ error: 1, message: 'username/password not match', })
            }
        } else {
            res.send({ error: 1, message: 'username not exit', })
        }
    })
})







// get all data with authentication

app.get('/user', verifytoken, (req, res) => {
    let que = `SELECT * FROM user`;
    con.query(que, (err: any, result: any) => {
        if (result.length > 0) {
            res.send({
                error: 0, message: 'all user data', data: result
            })
        }
    });
});


/// verify jwt token

function verifytoken(req: any, res: any, next: any) {
    let token = req.headers['authorization']
    if (typeof token != undefined) {
        jwt.verify(token, secretkey, (error: any, authdata: any) => {
            if (error) {
                res.send({
                    message: 'Invalid token',
                    error: 1
                })
                return false
            }
            next();
        })
    } else {
        res.send({error:1,message: 'token must be required'})
    }
}





app.listen(3000, () => {
    console.log('Server Start on 3000');
});