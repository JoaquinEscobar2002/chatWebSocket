//Con este socket establecemos la comunicacion con el servidor
const socket = io();
/* Swal.fire({
    title: "Saludos",
    text: "Msj inicial",
    icon: "success"
}) */

const chatBox = document.getElementById('chatBox');
const messageLog = document.getElementById('messageLogs');
let user;

//Modal de autenticacion
Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa tu usuario, los demas usuarios veran tu nombre',
    inputValidator: (value) => {
        return !value && 'Por favor ingrese un nombre'
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then(result => {
    user = result.value
    socket.emit('authenticated', user);
});

//Agregamos el evento para enviar el mensaje al servidor
chatBox.addEventListener('keyup', evt => {
    //Validamos que preciono enter
    if(evt.key==='Enter'){
        //Validamos que no envio un mensaje vacio
        if(chatBox.value.trim().length > 0){
            //Enviamos al servidor el mensaje junto con el nombre del usuario que lo envio
            socket.emit('message', { user, message: chatBox.value });
            //Vaciamos el campo
            chatBox.value = '';
        }
    }
});

//Escuchamos el evento donde el servidor nos envia los mensajes
socket.on('messageLogs', data => {
    let messages = [];
    //Recorremos los mensajes y agregamos cada uno con un salto de linea
    data.forEach(message => {
        messages += `${message.user}: ${message.message}<br/>`
    });
    //Lo insertamos en el main
    messageLog.innerHTML=messages;
});

socket.on('newUserConnected', data => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmationButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: 'success'
    })
})