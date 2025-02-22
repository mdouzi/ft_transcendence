import { startGameTournament } from './game1v1.js';

export function loadGameTournament(mode, names) {
    // const app = document.getElementsByClassName('container-main-home')[0];
    const app = document.getElementById("con");
    if (!app) {
        console.error('Error: game-container element not found.');
        return;
    }

    const style = document.createElement('style');
    style.innerHTML = `
        /* Game Styles */
        body {
            margin: 0;
            display: flex;
            place-items: center;
            min-width: 320px;
            min-height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #242424;
            color: rgba(255, 255, 255, 0.87);
        }
    
        #app {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
        }
    
        .game-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            gap: 40px;
        }
    
        .canvas-section {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    
        .customization-section {
            display: flex;
            flex-direction: column;
            align-items: center; /* Center align user info */
            text-align: center; /* Center text */
        }
    
        .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
    
        button {
            border-radius: 8px;
            border: 1px solid transparent;
            padding: 0.6em 1.2em;
            font-size: 1em;
            font-weight: 500;
            font-family: inherit;
            background-color: #1a1a1a;
            color: white;
            cursor: pointer;
            transition: border-color 0.25s;
        }
    
        button:hover {
            border-color: #646cff;
        }
    
        .instructions {
            margin-top: 20px;
        }
    
        .instructions p {
            margin: 5px 0;
        }
    
        #gameCanvas {
            border: 2px solid skyblue;
            border-radius: 4px;
            width: 700px; /* Set canvas width */
            height: 500px; /* Set canvas height */
        }
    
        #userInfo .user-info {
            display: flex;
            justify-content: center; /* Center the user and AI profiles */
            align-items: center; /* Vertically align the items */
            gap: 40px; /* Space between user and AI profiles */
            margin-top: 20px;
            padding: 10px;
            border-top: 2px solid rgba(255, 255, 255, 0.1); /* Separator line */
        }

        #userInfo .user {
            display: flex;
            flex-direction: column; /* Stack image and text vertically */
            align-items: center; /* Center align image and text */
            gap: 10px; /* Space between image and name */
            font-size: 1rem;
            color: #ddd; /* Subtle color for text */
            background-color: #1a1a1a; /* Card-like background */
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Subtle shadow effect */
            width: 180px; /* Consistent card size */
        }

        #userInfo .user img {
            width: 120px; /* Adjusted size for better visibility */
            height: 120px;
            border-radius: 50%; /* Circular image */
            border: 2px solid skyblue; /* Border for user profile image */
        }

        #userInfo .user p {
            margin: 0;
            font-weight: bold;
            font-size: 1.1rem;
            text-align: center;
        }


    `;
    document.head.appendChild(style);

    app.innerHTML = /*html*/ `
    <div class="canvas-section">
        <canvas id="gameCanvas"></canvas>
    </div>
    <div class="customization-section">
        <div class="instructions">
            <p>Player 1 (Left): W/S</p>
            <p>Player 2 (Right): ↑/↓</p>
        </div>
        <div class="user-info" id="userInfo"></div>
    </div>
    `;
    
    displayUserInfo(); // Call the function to display user info
    startGameTournament();
    //("start game called and displayUser called");
}

function displayUserInfo() {
    const userInfoContainer = document.getElementById('userInfo');
    
    // Fetch user data from local storage
    let username ;
    let userPic ;
    let username2 ;
    let userPic2 ;

    if(localStorage.getItem("game1") == "start")
    {
        username = localStorage.getItem('player1Name');
        userPic = localStorage.getItem('player1Image');
        username2 = localStorage.getItem('player2Name');
        userPic2 = localStorage.getItem('player2Image');
    }
    else if(localStorage.getItem("game2") == "start")
    {
        username = localStorage.getItem('username');
        userPic = localStorage.getItem('photo');
        username2 = localStorage.getItem('player3Name');
        userPic2 = localStorage.getItem('player3Image');
    }
    else if(localStorage.getItem("game3") == "start")
    {
        username = localStorage.getItem("firstWinName");
        userPic = localStorage.getItem("firstWinImage");
        username2 = localStorage.getItem("secondWinName");
        userPic2 = localStorage.getItem("secondWinImage");
    }

    // Create user info elements
    userInfoContainer.innerHTML = /*html*/ `
        <div class="user">
            <img src="${userPic}" alt="${username}'s picture">
            <p>${username}</p>
        </div>
        <div class="user">
            <img src="${userPic2}" alt="${username2}'s picture">
            <p>${username2}</p>
        </div>
    `;
}