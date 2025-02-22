import { SecureApiRequest  } from './api.js';
import { handleLocation } from './app.js';
let socket = null;
let currentRecipientGlobal = dataUser();
let currentRecipient = currentRecipientGlobal.username;
let currentRecipientId = currentRecipientGlobal.id;
let friends = [];
var currentUserName = null;
import {isValidUrl} from './routes.js';

export function loadChatInterface() {
    const content = document.getElementById('con');
    content.innerHTML = `
    <div class="container-main-home">
    <div class="child-container-main-home">
    <div class="chat-interface">
        <div class="friends-list">
            <h2 class="bg-danger text-white">Chat</h2>
            <ul id="friendsList"></ul>
        </div>
        <div class="chat-area hidden">
            <div id="chatHeader">
                <div class="chat-header-left">
                    <img id="chatHeaderImage" src="" alt="Friend's avatar" class="friend-avatar">
                    <span id="chatHeaderName"></span>
                </div>
                <div class="chat-header-right">
                    <button id="chatOptionsButton">
                        <i class='bx bx-dots-horizontal-rounded'></i>
                    </button>
                    <div id="chatOptionsMenu" class="hidden">
                        <button class="block-user" id="block-user"><strong>Block user</strong></button>
                    </div>
                </div>
            </div>
            <div id="messagesContainer" class="messages-container"></div>
            <div class="input-area">
                <input type="text" id="messageInput" placeholder="Type your message...">
                <button id="sendButton" class="bg-danger">
                    <i class='bx bxs-send'></i>
                </button>
            </div>
        </div>
    </div>
    </div>
    </div>
    `;
    // content.innerHTML = `<h1>hola</h1>`;
    // //("alexander");
    
    initializeChat();
}

async function initializeChat() {
   
    currentUserName = localStorage.getItem("username");
    const friendsList = document.getElementById('friendsList');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatOptionsButton = document.getElementById('chatOptionsButton');
    const chatOptionsMenu = document.getElementById('chatOptionsMenu');

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    chatOptionsButton.addEventListener('click', () => {
        chatOptionsMenu.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e) => {
        if (!chatOptionsButton.contains(e.target) && !chatOptionsMenu.contains(e.target)) {
            chatOptionsMenu.classList.add('hidden');
        }
    });
    
    let blockUser  = document.getElementById("block-user");

    blockUser.addEventListener("click", async function(){
        let data = await dataUser();
        // //("====================remove friend==================== id:", data);
        // if (currentRecipientId != null){
            removeFriend(data.id);
            let chatAreaForif = document.querySelector('.chat-area');
            chatAreaForif.style.display = 'none';
            fetchFriends();
            localStorage.setItem("openChat", "");
        // }
    })

    connectWebSocket();
    fetchFriends();
}

export function closeWebSocket() {
    if (socket) {
        //("socket closed.....");
        socket.close();
    }
}


export function startChat() {
    //("initializeChat===================")
    if (!socket || socket.readyState === WebSocket.CLOSED) {
        connectWebSocket();
    }
}

function connectWebSocket() {
    socket = new WebSocket(`wss://${window.location.host}/ws/chat`);

    socket.onopen = function(e) {
        //("WebSocket connection established");
    };


    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if (data.type === 'chat') {
            displayMessage(data);
        } else if (data.type === 'conversation_history') {
            displayConversationHistory(data.messages);
        }
    };

    socket.onclose = function(e) {
        socket = null;
        //("WebSocket connection closed");
    };
}

async function dataUser() {
    let data = null;

        try {
            if (localStorage.getItem("openChat")){
                const response = await fetch(`/api/get/${localStorage.getItem("openChat")}/`);
                const friend = await response.json();
                data = friend;
            }   
        } catch (error) {
            console.error("Error fetching data:", error);
            data = null;  // Optionally, you can set it to null or handle the error case
        }
    return data;
}

async function removeFriend(friendID)
{
    const info = await SecureApiRequest("/api/friend/remove_friend/", "POST", `{"friend_id": "${friendID}"}`);
    // if(!info)
    //     return;
    // //("info ==========> ",info, localStorage.getItem("eachProfileUserId"))
    // localStorage.setItem('eachProfileUserName', data.username);
    
}


async function fetchFriends() 
{
    const friendData = await SecureApiRequest('/api/friend/get_friends/');

    const friendsToRender = friendData.friends.map(friend => ({
        username: friend.username, 
        photo: friend.photo  
    }));
    const usernameExists = friendData.friends.some(friend => friend.username === localStorage.getItem("openChat"));
    // //("//////////////////////", usernameExists, "//////////////////////");
    if (!usernameExists)
        localStorage.setItem("openChat", "");
    // //("friends:", friendsToRender);


    renderFriends(friendsToRender);
    let karim =  await dataUser();
    // //("//////////////////////", localStorage.getItem("openChat"), "//////////////////////");
    if(localStorage.getItem("openChat"))
    {
        // fetchConversationHistory(karim.username)
        selectFriend(karim);
    }
}



async function renderFriends(friends) 
{
    
    const friendsList = document.getElementById('friendsList');
    if(friendsList)
    {
        friendsList.innerHTML = '';
        friends.forEach(friend => {
            const li = document.createElement('li');
            let photo = friend.photo;
             if(!isValidUrl(photo))
                photo = `http://127.0.0.1:8000${photo}`;

            li.innerHTML = `
                <div class="friend-item">
                    <img src="${photo}" alt="${friend.username}'s avatar" class="friend-avatar">
                    <span class="friend-name">${friend.username}</span>
                </div>
            `;
            li.addEventListener('click', function(){
                selectFriend(friend)
                let chatAreaForif = document.querySelector('.chat-area');
                chatAreaForif.style.display = "flex"   
            });
                
            friendsList.appendChild(li);
        });
    }
}


async function selectFriend(friend) {
    // //()
    currentRecipient = friend.username;
    currentRecipientId = friend.id;
    fetchConversationHistory(friend.username);
    
    const chatArea = document.querySelector('.chat-area');
    chatArea.classList.remove('hidden');
    chatArea.classList.add('slide-in');
    
    const friendsList = document.querySelector('.friends-list');
    // friendsList.classList.add('shrink');
    
    const chatHeader = document.getElementById('chatHeader');
    const chatHeaderImage = document.getElementById('chatHeaderImage');
    const chatHeaderName = document.getElementById('chatHeaderName');

    chatHeaderName.addEventListener("click", function(){
        localStorage.setItem('eachProfileUserName', localStorage.getItem("openChat"));
        history.pushState({}, "", '/eachprofile'); 
        handleLocation();
    })
    chatHeaderImage.addEventListener("click", function(){
        localStorage.setItem('eachProfileUserName', localStorage.getItem("openChat"));
        history.pushState({}, "", '/eachprofile'); 
        handleLocation();
    })
    
    let photo = friend.photo;
    if(!isValidUrl(photo))
        photo = `http://127.0.0.1:8000${photo}`;

    chatHeaderImage.src = photo;
    chatHeaderName.textContent = friend.username;

    localStorage.setItem("openChat", friend.username)
}

function fetchConversationHistory(otherUser) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'fetch_messages',
            sender: currentUserName,
            other_user: otherUser
        }));
    } else {
        console.error("WebSocket is not connected");
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message && currentRecipient) {
        socket.send(JSON.stringify({
            type: 'chat',
            body: message,
            sender: currentUserName,
            recipient: currentRecipient
        }));
        messageInput.value = '';
    }
}

async function displayMessage(message) {
    // //(message);
    const messagesContainer = document.getElementById('messagesContainer');
    const messageElement = document.createElement('div');
    messageElement.classList.add('messages');
    
    const isCurrentUser = message.sender__username === currentUserName;
    // //(message.sender__username + "    "  +  currentUserName);
    // //(isCurrentUser);
    messageElement.classList.add(isCurrentUser ? 'sent' : 'received');
    
    const contentSpan = document.createElement('span');
    contentSpan.classList.add('message-content');
    contentSpan.textContent = message.body;
    
    if (!isCurrentUser) {
        const senderSpan = document.createElement('span');
        senderSpan.classList.add('message-sender');
        senderSpan.textContent = ``;
        messageElement.appendChild(senderSpan);
    }
    
    messageElement.appendChild(contentSpan);
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function displayConversationHistory(messages) {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';
    messages.forEach(displayMessage);
}


/////new

// import { SecureApiRequest  } from './api.js';

// let socket = null;
// let currentRecipient = null;
// let friends = [];
// const currentUserName = 'AlexanderTG';

// export function loadChatInterface() {
//     const content = document.getElementById('content');
//     content.innerHTML = `
//     <div class="chat-container">
//         <div class="chat-interface">
//             <div class="friends-list">
//                 <h2>Direct Messages</h2>
//                 <ul id="friendsList"></ul>
//             </div>
//             <div class="chat-area hidden">
//                 <div id="chatHeader">
//                     <div class="chat-header-left">
//                         <img id="chatHeaderImage" src="" alt="Friend's avatar" class="friend-avatar">
//                         <span id="chatHeaderName"></span>
//                     </div>
//                     <div class="chat-header-right">
//                         <button id="chatOptionsButton">
//                             <i class='bx bx-dots-horizontal-rounded'></i>
//                         </button>
//                         <div id="chatOptionsMenu" class="hidden">
//                             <button class="block-user">Block user</button>
//                             <button>Invite for a game</button>
//                         </div>
//                     </div>
//                 </div>
//                 <div id="messagesContainer" class="messages-container"></div>
//                 <div class="input-area">
//                     <input type="text" id="messageInput" placeholder="Type your message...">
//                     <button id="sendButton">
//                         <i class='bx bxs-send'></i>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     </div>
//     `;

//     initializeChat();
// }
// async function initializeChat() {
//     // Get the new DOM elements
//     const friendsList = document.getElementById('friendsList');
//     const messagesContainer = document.getElementById('messagesContainer');
//     const messageInput = document.getElementById('messageInput');
//     const sendButton = document.getElementById('sendButton');

//     // Set up event listeners
//     sendButton.addEventListener('click', sendMessage);
//     messageInput.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') {
//             sendMessage();
//         }
//     });

//     // Initialize WebSocket and fetch friends
//     connectWebSocket();
//     fetchFriends();
// }

// async function connectWebSocket() {
//     socket = new WebSocket(`ws://${window.location.host}/ws/chat`);

//     socket.onopen = function(e) {
//         //("WebSocket connection established");
//     };

//     socket.onmessage = function(e) {
//         const data = JSON.parse(e.data);
//         if (data.type === 'chat') {
//             displayMessage(data);
//         } else if (data.type === 'conversation_history') {
//             displayConversationHistory(data.messages);
//         }
//     };

//     socket.onclose = function(e) {
//         //("WebSocket connection closed");
//     };
// }

// async function fetchFriends() {
//         try {
//             response = SecureApiRequest('/friends/');
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const friendData = await response.json();
//             friends = friendData.map(friend => ({
//                 name: friend.friend_name
//             }));
//             renderFriends();
//         } catch (error) {
//             console.error('Error fetching friends:', error);
//             friends = [
//                 { name: "admin" }
//             ];
//             renderFriends();
//             // friendsList.innerHTML = '<li>Error loading friends. Please try again later.</li>';
//         }
// }

// // Render friends list
// async function renderFriends() {
//     friendsList.innerHTML = '';
//     friends.forEach(friend => {
//         const li = document.createElement('li');
//         li.textContent = friend.username;
//         li.dataset.id = friend.id; // Store the id in the DOM element
//         li.addEventListener('click', () => selectFriend(friend.username));
//         friendsList.appendChild(li);
//     });
// }

// function selectFriend(friendName) {
//     currentRecipient = friendName;
//     fetchConversationHistory(friendName);
//     // Update UI to show selected friend
//     const chatHeader = document.getElementById('chatHeader');
//     chatHeader.textContent = `${friendName}`;
// }

// function fetchConversationHistory(otherUser) {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify({
//             type: 'fetch_messages',
//             other_user: otherUser
//         }));
//     } else {
//         console.error("WebSocket is not connected");
//     }
// }

// function sendMessage() {
//     const messageInput = document.getElementById('messageInput');
//     const message = messageInput.value.trim();
    
//     if (message && currentRecipient) {
//         socket.send(JSON.stringify({
//             type: 'chat',
//             body: message,
//             recipient: currentRecipient
//         }));
//         messageInput.value = '';
//     }
// }


// async function displayMessage(message) {
//     //(message);
//     const messagesContainer = document.getElementById('messagesContainer');
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message');
    
//     const isCurrentUser = message.sender__username === currentUserName;
//     //(message.sender__username + "    "  +  currentUserName);
//     //(isCurrentUser);
//     messageElement.classList.add(isCurrentUser ? 'sent' : 'received');
    
//     const contentSpan = document.createElement('span');
//     contentSpan.classList.add('message-content');
//     contentSpan.textContent = message.body;
    
//     if (!isCurrentUser) {
//         const senderSpan = document.createElement('span');
//         senderSpan.classList.add('message-sender');
//         senderSpan.textContent = ``;
//         messageElement.appendChild(senderSpan);
//     }
    
//     messageElement.appendChild(contentSpan);
//     messagesContainer.appendChild(messageElement);
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;
// }


// function displayConversationHistory(messages) {
//     const messagesContainer = document.getElementById('messagesContainer');
//     messagesContainer.innerHTML = '';
//     messages.forEach(displayMessage);
// }

