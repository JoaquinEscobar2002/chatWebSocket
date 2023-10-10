import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';

//Instanciamos el servidor con express
const app = express();

//Configuracion archivos estaticos
app.use(express.static(`${__dirname}/public`));

//Motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

//Router
app.use('/', viewsRouter);

//Server en el puerto 8080
const server = app.listen(8080, () => console.log('Listen!'));

//Configuracion de socket.io
const socketServer = new Server(server);

//Almacenamos los messages
const messages = [];

//Establecemos el enlace
socketServer.on('connection', socket => {
    console.log('Nuevo cliente connectado')

    //Recibimos el mensaje del cliente
    socket.on('message', data => {
        //Guardamos el mensaje nuevo
        messages.push(data);
        //Enviamos todos los mensajes guardados a todos los clientes
        socketServer.emit('messageLogs', messages);
    })


    socket.on('authenticated', data => {
        //Enviamos todos los mensajes almacenados al nuevo cliente
        socket.emit('messageLogs', messages)
        //Avisamos a todos los demas clientes menos al actual que se conecto un nuevo usuario
        socket.broadcast.emit('newUserConnected', data);
    });

});