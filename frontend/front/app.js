import { routes, populateProfile} from './routes.js';
import { togglePass, logout, clickEvent, GoLogin } from './utils.js';
import { inputSearch, renderAll } from './profile.js';
import {SecureApiRequest} from './api.js';
import { isValidUrl } from './routes.js';
import {loadGameTournament} from './gameTournament.js';
import {loadTournament } from './tournamentHtml.js'





let currentState = { view: "login" };
let isNavigating = false;

function toggle_visibility(id) 
{
    var e = document.getElementById(id);
    if ( e.style.display == 'block' )
        e.style.display = 'none';
    else
        e.style.display = 'block';
}

const NonAuthenticated = ["/", "/register", "/forget_passwd", "/bridg", "/login_42", "/OTP", ];

function toggleNavbarAndSearchBar(path) 
{
    if (!NonAuthenticated.includes(path)) 
    { 

        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        const photo = localStorage.getItem("photo"); 
        // callForTopNav();

        setTimeout(function() {
            renderAll();
            tournamentOrders();
            callForTopNav();
            startTournament()
            listHistoryEachProfile()
            callLocalStorageLogic()
        }, 100); 
        
        populateProfile(); 
        
        document.getElementById("user-username").textContent = username;
        document.getElementById("user-email").textContent = email;
        document.getElementById("user-photo").src = photo;
        
        navbar.style.display = 'block';
        navbar.style.opacity = '1';
        bruh.style.display = 'flex';
        if(path === "/tournament")
            navbar.style.display = 'none';
    }
    else 
    {
        bruh.style.display = 'none';
        navbar.style.display = 'none';
    }
}


function handleEvent(selector, isNavbar = false)
{
    const Button = document.querySelectorAll(selector);
    if(Button)
    {
        Button.forEach(button => 
        {
            if (!button.hasAttribute('data-listener-attached'))
            {

                button.addEventListener("click", (event) => 
                {
                    event.preventDefault(); 

                    if (isNavigating && isNavbar) 
                        return; 
                    isNavigating = true;

                    const targetView = event.target.dataset.view || event.currentTarget.dataset.view;

                    history.pushState({}, "", targetView); 
                    handleLocation();

                    if(isNavbar)
                    {
                        setTimeout(() => {
                            isNavigating = false;
                        }, 10);
                    }
                });
                button.setAttribute('data-listener-attached', 'true');
            }
        });
    }
}

function isUserAuthenticated(path)
{
    if(!localStorage.getItem("accessToken") && !NonAuthenticated.includes(path))
        return false;
    return true
}


export const handleLocation = () => 
{
    inputSearch.value = ""
    const path = window.location.pathname;
    currentState.view = path;

    if(!isUserAuthenticated(path))
    {
        GoLogin();
        return;
    }

    if(localStorage.getItem("accessToken") && NonAuthenticated.includes(path))
    {
        history.pushState({}, "", '/profile'); 
        handleLocation('/profile');
        return;
    }

    const route = routes[path] ? routes[path] : routes["/404"];

    document.getElementById("con").innerHTML = route.html;
    toggleNavbarAndSearchBar(path);
    
    if (route.setup) 
        route.setup();

    handleEvent(".inpute");
    handleEvent(".barinpute", true);
};



document.getElementById("logout").addEventListener("click", function(event) {
    event.preventDefault(); 
    logout(); 
});

 

function tournamentOrders()
{
    let joinTournament = document.getElementById("join-tournament");
    if(joinTournament)
    {
        joinTournament.addEventListener("click", function(event) {
            
        });
    }
}

let btn = document.querySelector('#btn');
let sidebar = document.querySelector('.sidebar');

btn.onclick = function() {
        sidebar.classList.toggle('active'); 
};

async function acceptRequest(id)
{
    const info = await SecureApiRequest("/api/friend/respond_friend_request/", "POST", `{"request_id": ${id}, "action": "accept"}`);
}

async function returnDataFriendsResquest()
{
    const info = await SecureApiRequest("/api/friend/list_friends_request/", "GET");
    return info;
}

async function callForTopNav()
{
    
    // const info = await SecureApiRequest("/api/friend/list_friends_request/", "GET")
    let iconDownbutton =  document.getElementById("iconDownbutton");
    let poupapNotification = document.getElementById("poupapNotification")
    let removeNotifcationBackground = document.getElementsByClassName("removeNotifcationBackground")[0];
    let valid = 0
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.length > 0) {
          const classNames = event.target.classList.toString();
          let array = ["poupap-notifacation", "second-name", "first-img", "third-button", "container-request", "first-imgI", "second-nameP", "third-buttonB"]
          let I = 0;
          let validNot = 0;
          while(I < array.length)
          {
            if(classNames != array[I])
            {
                // alert(1)
                validNot++;
            }
            I++;
          }
          if(validNot == 8)
            poupapNotification.style.display = "none"
            validNot = 0;
        }
      });
      
    iconDownbutton.addEventListener('click', async function(){
       
        const info = await SecureApiRequest("/api/friend/list_friends_request/", "GET");
       
        poupapNotification.innerHTML = ``;
        
        // //("poupapNotification.style.display ===> ", poupapNotification.style.display)
        if(valid == 0)
        {
            
            valid = 1;
            poupapNotification.style.display = "flex"
            let i = 0;
            if(info.incoming_requests.length > 0)
            {   
                while(i < info.incoming_requests.length)
                {
                    let photo = info.incoming_requests[i].from_user_photo;
                    if(!isValidUrl(photo))
                    {
                        //("hello url is path:", isValidUrl(photo));
                        photo = `http://127.0.0.1:8000${photo}`;
                    }

                    poupapNotification.innerHTML += `
                    <div class="container-request">
                        <div class="first-img"><img class="first-imgI" src="${photo}" alt="" srcset=""></div>
                        <div class="second-name"><p class="second-nameP">${info.incoming_requests[i].from_user}</p></div>
                        <div class="third-button" id="${info.incoming_requests[i].id}"><button class="third-buttonB">accept</button></div>
                    </div>
                    `;
                    i++;
                }
                let button  = document.getElementsByClassName("third-button");
                let j = 0;
                let count = 0;
                while (j < button.length) {
                    let currentButton = button[j];
                    currentButton.addEventListener("click", function() {
                        //("count ok ===> ",count)
                        count++
                        let requestId = this.id;
                        acceptRequest(requestId);
                        //("Button clicked with request ID: ", requestId);
                        let grandParent = currentButton.parentElement;
                        grandParent.style.display = "none";
                        if(button.length == 1 || button.length == count)
                        {
                            count = 0;
                            poupapNotification.innerHTML = `
                            <div class="container-request" style="display:flex; justify-content:center; align-items: center; height:50px;">
                                <p>No one</p>
                            </div>
                            `;
                        }
                    });

                    j++;
                }
                
               
                
            }
            else
            {
                poupapNotification.innerHTML = `
                    <div class="container-request" style="display:flex; justify-content:center; align-items: center; height:50px;">
                        <p>No one</p>
                    </div>
                    `;
            }
        }
        else if(valid == 1)
        {
            valid = 0;
            poupapNotification.style.display = "none"
        }
    })
}

function returnTime()
{
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return(`${hours}:${minutes}`)
}


function deisplayNoneMain()
{
    
    let con = document.getElementById("con");
    con.style.display = "flex"
    con.style.justifyContent = "space-around"
    con.style.height = "90%"
    con.style.alignItems = "center"
    con.innerHTML = '';
    
    loadGameTournament("1v1");
}

function callContainerCount()
{
    let containerCount = document.getElementsByClassName("containerCount")[0];
    containerCount.style.display = "flex"
    let count = 3; 
    let countdownElement = document.getElementsByClassName('countPlace')[0];
    let interval = setInterval(() => {
    countdownElement.textContent = count; 
    count--;

    if (count < 0) {
        clearInterval(interval); // Stop the interval when count reaches 0
        countdownElement.textContent = "Go!"; 
        // containerCount.style.display = "none"
        setTimeout(() => deisplayNoneMain(), 1000);
    }
    }, 1000);
}



export function intilizeNameImage2()
{
    let imgaePlayer = document.getElementsByClassName("imagePlayer");
    let namePlayer  = document.getElementsByClassName("namePlayer");
    let parentContainerJoinTournament = document.getElementsByClassName("parent-container-join-tournament")[0];
    let containerFriends = document.getElementsByClassName("container-friends")[0];
    imgaePlayer[0].setAttribute('xlink:href', localStorage.getItem(`player${1}Image`))
    imgaePlayer[1].setAttribute('xlink:href', localStorage.getItem(`player${2}Image`))
    imgaePlayer[5].setAttribute('xlink:href', localStorage.getItem(`player${3}Image`))
    imgaePlayer[6].setAttribute('xlink:href', localStorage.getItem(`photo`))


    namePlayer[0].textContent = localStorage.getItem(`player${1}Name`)
    namePlayer[1].textContent = localStorage.getItem(`player${2}Name`)
    namePlayer[4].textContent = localStorage.getItem(`username`)
    namePlayer[5].textContent = localStorage.getItem(`player${3}Name`)
    //("i want to see if is full or no okkkkkkkkkkkkkkkkkkkkkk",localStorage.getItem(`username`))
    parentContainerJoinTournament.style.display = "none";
    containerFriends.innerHTML = ""
    containerFriends.style.justifyContent = "none"
    // setTimeout(() => intilizeNameImage(), 3000);
}


function intilizeNameImage()
{
    let imgaePlayer = document.getElementsByClassName("imagePlayer");
    let namePlayer  = document.getElementsByClassName("namePlayer");
    let parentContainerJoinTournament = document.getElementsByClassName("parent-container-join-tournament")[0];
    let containerFriends = document.getElementsByClassName("container-friends")[0];
    imgaePlayer[0].setAttribute('xlink:href', localStorage.getItem(`player${1}Image`))
    imgaePlayer[1].setAttribute('xlink:href', localStorage.getItem(`player${2}Image`))
    imgaePlayer[5].setAttribute('xlink:href', localStorage.getItem(`player${3}Image`))
    imgaePlayer[6].setAttribute('xlink:href', localStorage.getItem(`photo`))


    namePlayer[0].textContent = localStorage.getItem(`player${1}Name`)
    namePlayer[1].textContent = localStorage.getItem(`player${2}Name`)
    namePlayer[4].textContent = localStorage.getItem(`username`)
    namePlayer[5].textContent = localStorage.getItem(`player${3}Name`)
    //("i want to see if is full or no okkkkkkkkkkkkkkkkkkkkkk",localStorage.getItem(`username`))
    parentContainerJoinTournament.style.display = "none";
    containerFriends.innerHTML = ""
    containerFriends.style.justifyContent = "none"
    callContainerCount()
    // setTimeout(() => intilizeNameImage(), 3000);
}




export async function startTournament()
{
    let joinTournament = document.getElementById("join-tournament")
    let closeTournament = document.getElementById("close-tournament")
    let containerFriends = document.getElementsByClassName("container-friends")[0];
let parentContainerJoinTournament = document.getElementsByClassName("parent-container-join-tournament")[0];
   
    let startTournament = document.getElementById("startTournament");
    let back = document.getElementById("backToProfile");
    let containerFriend = document.getElementsByClassName("container-friend");
    let containerCount = document.getElementsByClassName("containerCount")[0];

    if(back) {
        back.addEventListener("click", function(){
            history.pushState({}, "", "/profile");
                    handleLocation();
        })
    }

    function displayLoadingFriend(arg)
    {
        let j = 0;
        
        while(containerFriend && j < containerFriend.length)
        {
            containerFriend[j].style.display = arg
            j++;
        }
    }
    if(joinTournament)
    {
        
          
            joinTournament.addEventListener("click", function(){
                displayContainerFriends()
                displayLoadingFriend("flex")
            parentContainerJoinTournament.style.display = "flex";
            localStorage.setItem("player1", "")
            localStorage.setItem("player2", "")
            localStorage.setItem("player3", "")
            localStorage.setItem(`player1Image`, "")
            localStorage.setItem(`player2Image`, "")
            localStorage.setItem(`player3Image`, "")
            localStorage.setItem(`player1Name`, "")
            localStorage.setItem(`player2Name`, "")
            localStorage.setItem(`player3Name`, "")
            localStorage.setItem(`player1Score`, "")
            localStorage.setItem(`player2Score`, "")
            localStorage.setItem(`player3Score`, "")
            localStorage.setItem(`firstWinScore`, "")
            localStorage.setItem(`secondWinScore`, "")
            localStorage.setItem("game1", "")
            localStorage.setItem("game2", "")
            localStorage.setItem("game3", "")
            localStorage.setItem("gameEnd", "")
            localStorage.setItem("firstWin", "")
            localStorage.setItem("firstWinImage", "")
            localStorage.setItem("firstWinName", "")
            localStorage.setItem("firstWin", "")
            localStorage.setItem("secondWin", "")
            localStorage.setItem("secondWinName", "")
            localStorage.setItem("secondWinImage", "")
            localStorage.setItem("Winner", "")
            localStorage.setItem("WinnerImage", "")
            localStorage.setItem("WinnerName", "")
            let ScoreGame1 = document.getElementById("ScoreGame1")
            let ScoreGame2 = document.getElementById("ScoreGame2")
            ScoreGame1.innerHTML = ``
            ScoreGame2.innerHTML = ``
            // localStorage.setItem("player4", "")
            // let player1 = {
            //     id: inputElement.id,
            //     value: inputElement.value,
            //     type: inputElement.type
            //   };
            let imgaePlayer = document.getElementsByClassName("imagePlayer");
            let namePlayer  = document.getElementsByClassName("namePlayer");
            let buttonAdd = document.getElementsByClassName("buttonAdd");
                let j = 0;
                let numbers  = 1;
                while(j < buttonAdd.length)
                {
                    // if(numbers <= 3 && buttonAdd[j].id == localStorage.getItem(`player${numbers}`))
                    // {
                        //("waaaaaa heyaaaaaa ana ka 5ewiiiik hena okkk")
                        buttonAdd[j].style.backgroundColor = "#99185D";
                        buttonAdd[j].disabled = false;
                        numbers++;
                    // }
                    j++;
                }
                imgaePlayer[0].setAttribute('xlink:href', "./images/avatar.png")
                imgaePlayer[4].setAttribute('xlink:href', "./images/avatar.png")
                imgaePlayer[3].setAttribute('xlink:href', "./images/avatar.png")
                imgaePlayer[2].setAttribute('xlink:href', "./images/avatar.png")
                imgaePlayer[1].setAttribute('xlink:href', "./images/avatar.png")
                imgaePlayer[5].setAttribute('xlink:href', "./images/avatar.png")
                imgaePlayer[6].setAttribute('xlink:href', "./images/avatar.png")

                namePlayer[0].textContent = "none"
                namePlayer[3].textContent = "none"
                namePlayer[1].textContent = "none"
                namePlayer[2].textContent = "none"
                namePlayer[6].textContent = "none"
                namePlayer[4].textContent = "none"
                namePlayer[5].textContent = "none"
        })




        closeTournament.addEventListener("click", function(){
            parentContainerJoinTournament.style.display = "none";
            let buttonAdd = document.getElementsByClassName("buttonAdd");
                let j = 0;
                let numbers  = 1;
                while(j < buttonAdd.length)
                {
                    //("waaaaaa heyaaaaaa ana ka 5ewiiiik hena okkk")
                    buttonAdd[j].style.backgroundColor = "#99185D";
                    buttonAdd[j].disabled = false;
                    numbers++;
                    
                    j++;
                }
                localStorage.setItem("player1", "")
                localStorage.setItem("player2", "")
                localStorage.setItem("player3", "")
                localStorage.setItem(`player1Image`, "")
                localStorage.setItem(`player2Image`, "")
                localStorage.setItem(`player3Image`, "")
                localStorage.setItem(`player1Name`, "")
                localStorage.setItem(`player2Name`, "")
                localStorage.setItem(`player3Name`, "")
                localStorage.setItem(`player1Score`, "")
                localStorage.setItem(`player2Score`, "")
                localStorage.setItem(`player3Score`, "")
                localStorage.setItem(`firstWinScore`, "")
                localStorage.setItem(`secondWinScore`, "")
                localStorage.setItem("game1", "")
                localStorage.setItem("game2", "")
                localStorage.setItem("game3", "")
                localStorage.setItem("gameEnd", "")
                localStorage.setItem("firstWin", "")
                localStorage.setItem("firstWinImage", "")
                localStorage.setItem("firstWinName", "")
                localStorage.setItem("firstWin", "")
                localStorage.setItem("secondWin", "")
                localStorage.setItem("secondWinName", "")
                localStorage.setItem("secondWinImage", "")
                localStorage.setItem("Winner", "")
                localStorage.setItem("WinnerImage", "")
                localStorage.setItem("WinnerName", "")
        })


        async function displayContainerFriends()
        {
            const info = await SecureApiRequest("/api/friend/get_friends/");
                //("infoooooooooooooooooooooooo", info)


                if(info.friends.length > 0)
                {   
                    //("=======================nchooofo chono kayin aderari sf========================")
                    containerFriends.innerHTML = ``;
                    let i = 0;
                    while(i < info.friends.length)
                    {
                        let photo = info.friends[i].photo;
                            if(!isValidUrl(photo))
                                photo = `http://127.0.0.1:8000${photo}`;
                        containerFriends.innerHTML += `
                        <div class="container-friend">
                            <div class="container-img"><img src="${photo}" alt=""></div>
                            <div class="container-name"><p>${info.friends[i].username}</p></div>
                            <div class="container-button"><button class="buttonAdd" id="${info.friends[i].id}">ADD</button> <button class="buttonRemove" id="${info.friends[i].id}">REMOVE</button></div>
                        </div>
                        
                        `
                        i++;
                    }
                    if(info.friends.length < 3)
                        startTournament.innerHTML = "CAN'T"

                    let buttonAdd = document.getElementsByClassName("buttonAdd");
                    let buttonRemove = document.getElementsByClassName("buttonRemove")
                    let imgaePlayer = document.getElementsByClassName("imagePlayer");

                    let count = 0;
                    if(buttonAdd.length > 0 && info.friends.length >= 0 && count < 4 && info.friends.length >= 3)
                    {
                        
                        let j = 0;
                        let numberP = 0;
                        while(j < buttonAdd.length)
                        {
                            let currentButton = buttonAdd[j];
                            currentButton.addEventListener("click", function(){
                                if(currentButton.disabled == false && !localStorage.getItem("player3"))
                                {
                                    if(!localStorage.getItem("player1"))
                                        localStorage.setItem("player1", this.id);
                                    else if(!localStorage.getItem("player2"))
                                        localStorage.setItem("player2", this.id);
                                    else if(!localStorage.getItem("player3"))
                                        localStorage.setItem("player3", this.id);
                                    currentButton.disabled = true;
                                    currentButton.style.backgroundColor = "#66103E"
                                }
                                // //("player 1=======>", localStorage.getItem("player1"))
                            })
                            j++;
                        }
                        j = 0;
                        let numbers  = 1;
                        while(j < buttonAdd.length)
                        {
                            if(numbers <= 4 && buttonAdd[j].id == localStorage.getItem(`player${numbers}`))
                            {
                                buttonAdd[j].style.backgroundColor = "#66103E";
                                buttonAdd[j].disabled = true;
                                numbers++;
                            }
                            j++;
                        }
                    }
                }
        }
        
        
        




        startTournament.addEventListener("click", function(){
            let imgaePlayer = document.getElementsByClassName("imagePlayer");
            let namePlayer = document.getElementsByClassName("namePlayer");
            localStorage.setItem("game1", "start")
            localStorage.setItem("gameEnd", "start")
            if(localStorage.getItem("player1") && localStorage.getItem("player2") && localStorage.getItem("player3"))
            {
                let i = 1;
                let j2 = 0;
                while(i <= 3)
                {
                    fetch(`/api/get/${localStorage.getItem(`player${i}`)}/`)
                    .then(response => response.json())
                    .then(data => {
                        //("n chooooooof had data chono fiha ok a dearaaaaaaaaari", data)
                        let photo = data.photo;
                        if(!isValidUrl(photo))
                            photo = `http://127.0.0.1:8000${photo}`;

                        if(!localStorage.getItem("player1Image"))
                        {
                            localStorage.setItem("player1Image", photo);
                            localStorage.setItem("player1Name", data.username);
                        }
                        else if(!localStorage.getItem("player2Image"))
                        {
                            localStorage.setItem("player2Image", photo);
                            localStorage.setItem("player2Name", data.username);
                        }
                        else if(!localStorage.getItem("player3Image"))
                        {
                            localStorage.setItem("player3Image", photo);
                            localStorage.setItem("player3Name", data.username);
                        }
                        j2++;
                    })
                    .catch(error => {
                    
                    });
                    i++;
                }
                let buttonAdd = document.getElementsByClassName("buttonAdd");
                let j = 0;
                let numbers  = 1;
                while(j < buttonAdd.length)
                {
                    if(numbers <= 3 && buttonAdd[j].id == localStorage.getItem(`player${numbers}`))
                    {
                        //("waaaaaa heyaaaaaa ana ka 5ewiiiik hena okkk")
                        buttonAdd[j].style.backgroundColor = "#99185D";
                        buttonAdd[j].disabled = false;
                        numbers++;
                    }
                    j++;
                }

                
               
                // make the container of friend display none
                displayLoadingFriend("none")
                containerFriends.innerHTML = "<div class='loader'></div>"
                containerFriends.style.justifyContent = "center"

                

                

                setTimeout(() => intilizeNameImage(), 3000);
                
            }
        })
        let imgaePlayer = document.getElementsByClassName("imagePlayer");
            let namePlayer  = document.getElementsByClassName("namePlayer");
        // loadGameFront
        // container-main-home
        if(localStorage.getItem("game1") == "end" && localStorage.getItem("player1Image"))
        {
            // localStorage.setItem("game1", "");
            imgaePlayer[2].setAttribute('xlink:href', localStorage.getItem(`firstWinImage`))
            namePlayer[2].textContent = localStorage.getItem(`firstWinName`)
        }
        if(localStorage.getItem("game2") == "end")
        {
            // localStorage.setItem("game2", "");
            imgaePlayer[4].setAttribute('xlink:href', localStorage.getItem(`secondWinImage`))
            namePlayer[6].textContent = localStorage.getItem(`secondWinName`)
        }
        if(localStorage.getItem("game3") == "end")
        {
            localStorage.setItem("tor", "end")
            // localStorage.setItem("game2", "");
            imgaePlayer[3].setAttribute('xlink:href', localStorage.getItem(`WinnerImage`))
            namePlayer[3].textContent = localStorage.getItem(`WinnerName`)
            setTimeout(() => {
                history.pushState({}, "", "/profile");
                handleLocation();
            }, 3000);
            localStorage.setItem("game3", "")
        }
        if(localStorage.getItem("player1Image"))
        {
            

            imgaePlayer[0].setAttribute('xlink:href', localStorage.getItem(`player${1}Image`))
            imgaePlayer[1].setAttribute('xlink:href', localStorage.getItem(`player${2}Image`))
            imgaePlayer[5].setAttribute('xlink:href', localStorage.getItem(`player${3}Image`))
            imgaePlayer[6].setAttribute('xlink:href', localStorage.getItem(`photo`))

            namePlayer[0].textContent = localStorage.getItem(`player${1}Name`)
            namePlayer[1].textContent = localStorage.getItem(`player${2}Name`)
            namePlayer[4].textContent = localStorage.getItem(`username`)
            namePlayer[5].textContent = localStorage.getItem(`player${3}Name`)
        }

    }
    let continueButton = document.getElementById("continueButton")
    if(continueButton)
    {

        continueButton.addEventListener("click", function() {
            
            if(localStorage.getItem("game2") != "end")
            {
                localStorage.setItem("game2Time",returnTime())
                localStorage.setItem("game2", "start")
            }
            else if(localStorage.getItem("game3") != "end")
            {
                localStorage.setItem("game3Time",returnTime())
                localStorage.setItem("game3", "start")
            }

            if(localStorage.getItem("game3") != "end")
            {
                localStorage.setItem("gameEnd", "start")
                deisplayNoneMain()
            }
        })
    }


    let ScoreGame1 = document.getElementById("ScoreGame1")
    let ScoreGame2 = document.getElementById("ScoreGame2")
    if(localStorage.getItem("player1Score") && ScoreGame1)
    {
        ScoreGame1.innerHTML += `
        <div class="container-row">
            <div class="child-container-row">
                <div class="first-part">
                    <div class="container-img"><img src="${localStorage.getItem("player1Image")}" alt=""></div>
                    <p>${localStorage.getItem("player1Score")}</p>
                </div>
                <div class="second-part">
                    <p>VS</p>
                    <div class="container-time">${localStorage.getItem("game1Time")}</div>
                </div>
                <div class="third-part">
                    <p>${localStorage.getItem("player2Score")}</p>
                    <div class="container-img"><img src="${localStorage.getItem("player2Image")}" alt=""></div>
                </div>
            </div>
        </div>
        `
        if(localStorage.getItem("player3Score") && ScoreGame1)
        {
            ScoreGame1.innerHTML += `
            <div class="container-row">
                <div class="child-container-row">
                    <div class="first-part">
                        <div class="container-img"><img src="${localStorage.getItem("photo")}" alt=""></div>
                        <p>${localStorage.getItem("player3Score")}</p>
                    </div>
                    <div class="second-part">
                        <p>VS</p>
                        <div class="container-time">${localStorage.getItem("game2Time")}</div>
                    </div>
                    <div class="third-part">
                        <p>${localStorage.getItem("player4Score")}</p>
                        <div class="container-img"><img src="${localStorage.getItem("player3Image")}" alt=""></div>
                    </div>
                </div>
            </div>
            `
        }
    }
    if(localStorage.getItem("firstWinScore") && ScoreGame2)
    {
        ScoreGame2.innerHTML += `
        <div class="container-row">
            <div class="child-container-row">
                <div class="first-part">
                    <div class="container-img"><img src="${localStorage.getItem("firstWinImage")}" alt=""></div>
                    <p>${localStorage.getItem("firstWinScore")}</p>
                </div>
                <div class="second-part">
                    <p>VS</p>
                    <div class="container-time">${localStorage.getItem("game3Time")}</div>
                </div>
                <div class="third-part">
                    <p>${localStorage.getItem("secondWinScore")}</p>
                    <div class="container-img"><img src="${localStorage.getItem("secondWinImage")}" alt=""></div>
                </div>
            </div>
        </div>
        `
    }
   let containerBestPlayers = document.getElementById("container-best-players")
   if(containerBestPlayers)
   {
        const users = JSON.parse(localStorage.getItem("users"))
        if (users && users.length > 0) {
            let index = 0;
            containerBestPlayers.innerHTML  = ``
            // Using a while loop to iterate over the array
            
            while (index < users.length) {
                const user = users[index];
                
                    containerBestPlayers.innerHTML += `
                        <div class="child-container-chalange">
                            <div class="contaienr-chalange-img-left"><img src="${user.imagePlayer1}" alt=""><p>${user.scorePlayer1}</p></div>
                            <div class="container-VS">${user.time}</div>
                            <div class="contaienr-chalange-img-right"><p>${user.scorePlayer2}</p><img src="${user.imagePlayer2}" alt=""> </div>
                        </div>
                    `;
                // Increment the index to move to the next user
                index++;
            }
        } else {
            //("No users found in localStorage.");
        }
   }
}




function callLocalStorageLogic() {
    function initializeUsersArray() {
        const storedUsers = localStorage.getItem("users");

        if (!storedUsers) {
            const emptyArray = [];
            localStorage.setItem("users", JSON.stringify(emptyArray));
            //("The 'users' array has been initialized in localStorage.");
        } else {
            //("The 'users' array already exists in localStorage.");
        }
    }

    initializeUsersArray();
}

export function addUserData(namePlayer1, imagePlayer1, scorePlayer1, namePlayer2, imagePlayer2, scorePlayer2, time) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = {
        namePlayer1, 
        imagePlayer1, 
        scorePlayer1, 
        namePlayer2, 
        imagePlayer2, 
        scorePlayer2,
        time
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
}



function listHistoryEachProfile()
{
    let listHistoryInEachProfile = document.getElementById("listHistoryInEachProfile")
    if(listHistoryInEachProfile)
    {
        const users = JSON.parse(localStorage.getItem("users"))
            if (users && users.length > 0) {
                let index = 0;
                listHistoryInEachProfile.innerHTML  = ``
                // Using a while loop to iterate over the array
                
                while (index < users.length) {
                    const user = users[index];
                    if(localStorage.getItem("eachProfileUserName") == user.namePlayer1 || localStorage.getItem("eachProfileUserName") == user.namePlayer2)
                    {
                        listHistoryInEachProfile.innerHTML += `
                            <div class="child-container-chalange">
                                <div class="contaienr-chalange-img-left"><img src="${user.imagePlayer1}" alt=""><p>${user.scorePlayer1}</p></div>
                                <div class="container-VS">${user.time}</div>
                                <div class="contaienr-chalange-img-right"><p>${user.scorePlayer2}</p><img src="${user.imagePlayer2}" alt=""> </div>
                            </div>
                        `;
                    }
                    // Increment the index to move to the next user
                    index++;
                }
            } else {
                //("No users found in localStorage.");
            }
    }
}


 
window.togglePass = togglePass;
window.clickEvent = clickEvent;
window.logout = logout;

window.addEventListener("popstate", handleLocation);

window.addEventListener("DOMContentLoaded", handleLocation);