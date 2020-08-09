const socket= io('/');
const videoGrid=document.getElementById('video-grid');
const myVideo=document.createElement('video');
myVideo.muted=true;
const peers = {};
var peer =new Peer(undefined,{
    path : '/peerjs',
    host : '/',
    port : '443'
});
const constraints = window.constraints = {
    audio: true,
    video: true
  };
let myVideoStream;
navigator.mediaDevices.getUserMedia({
  audio: true,
    video: true
}).then(stream =>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);
    peer.on('call', call => {    // if recieved call then answering it
        call.answer(stream)
        console.log('answered!');
        const video = document.createElement('video')
        console.log('answered!2');
        call.on('stream', userVideoStream => {
            console.log('Adding Video');
          addVideoStream(video, userVideoStream)
        })
        console.log('answered!3');
      })
    socket.on('user-connected', userId => {
        console.log('Peer Connected!'+userId);
        connectToNewUser(userId, stream);
        console.log('connected User!!');
      })
}); 

peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);  // sending to event listner io on index.js
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

let connectToNewUser=(userId, stream)=>{
    console.log('connected User!!1');
    let call = peer.call(userId, stream)     /// sending my video to user
    console.log('connected User!!2');
    const video = document.createElement('video')
    console.log('connected User!!3');
    call.on('stream', userVideoStream => {   //recieving his stream and displaying on my browser
        console.log('add video');
        addVideoStream(video, userVideoStream)
      })
    console.log('connected User!!4');
}
function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }

  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      console.log(text.val())
      socket.emit('message', text.val());
      text.val('')
    }
  });

  socket.on('createMessage', message => {
    console.log('create medsage ', message)
    $("messages").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  })

  function scrollToBottom(){
    let d=$('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  function muteUnmute(){
    let enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
      myVideoStream.getAudioTracks()[0].enabled=false;
      setUnmuteButton();
    }
    else{
      myVideoStream.getAudioTracks()[0].enabled=true;
      setMuteButton();
    }
  }
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main_mute_Button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main_mute_Button').innerHTML = html;
  }
  function playStop(){
    let enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
      myVideoStream.getVideoTracks()[0].enabled=false;
      setStopButton();
    }
    else{
      myVideoStream.getVideoTracks()[0].enabled=true;
      setPlayButton();
    }
  }
  const setPlayButton = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `;
    document.querySelector('.main_play_Button').innerHTML = html;
  }
  
  const setStopButton = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main_play_Button').innerHTML = html;
  }