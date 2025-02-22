import { startGame } from './game.js';
import { startGame4players } from './game4Players.js';

export function loadGameFront(mode) {
    const app = document.getElementById('goma');	
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
            <p>Player 3 (Top): A/D</p>
            <p>Player 4 (Bottom): ←/→</p>
        </div>
        <div class="user-info" id="userInfo"></div>
    </div>
    `;

    if(mode == '1VAI'){
        displayUserInfo();
    } else if(mode == '4player'){
        //("4 players mode");
        startGame4players();
    } else {
    startGame(mode);
    }
    //("start game called and displayUser called");
}

function displayUserInfo() {
    const userInfoContainer = document.getElementById('userInfo');
    
    // Fetch user data from local storage
    const username = localStorage.getItem('username');
    const userPic = localStorage.getItem('photo'); // Default picture if none is set

    // Create user info elements
    userInfoContainer.innerHTML = /*html*/ `
        <div class="user">
            <img src="${userPic}" alt="${username}'s picture">
            <p>${username}</p>
        </div>
        <div class="user">
            <img src="./images/ai-profile.png" alt="AI picture"> <!-- Placeholder for AI picture -->
            <p>AI</p>
        </div>
    `;
}