const sMessage = require('../models/message.js');

module.exports = function (io) {

  let userconnect = [];

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    userconnect.push(socket.id);
    io.emit('notification', { type: 'new_user', data: socket.id });
    io.emit('userconnect', userconnect);
    
    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });
    
    // Listener sur le nouveau pseudo de l'utilisateur
    socket.on('pseudouser', (msg) => {
      console.log(`User ${socket.id} use the pseudonyme : ${msg.pseudo}`);
      io.emit('pseudouser', { socketid: socket.id, pseudo: msg.pseudo });
    });

    socket.on('message', (msg) => {
      const datenow = new Date();
      const data = { 
        text: msg,
        socketid: socket.id,
        date: datenow
      };
      io.emit('message', data );
      const message = new sMessage(data);
      message.save();
    });
  })
}