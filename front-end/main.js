// const { listenerCount } = require("process");

(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server);
    let nbmessage = 0;

    socket.on('notification', (data) => {
        console.log('Message depuis le serveur:', data);
    });
    socket.on('userconnect', (data) => {
        for(let i=0; i<data.length; i++){
            addUser(data[i]);
        };
    })
    socket.on('message', (data) => {
        console.log('Message envoyé par l\'utilisateur \'' + data.socketid + '\' :'+ data.text);
        addMessage(data, socket.id);
        nbmessage+=1
        document.querySelector(".title b").innerText = "Conversation : " + nbmessage + " messages";
    })

    getOldMessages();

    const formpost = document.getElementById("form_post");
    formpost.addEventListener('submit', function(e){
        console.log("e");
        e.preventDefault();
        const formData = new FormData(formpost);
        let formJsonData = Object.fromEntries(formData);
        socket.emit('message', formJsonData.message);
        document.getElementById("input_message").value = "";
    });
    const pseudouser = document.getElementById("pseudo-user");
    pseudouser.addEventListener('click', function(){
        pseudouser.innerText = "";
        let input = document.createElement("input");
        input.setAttribute("type" ,"text");
        input.setAttribute("placeholder" ,"Votre pseudo");
        input.addEventListener('blur', function(e){
            pseudouser.innerHTML = "Anonyme";
        });
        input.addEventListener('keypress', function(e){
            if(e.key=='Enter'){
                const pseudouser = input.value;
                console.log(pseudouser);
                socket.emit('pseudouser', {socketid : socket.id, pseudo : pseudouser});
            }
        });
        pseudouser.appendChild(input);
        input.focus();
    });

    function addMessage(data, idsocketme){
        console.log(data);
        const li = document.createElement("li");
        if(data.socketid === idsocketme){
            li.classList.add("me");
        }
        const div1 = document.createElement("div");
        div1.classList.add("name");
        const span1 = document.createElement("span");
        span1.innerText = data.socketid;
        div1.appendChild(span1);
    
        const div2 = document.createElement("div");
        div2.classList.add("message");
        const p = document.createElement("p");
        p.innerText = data.text;
        const date = (new Date(data.date));
        const span2 = document.createElement("span")
        span2.classList.add("msg-time")
        span2.innerText = date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
        div2.appendChild(p);
        div2.appendChild(span2);
    
        li.appendChild(div1);
        li.appendChild(div2);
    
        document.getElementById("chat-list-message").appendChild(li);
    }
    function getOldMessages(){
        fetch(`${server}/messages`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            for(let i=0; i<data.length; i++){
                addMessage(data[i], '');
            };
            nbmessage = data.length;
            document.querySelector(".title b").innerText = "Conversation : " + nbmessage + " messages";
        })
    }
    function addUser(user){
        const li = document.createElement("li");
        const span = document.createElement("span");
    }
})()

