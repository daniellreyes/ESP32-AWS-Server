
const express = require('express'); //Cuando se queda vacío lo busca en los node_modules
const bodyParser = require('body-parser');
const path=require('path');
const numeros = require('./dummy');
const usuarios = require('./dummy');
const {exec} =require('child_process');


const app = express(); //Realizando la instancia
const port = 3000;

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())  //Generando el objeto tipo Json

//CORS


//Rutas
app.get('/', (req, res) => {
    res.status(200).send('<div> <h1></h1> Mi sitio web <p><p> </div>');
});
const data = {
    message: 'datos',
    payload: {
        temperatura: '20',
        presion: '1'
    }
}

//console.log(__dirname);

app.get('/homepage', (req,res)=> {
    res.sendFile(path.join(__dirname+'/index.html'));
});


app.get('/users/:id', (req, res)=>{
    const id = req.params.id;
    var user = {};
    for(let u of usuarios){
        if (u.id == id){
            user = u;
        }
    }
    var nuevaClave = '';
    var contador = 1;
    var cRef = '';
    for(let c of user.clave){
        if(c==cRef)
        {
            contador++;
        }
        else if(contador==1)
        {
            cRef=c;
            nuevaClave=nuevaClave + cRef;
            
        }
            else
            {
            cRef=c;
            nuevaClave= nuevaClave + String(contador)+ cRef;
            contador=1;
            }
    
    }
    console.log(nuevaClave);
    res.status(200).send(nuevaClave);
});


app.get('/publish', (req,res)=>{

    //Leer el nombre de archivos y que regrese
    exec("aws --region us-east-2 iot-data publish --topic 'inTopic' --cli-binary-format raw-in-base64-out --payload 'Hello word'",(error,stdout,stderr)=>{
        if(error)
        {
            res.status(200).send(error)
        }
        if(stderr)
        {
            res.status(200).send(stderr)
        }
        res.status(200).send("Enviado correctamente")

    });
    
});


app.get('/users/:id', (req,res)=>
{
    const id=req.params.id;
    var user = {};
    for(let u of usuarios)
    {
        if(u.id=== id)
        {
            user=u;
        }
    }
    //Actividad para comprimir clave
    res.status(200).send(user.nuevaClave);
});

module.exports=app;