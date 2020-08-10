const express = require('express');
const app = express();
const server=require('http').Server(app);
const {v4 : uuidv4} =require('uuid');
const io = require('socket.io')(server);
const {ExpressPeerServer}=require('peer');
const peerServer = ExpressPeerServer(server,{
    debug :true});
app.use('/peerjs',peerServer);
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,resp)=>{
    resp.redirect(`${uuidv4()}`);
})
app.get('/:room',(req,resp)=>{
    resp.render('room',{
        roomID : req.params.room
    })
})
io.on('connection',socket=>{
    socket.on('join-room',(roomID,userID)=>{
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('user-connected',userID);
        socket.on('message',(message)=>{
            io.to(roomID).emit('createMessage',message);
        });
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
          });
    }); 
});
server.listen(process.env.PORT||3000,console.log('Listening'));