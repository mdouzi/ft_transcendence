import { loadGameFront } from './gameLoad.js'

import { setupGamePage  } from './game.js';
import { SecureApiRequest } from './api.js';

export function gameMenu() {
    const content = document.getElementById('goma');
    if (!content) {
        console.error('Error: game-container not found!!!');
        return;
    }

    // Insert the CSS styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        /* Game Menu Styles */
        .game-menu {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 40px;
            padding: 20px;
            margin: 0 auto;
        }

        .game-menu .card {
            width: 400px;
            height: 400px;
            background: linear-gradient(135deg, #1e1e2f, #4b0082);
            border-radius: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
            padding: 20px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            text-align: center;
        }

        .game-menu .card:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 24px rgba(75, 0, 130, 0.8);
        }

        .game-menu .card img {
            width: 100%;
            height: 70%;
            border-radius: 15px;
            transition: transform 0.3s ease;
        }

        .game-menu .card:hover img {
            transform: scale(1.05);
        }

        .game-menu .card h3 {
            margin-top: 10px;
            font-size: 24px;
            color: #ffffff;
            font-weight: bold;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
            .game-menu .card {
                width: 350px;
                height: 350px;
            }
            .game-menu .card h3 {
                font-size: 20px;
            }
        }

        @media (max-width: 768px) {
            .game-menu {
                flex-direction: column;
                align-items: center;
            }
            .game-menu .card {
                width: 90%;
                height: auto;
            }
            .game-menu .card img {
                height: auto;
            }
            .game-menu .card h3 {
                font-size: 18px;
            }
        }

        /* Waiting and Game Mode Styles */
        .waiting-message, .game-started-message {
            text-align: center;
            font-size: 24px;
            color: #ffffff;
            margin-top: 20px;
        }
    `;
    document.head.appendChild(style);

    content.innerHTML = /*html*/ `
        <div class="game-menu">
            <div class="card" onclick="selectMode('1v1')">
                <img src="./images/1vs1.jpg" alt="1 vs 1 Ping Pong">
                <h3>1 vs 1 Ping Pong</h3>
            </div>
            <div class="card" onclick="selectMode('4player')">
                <img src="./images/multipalyer.jpg" alt="Multiplayer">
                <h3>Multiplayer</h3>
            </div>
            <div class="card" onclick="selectMode('1vAI')">
                <img src="./images/ai.jpg" alt="1 vs AI">
                <h3>1 vs AI</h3>
            </div>
        </div>
    `;
}




// Function to handle mode selection
window.selectMode = function (mode) {

    const content = document.getElementById('goma');
    if (!content) {
        console.error('Error: game-container not found!!!');
        return;
    }

    // Clear the menu and show a waiting message
    content.innerHTML = `<div class="waiting-message">Please wait... Starting ${mode}...</div>`;

    // Wait for 3 seconds, then show the game started message
    setTimeout(() => {
        content.innerHTML = `<div class="game-started-message">Game Mode Started: ${mode}</div>`;
        if (mode === '1v1') {
            
        }
       loadGameFront(mode);
    }, 3000);
    
};




