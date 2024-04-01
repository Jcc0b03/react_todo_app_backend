const express = require('express');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const cors = require('cors');

const api = express();
api.use(express.json());
api.use(cors());

const port = 8080;

api.post('/uploadTodos', (req, res) => {
   console.log(req.body.syncToken);
   fs.writeFile(`./todos/${req.body.syncToken}.txt`, JSON.stringify(req.body.todos), (err) => {
       if(err){
           console.log('Error while writing file: ', err);
       }else{
           console.log('File written succesfully');
       }
   });
   res.send('<h1>Hello world</h1>');
});

api.post('/getTodos', (req, res) => {
    const query = querystring.parse(req.url);
    if(query['/getTodos?syncToken']!=null){
        fs.readFile(`./todos/${query['/getTodos?syncToken']}.txt`, (err, data) => {
           if(err){
               return res.send("error! bad request");
           }

            res.send(data.toString());
        });
    }
});

const tokenLength = 15;

api.post('/generateToken', (req, res) => {
    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    const data = {
        syncToken: generateRandomString(tokenLength)
    }

    res.send(JSON.stringify(data));
});

api.get('/', (req, res) => {
    res.send('<h1>Wrong request type</h1>');
})

api.listen(port, () => {
    console.log(`Planner api is listening on port: ${port}`);
});