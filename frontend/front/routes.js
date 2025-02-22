
import { SanitizeInpute, GoLogin, showError, validatePassword, getCookie, deleteCookie, clickEvent, logout} from './utils.js';
import { handleLocation } from './app.js';
import { SecureApiRequest} from './api.js';
import { loadChatInterface } from './chat.js';
import { loadGameFront} from './gameLoad.js';
import { gameMenu} from './gameMenu.js';
import {loadTournament } from './tournamentHtml.js'

{/* <button id='test' style='z-index:10'>hey</button> */}
{/* <div> */}
{/*                     <a href="javascript: history.go(-1)"style="color: black;text-decoration: none; font-weight: bolder;">back</a> */}
{/*                     </div> */}


export const routes = {

    "/" : { 
    html: `
            <div class="cart">
                <h2 class="title"> login </h2>
                <form class="form" id="login-form">
                    <div class="input-group">
                        <label for="username">username</label>
                        <input type="text" name="username" autocomplete="on" id="username" placeholder="Username" required>

                        <div class="form-group">
                            <label for="password">password</label>
                            <input type="password" name="password" autocomplete="on" id="password" placeholder="Password" required>

                            <svg onclick="togglePass('password')" id="Layer_1password" data-name="Layer 1" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>eye-glyph</title><path d="M320,256a64,64,0,1,1-64-64A64.07,64.07,0,0,1,320,256Zm189.81,9.42C460.86,364.89,363.6,426.67,256,426.67S51.14,364.89,2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.14,147.11,148.4,85.33,256,85.33s204.86,61.78,253.81,161.25A21.33,21.33,0,0,1,509.81,265.42ZM362.67,256A106.67,106.67,0,1,0,256,362.67,106.79,106.79,0,0,0,362.67,256Z"/></svg>
                            <svg onclick="togglePass('password')" hidden id="Layer_2password" data-name="Layer 2" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>eye-disabled-glyph</title><path d="M409.84,132.33l95.91-95.91A21.33,21.33,0,1,0,475.58,6.25L6.25,475.58a21.33,21.33,0,1,0,30.17,30.17L140.77,401.4A275.84,275.84,0,0,0,256,426.67c107.6,0,204.85-61.78,253.81-161.25a21.33,21.33,0,0,0,0-18.83A291,291,0,0,0,409.84,132.33ZM256,362.67a105.78,105.78,0,0,1-58.7-17.8l31.21-31.21A63.29,63.29,0,0,0,256,320a64.07,64.07,0,0,0,64-64,63.28,63.28,0,0,0-6.34-27.49l31.21-31.21A106.45,106.45,0,0,1,256,362.67ZM2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.15,147.11,148.4,85.33,256,85.33a277,277,0,0,1,70.4,9.22l-55.88,55.88A105.9,105.9,0,0,0,150.44,270.52L67.88,353.08A295.2,295.2,0,0,1,2.19,265.42Z"/></svg>
                        </div>
                        <div class="forgot">
                            <a rel="noopener noreferrer" href="#" id="forget-passwd" class="inpute" data-view="forget_passwd">forgot password ?</a>
                        </div>
                    </div>
                    <button type="submit" id="login"  data-view="profile">login</button>
                </form>
                
                <div id="errordiv" align="center" style="margin-left: auto; margin-right: auto;"> 
                    <span id="error" style="color: white; display: none"></span> 
                </div>

                <div class="intra">
                    <div class="line"></div>
                    <p class="message">or</p> 
                    <div class="line"></div>
                </div>
                <button id="login-intra" class="inpute" data-view="login_42">login with 42 intra</button>

                <div class="social-icons">
                    <p class="signup"><br/>don't have an account?
                    <a rel="noopener noreferrer" href="#" class="inpute" id="signup-link" data-view="register">sign up</a>
                    </p>
                </div>
            </div>`,
    setup: setupLoginPage,
    },
    "/register" : {
        html: `
            <div class="cart">
                <h2 class="title"> register </h2>
                
                <form class="form" id="register-form">
                    <div class="input-group" id="reg">

                        <label for="username">username</label>
                        <input type="text" name="username" autocomplete="on" id="username" placeholder="username" required>

                        <label for="email">email</label>
                        <input type="text" name="email"  autocomplete="on" id="email" placeholder="email" required>



                        <div class="form-group">
                            <label for="password">password</label>
                            <input type="password" name="password"  autocomplete="on" id="password" placeholder="password" required>

                            <svg onclick="togglePass('password')" id="Layer_1password" data-name="Layer 1" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>eye-glyph</title><path d="M320,256a64,64,0,1,1-64-64A64.07,64.07,0,0,1,320,256Zm189.81,9.42C460.86,364.89,363.6,426.67,256,426.67S51.14,364.89,2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.14,147.11,148.4,85.33,256,85.33s204.86,61.78,253.81,161.25A21.33,21.33,0,0,1,509.81,265.42ZM362.67,256A106.67,106.67,0,1,0,256,362.67,106.79,106.79,0,0,0,362.67,256Z"/></svg>
                            <svg onclick="togglePass('password')" hidden id="Layer_2password" data-name="Layer 2" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>eye-disabled-glyph</title><path d="M409.84,132.33l95.91-95.91A21.33,21.33,0,1,0,475.58,6.25L6.25,475.58a21.33,21.33,0,1,0,30.17,30.17L140.77,401.4A275.84,275.84,0,0,0,256,426.67c107.6,0,204.85-61.78,253.81-161.25a21.33,21.33,0,0,0,0-18.83A291,291,0,0,0,409.84,132.33ZM256,362.67a105.78,105.78,0,0,1-58.7-17.8l31.21-31.21A63.29,63.29,0,0,0,256,320a64.07,64.07,0,0,0,64-64,63.28,63.28,0,0,0-6.34-27.49l31.21-31.21A106.45,106.45,0,0,1,256,362.67ZM2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.15,147.11,148.4,85.33,256,85.33a277,277,0,0,1,70.4,9.22l-55.88,55.88A105.9,105.9,0,0,0,150.44,270.52L67.88,353.08A295.2,295.2,0,0,1,2.19,265.42Z"/></svg>
                        </div>


                        <div class="form-group">
                            <label for="confirm password">confirm password</label>
                            <input type="password" name="confirm password"  autocomplete="on" id="password2" placeholder="confirm password" required>

                        
                            <svg onclick="togglePass('password2')" id="Layer_1password2" data-name="Layer 1" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>eye-glyph</title><path d="M320,256a64,64,0,1,1-64-64A64.07,64.07,0,0,1,320,256Zm189.81,9.42C460.86,364.89,363.6,426.67,256,426.67S51.14,364.89,2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.14,147.11,148.4,85.33,256,85.33s204.86,61.78,253.81,161.25A21.33,21.33,0,0,1,509.81,265.42ZM362.67,256A106.67,106.67,0,1,0,256,362.67,106.79,106.79,0,0,0,362.67,256Z"/></svg>
                            <svg onclick="togglePass('password2')" hidden id="Layer_2password2" data-name="Layer 2" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>eye-disabled-glyph</title><path d="M409.84,132.33l95.91-95.91A21.33,21.33,0,1,0,475.58,6.25L6.25,475.58a21.33,21.33,0,1,0,30.17,30.17L140.77,401.4A275.84,275.84,0,0,0,256,426.67c107.6,0,204.85-61.78,253.81-161.25a21.33,21.33,0,0,0,0-18.83A291,291,0,0,0,409.84,132.33ZM256,362.67a105.78,105.78,0,0,1-58.7-17.8l31.21-31.21A63.29,63.29,0,0,0,256,320a64.07,64.07,0,0,0,64-64,63.28,63.28,0,0,0-6.34-27.49l31.21-31.21A106.45,106.45,0,0,1,256,362.67ZM2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.15,147.11,148.4,85.33,256,85.33a277,277,0,0,1,70.4,9.22l-55.88,55.88A105.9,105.9,0,0,0,150.44,270.52L67.88,353.08A295.2,295.2,0,0,1,2.19,265.42Z"/></svg>
                        </div>

                        <div id="errordiv" align="center" style="margin-left: auto; margin-right: auto;"> 
                            <span id="error" style="color: white; display: none"></span> 
                        </div>

                    </div>

                    <button id="registerbutton" class="register">register</button>

                <div class="social-iconss" style="color">
                    <p class="signup"><br/>already signed up?
                    <a href="javascript: history.go(-1)">back to login</a>
                    </p>
                </div>

                </form>

                
            </div>`,
    setup: setupRegisterPage,
    },
    "/forget_passwd": {
        html: `
            <div class="cart" id="forget-cart">
                <h2 class="title"> Forgot Password ?</h2>
                <form class="form" id="forget-form">
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="email" name="email" autocomplete="on" id="email" placeholder="">
                    </div>
                    <button id="submit">Submit</button>
                </form>
            </div>`,
        setup: setupForgetPasswordPage,
        },
    "/login_42" : {
        html: ``,
        setup: setupLogin42Page,
        },
    
    "/profile" : {
        html:`
                <!-- start edit -->
                <div class="container-edit" id="container-edit">
                    <div class="container-card-edit">
                        <div class="container-icone">
                            <div class="containerInputFile">
                                <img src="" class="avatars" id="img-update"/>
                                <input type="file" id="file-input" style="display: none;"/>
                                <label for="file-input" class="file-label"id="label-input" ></label>
                                <div class="container-flow"> 
                                    <i class="fa-solid fa-upload"></i>
                                </div>
                            </div>
                        </div>
                        <div class="container-card-edit-inputs">
                            <div class="container-each-input">
                                <input type="text" name="" id="usernameIdProfile" placeholder="Updtae your username" required>
                                <i class="fa-solid fa-user"></i>
                            </div>
                            <div class="container-each-input">
                                <input type="email" name="" id="emailIdProfile" placeholder="Updtae your email" required>
                                <i class="fa-solid fa-at"></i>
                            </div>
                            <div class="container-each-input">
                                <input type="password" name="" id="passwordIdProfile" placeholder="Updtae your password" required>
                                <i class="fa-solid fa-key"></i>
                            </div>
                            <div class="container-each-input">
                                <input type="password" name="" id="passwordIdProfileConfirme" placeholder="Confirme your username" required>
                                <i class="fa-solid fa-key"></i>
                            </div>
                            
                            <div class="container-each-input2" style="margin-bottom: 25px;">
                                <input  id="check-box" type="checkbox">
                                <label style="margin-left:20px">Enabel auth</label>
                            </div>
                            <div class="errorInput" id="container-error">
                                <p id="error-message" >Error in input</p>
                            </div>
                            <div class="container-save">
                                <button id="cancel">CANCEL</button>
                                <button id="save">SAVE</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            <!-- end edit -->
                <!-- start main -->
                <div class="container-main-home">
                    <div class="child-container-main-home">
                        <!-- start make the left side of main -->
                        <div class="left-side">
                            <div class="title"><p>Settings</p></div>
                            <div class="container-profile">
                                <div class="container-img"><img class="avatars" src="./images/avatar.png" alt=""></div>
                                <div class="container-name">
                                    <p  class="display-name" >Abdelkarim hajji</p>
                                    <p>settings</p>
                                </div>
                            </div>
                            <div class="container-friends-profiles">
                                <p>Friends</p>
                            </div>
                            <div class="list-friends-profile" id="list-friends-profile">
                                
                            </div>
                        </div>
                        <!-- finish make the left side of main -->

                        <!-- start make the midle of main -->
                        <div class="midle-side">
                            <div class="container-bg">
                                <div class="child-bg">
                                    <img class="avatars" src="./images/avatar.png" alt="karim">
                                </div>
                            </div>
                            <div class="container-update-info">
                                <div class="container-form">
                                    <div class="container-switch">
                                        <div class="profile"><p>Profile</p></div>
                                        <div class="security"><p>Security</p></div>
                                    </div>
                                    <div class="container-inputs" style="height:110px">
                                        <div class="container-input">
                                            <p>Username</p>
                                            <div class="group">
                                                <p id="userNameProfile"></p>
                                                <i class="fa-solid fa-user"></i>
                                            </div>
                                        </div>
                                        <div class="container-input">
                                            <p>Email</p>
                                            <div class="group">
                                                <p id="emailProfile"></p>
                                                <i class="fa-solid fa-user"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="container-email">
                                        <p>Password</p>
                                        <div class="group">
                                            <input type="text" disabled  value="************">
                                            <i class="fa-solid fa-at"></i>
                                        </div>
                                    </div>
                                    <div class="container-save">
                                        <button id="edit-profile">Edit profile</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- finish make the midle of main -->

                        <!-- start make the end of main -->
                        <div class="end-side">
                            <div class="container-profile-left">
                                <div class="child-container-profile-left">
                                    <div class="container-background-profile">
                                        <img src="./images/background.jpg" alt="">
                                        <img class="avatars" src="./images/avatar.png" alt="">
                                    </div>
                                    <div class="container-name-profile-left">
                                        <p  class="display-name">Abdelkarim hajji</p>
                                        <p>Not in your friends list</p>
                                    </div>
                                    <!--
                                    <div class="container-send-request">
                                        <div class="container-send"><i class="fa-solid fa-link"></i></i> <p>Chalange</p></div>
                                        <div class="container-block"><i class="fa-solid fa-user-slash"></i><p>Block</p></div>
                                    </div>
                                    -->
                                    <div class="container-history-friends">
                                        <div class="contaienr-history-profile"><p>History</p></div>
                                    </div>
                                    <div class="container-chalange" id="container-history-chalange">
                                       
                                        
                                    
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <!-- finish make the end of main -->
                    </div>
                </div>
                <!-- end main -->`,
        setup: setupProfilepage,
    },
    "/bridg" : {
        html :``,
        setup: handleRedirect,
    },
    "/chat" : {
        html : `
        <div class="container-main" id="container-main">
            <div id="chat-container">
            </div>
        </div>`, 
        setup: loadChatInterface,
    },
    "/eachprofile" : {
        html : `
        <!-- start edit -->
        <div class="container-edit" id="container-edit">
            <div class="container-card-edit">
                <div class="container-icone">
                    <i class="fa-solid fa-pen-to-square"></i>
                </div>
                <div class="container-card-edit-inputs">
                    <div class="container-each-input">
                        <input type="text" name="" id="usernameIdProfile" placeholder="Updtae your username" required>
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="container-each-input">
                        <input type="email" name="" id="emailIdProfile" placeholder="Updtae your email" required>
                        <i class="fa-solid fa-at"></i>
                    </div>
                    <div class="container-each-input">
                        <input type="password" name="" id="passwordIdProfile" placeholder="Updtae your password" required>
                        <i class="fa-solid fa-key"></i>
                    </div>
                    <div class="container-each-input" style="margin-bottom: 10px;">
                        <input type="password" name="" id="passwordIdProfileConfirme" placeholder="Confirme your username" required>
                        <i class="fa-solid fa-key"></i>
                    </div>
                    <div class="errorInput" id="container-error">
                        <p id="error-message" >Error in input</p>
                    </div>
                    <div class="container-save">
                        <button id="cancel">CANCEL</button>
                        <button id="save">SAVE</button>
                    </div>
                </div>
                
            </div>
        </div>
    <!-- end edit -->
        <!-- start main -->
        <div class="container-main-home">
            <div class="child-container-main-home">
                <!-- start make the left side of main -->
                <div class="left-side">
                    <div class="title"><p>Profile</p></div>
                    <div class="container-profile">
                        <div class="container-img"><img class="avatars" src="" alt="" id="imageEachProfile2"></div>
                        <div class="container-name">
                            <p  class="display-name" id="usernmaeEachProfile2"></p>
                            <p>settings</p>
                        </div>
                    </div>
                    <!--
                    <div class="container-friends-profiles">
                        <p>Friends</p>
                    </div>
                    -->
                    <div class="list-friends-profile">

                    </div>
                </div>
                <!-- finish make the left side of main -->

                <!-- start make the midle of main -->
                <div class="midle-side">
                    <div class="container-bg">
                        <div class="child-bg">
                            <img class="avatars" src=""  id="imageEachProfile">
                        </div>
                    </div>
                    <div class="container-update-info">
                        <div class="container-form">
                            <div class="container-switch">
                                <div class="profile"><p>Profile</p></div>
                               <div class="security" id="addFriendButton" ><p></p></div>    
                            </div>
                            <div class="container-inputs" style="height:110px">
                                <div class="container-input">
                                    <p>Username</p>
                                    <div class="group">
                                        <p id="usernmaeEachProfile"></p>
                                        <i class="fa-solid fa-user"></i>
                                    </div>
                                </div>
                                <div class="container-input">
                                    <p>Email</p>
                                    <div class="group">
                                        <p id="emailEachProfile"></p>
                                        <i class="fa-solid fa-user"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="container-email">
                                <p>Password</p>
                                <div class="group">
                                    <input type="text" disabled  value="************">
                                    <i class="fa-solid fa-at"></i>
                                </div>
                            </div>
                            <div class="container-save" style="display:none;">
                                <button id="edit-profile">Edit profile</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- finish make the midle of main -->

                <!-- start make the end of main -->
                <div class="end-side">
                    <div class="container-profile-left">
                        <div class="child-container-profile-left">
                            <div class="container-background-profile">
                                <img src="./images/background.jpg" alt="">
                                <img class="avatars" src="" id="imageEachProfile3" alt="">
                            </div>
                            <div class="container-name-profile-left">
                                <p  class="display-name" id="usernmaeEachProfile3"></p>
                                <p>Not in your friends list</p>
                            </div>
                            
                            <div class="container-history-friends">
                                <div class="contaienr-history-profile"><p>History</p></div>
                            </div>
                            <div class="container-chalange" id="listHistoryInEachProfile">
                                <div class="child-container-chalange">
                                    <div class="contaienr-chalange-img-left"><img src="./images/avatar.png" alt=""><p>1</p></div>
                                    <div class="container-VS">VS</div>
                                    <div class="contaienr-chalange-img-right"><p>1</p><img src="./images/avatar.png" alt=""> </div>
                                </div>
                                <div class="child-container-chalange">
                                    <div class="contaienr-chalange-img-left"><img src="./images/avatar.png" alt=""><p>1</p></div>
                                    <div class="container-VS">VS</div>
                                    <div class="contaienr-chalange-img-right"><p>1</p><img src="./images/avatar.png" alt=""> </div>
                                </div>
                            
                            </div>
                            
                        </div>
                    </div>
                </div>
                <!-- finish make the end of main -->
            </div>
        </div>
        <!-- end main -->
            `, 
    },
    "/game": {
        html: `
        <div class="container-main-home">
        <div id="chat-container">
        <div id="goma" class="game-container">
        </div>
        </div>
        </div>
        `,
        setup: gameMenu,
    },
    
   "/tournament" : {
        html : loadTournament(),
        setup:() => console.log(""),
    },
   "/OTP" : {
        html : `
            <div class="cart" id="otp-cart">
                <h1 class="title"> OTP</h1>
                <p id=otp-message> ${localStorage.getItem("message")}</p>
                <form class="form" id="forget-form">

                    <div class="otpuserInput">
                        <input class="otpinput" type="text" id='ist' maxlength="1" onkeyup="clickEvent(this,'sec')">
                        <input class="otpinput" type="text" id="sec" maxlength="1" onkeyup="clickEvent(this,'third')">
                        <input class="otpinput" type="text" id="third" maxlength="1" onkeyup="clickEvent(this,'fourth')">
                        <input class="otpinput" type="text" id="fourth" maxlength="1" onkeyup="clickEvent(this,'fifth')">
                        <input class="otpinput" type="text" id="fifth" maxlength="1" onkeyup="clickEvent(this,'sixth')">
                        <input class="otpinput" type="text" id="sixth" maxlength="1">
                    </div>

                <div id="errordiv" align="center" style="margin-left: auto; margin-right: auto;"> 
                    <span id="error" style="color: white; display: none"></span> 
                </div>

                </form>
            </div>`, 
        setup: handleOTPpage,
    },
    "/404": {
        html: `

            <div class="container-main-home">
                <div id="chat-container">
                <div id="not_found">
                    <h1>404: Page Not Found</h1>
                    <br>
                    <h5>The page you're looking for doesn't exist.</h4>
                </div>
                </div>
            </div>
`,
    },
   
};

function isOnlyDigits(str) {
    return /^\d+$/.test(str);
}

function CleanOTPInput()
{
    const otp = [
        document.getElementById('ist'),
        document.getElementById('sec'),
        document.getElementById('third'),
        document.getElementById('fourth'),
        document.getElementById('fifth'),
        document.getElementById('sixth')
    ];

    otp.forEach(input => {
                input.value = ""; 
    });
    document.getElementById('ist').focus();
}


async function OTPauth(value)
{
    const password = localStorage.getItem("password");
    const UserData = 
    {
        username : localStorage.getItem("username"),
        password : password,
        otp: value
    };       

    try
    {
        const response = await fetch(`/api/token/`, 
        {
            method : "POST", 
            headers: {
                "Content-Type" : "application/json",
            }, 
            body : JSON.stringify(UserData),
        });

        const data = await response.json();
        if(!response.ok)
        {
            CleanOTPInput();
            showError(data.error);

            if (response.status === 410) 
            {
                setTimeout(() => {
                    history.pushState({}, "", "/");
                    handleLocation();
                }, 3000);
            }
        }
        else
        {
            localStorage.setItem("refreshToken", data.refresh);
            localStorage.setItem("accessToken", data.access);

            const info = await SecureApiRequest(`/api/get/${localStorage.getItem("username")}/`);


            if (info.photo) 
            {
                let photo = info.photo;
                    
                if(!isValidUrl(photo))
                {
                    photo = `http://127.0.0.1:8000${photo}`;
                    localStorage.setItem("photo", photo);
                }
                else
                {
                    localStorage.setItem("photo", photo);
                }
            }

            // localStorage.setItem("photo", info.photo);
            localStorage.setItem("email", info.email);

            history.pushState({}, "", "/profile"); 
            localStorage.removeItem("password");
            handleLocation();
        }
    }
    catch (error)
    {
        alert("An error occurred. Please try again.");
    }
}


async function handleOTPpage() 
{
    document.getElementById('otp-message').innerText = localStorage.getItem('message');
    document.getElementById('ist').focus();

    document.getElementById('sixth').addEventListener('input', function() {

        const otp = [
            document.getElementById('ist'),
            document.getElementById('sec'),
            document.getElementById('third'),
            document.getElementById('fourth'),
            document.getElementById('fifth'),
            document.getElementById('sixth')
        ];

        const otpValues = otp.map(input => input.value);
        const otpString = otpValues.join('');

        if (!isOnlyDigits(otpString)) 
        {
            showError("OTP must contain only digits.");
            CleanOTPInput();
        } 
        else 
        {
            showError("Sending OTP...");
            OTPauth(otpString);
        }

    });
}

async function getUserData(username)
{
    try
    {
        const response = await fetch(`/api/get/${username}/`);

        if(!response.ok)
        {
            console.error(`2FA : couldnt fetch userdata: ${response.status} - ${response.statusText}`);
            return null;
        }
        else
        {
            const data = await response.json();
            return data;
        }
    }
    catch (error)
    {
        console.error('error fetching user info');
        return null;
    }
}

export function populateProfile() 
{
    //("hola.............");
    const photo = localStorage.getItem("photo");
    const username = localStorage.getItem("username");
    // //("see this photo ==> ", photo);
    // const email = localStorage.getItem("email");

    const avatar = document.getElementsByClassName("avatars");
    let i = 0;

    if(avatar)
    {
        while(i < avatar.length)
        {   
            avatar[i].src = photo;
            i++;
        }
    }

    const displayName = document.querySelectorAll(".display-name");
    if(displayName)
    {
        displayName.forEach(displayName => {
            displayName.innerText = username;
        });
    }

    const navbarphoto = document.getElementsByClassName("user-img");
    if (navbarphoto.length > 0) 
        navbarphoto[0].src = localStorage.getItem("photo");

    const navbarname = document.getElementById("user-username");
    if (navbarname) 
    {
        //("hola")
        navbarname.innerHTML = localStorage.getItem("username");
    }

    const email = document.getElementById("user-email");
    if (email) 
        email.innerHTML = localStorage.getItem("email");

    const emailProfile = document.getElementById("emailProfile");
    if (emailProfile) 
        emailProfile.innerHTML = localStorage.getItem("email");

    const userNameProfile = document.getElementById("userNameProfile");
    if (userNameProfile) 
        userNameProfile.innerHTML = localStorage.getItem("username");
}



export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}


async function setupLoginPage() 
{
    // logout();
    // //("login page");
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (event) => 
    {
        event.preventDefault();
        const UserData = 
        {
            username : SanitizeInpute(document.getElementById("username").value),
            password : SanitizeInpute(document.getElementById("password").value),
        };
        try
        {
            const response = await fetch("/api/token/", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(UserData),
            });

            const data = await response.json();

            if(!response.ok)
                showError("invalid username or passsword");
            else
            {
                localStorage.setItem("message", data.message)
                localStorage.setItem("username", UserData.username);
                localStorage.setItem("password", UserData.password);

                //("message: ", data.message);
                const userinfo = await getUserData(UserData.username); 
                if(!userinfo)
                    console.error("An error accurred whene fetching userdata (photo)");

                if(data.access)
                {
                    alert("login successful");
                    localStorage.removeItem("password");

                    localStorage.setItem("accessToken", data.access);
                    localStorage.setItem("refreshToken", data.refresh);
                    localStorage.setItem("email", userinfo.email);

                    //("photo: ", userinfo.photo);

                    if (userinfo.photo) 
                    {
                        let photo = userinfo.photo;
                        //("photo: ", photo);
                            
                        if(!isValidUrl(photo))
                        {
                            //("hello url is path:", isValidUrl(photo));
                            photo = `http://127.0.0.1:8000${photo}`;
                            localStorage.setItem("photo", photo);
                        }
                        else
                        {
                            //("is url")
                            localStorage.setItem("photo", photo);
                        }
                    }

                    history.pushState({}, "", "/profile"); 
                    handleLocation();
                }
                else
                {
                    history.pushState({}, "", "/OTP"); 
                    handleLocation();
                }
            }
        }
        catch (error)
        {
            console.error("error login", error);
            alert("An error occurred. Please try again.", error);
        }
    });
}

async function setupRegisterPage() 
{
    //("register page");
    const form = document.getElementById("register-form");
    form.addEventListener("submit", async (event) => 
    {
        event.preventDefault(); 
        const UserData = 
        {
            username: SanitizeInpute(document.getElementById("username").value),
            email: SanitizeInpute(document.getElementById("email").value),
            password: SanitizeInpute(document.getElementById("password").value),
            password2: SanitizeInpute(document.getElementById("password2").value),
        };

        var message = validatePassword(UserData.password, UserData.password2, UserData.email);
        if(message !== null)
        {
            showError(message);
            return;
        }
        try 
        {
            const response = await fetch("/api/register/", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(UserData),
            });


            const data = await response.json();
            if (response.ok)
            {
            
                alert("User registered successfully!");
                //("Registration successful");
                history.pushState({}, "", "/");
                handleLocation();
            }
            else
            {
                let errormessage = "";
                for (const key in data) 
                    if (data[key]) 
                        errormessage += `${key}: ${data[key].join(", ")} `;
                console.log("eror: ", errormessage);
                // errorMessage += "\n\n";
                // button = document.getElementById("registerbutton"); 
                //
                //
                // button.style.display =  "none";
                showError(errormessage);
                // button.style.display = "Block";
            }
        } 
        catch (error) 
        {
            alert("An error occurred. Please try again.");
        }
    });
}

function setupForgetPasswordPage()
{

}

async function setupLogin42Page() 
{
    try 
    {
        const response = await fetch('/api/auth/login/', {
        });

        if (!response.ok) 
            throw new Error('OAuth2 initiation failed + ' + response.status);

        const data = await response.json();

        if (data.redirectUrl) 
        {
            window.location.href = data.redirectUrl;  // Redirect to OAuth2 authorization page
        }
    } 
    catch (error) 
    {
        console.error('Error initiating OAuth2:', error);
        alert('An error occurred while initiating OAuth2. Please try again later.');
    }
}


function decodeImage(photo)
{

    const tempElement = document.createElement('textarea');
    tempElement.innerHTML = photo;

    // Decode the string
    const decodedPhoto = tempElement.value;
    return decodedPhoto;
}

function handleRedirect() 
{
    //("bridg====================");
    const access_token = getCookie('access_token');
    deleteCookie("access_token");

    const refresh_token = getCookie('refresh_token');
    deleteCookie("refresh_token");

    const username = getCookie('username')
    deleteCookie('username');

    const photo = getCookie('photo')
    deleteCookie('photo');

    const image = photo ? photo.replace(/^"(.*)"$/, '$1') : null; 

    const email = getCookie('email');
    deleteCookie('email');

    const mail = email ? email.replace(/^"(.*)"$/, '$1') : null; 

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("email", mail);
    localStorage.setItem("username", username);
    localStorage.setItem("photo", image);
    
    // console
    history.pushState({}, "", "/profile");
    handleLocation();
}

async function setupProfilepage()
{

    // let data = await SecureApiRequest(`api/update/profile/`, "PATCH", '{"username":"hello"}');
    // if(!data)
    // {
    //     GoLogin();
    //     return;
    // }

    // const body = {"username":"hello", "email":"helloword@gmaill.com", "photo":"https://cdn.adf.org.au/media/images/LSD-social.2e16d0ba.fill-1200x1200.jpg"};
    //
    // const UserData = 
    // {
    //     username: "hello",
    //     email: "hello@gmail.com",
    //     photo: "./images/try.jpg"
    // }
    //
    // try
    // {
    //     const info = await SecureApiRequest("/api/update/profile/","PATCH", body);
    //     //("info: ", info);
    //
    //
    //
    //
    //
    // }
    // catch (error)
    // {
    //     //("response:  ", error);
    // }
}

