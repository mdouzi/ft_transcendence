

import {showError} from './utils.js';
import {SecureApiRequest} from './api.js';
import {isValidUrl, populateProfile} from './routes.js';
import { handleLocation } from './app.js';




// let btn = document.querySelector('#btn');
let  output = document.getElementById("container-outputs");
export let inputSearch = document.getElementById('input_search');

export function initRenderAllEvents()
{

    output = document.getElementById("container-outputs");
    inputSearch = document.getElementById('input_search');

}


export function renderAll() 
{
    //("render all ok bro ");
    if (inputSearch) 
    {
        let  notFound = document.getElementById("not-found");
        let  nameSearch = document.getElementById("name-search");
        let  imgSearch = document.getElementById("img-search");
        let  buttonFriend = document.getElementById("button-friend");
        let  buttonFriend2 = document.getElementById("button-friend2");
        let usernameIdProfile = document.getElementById("usernameIdProfile");
        let emailIdProfile = document.getElementById("emailIdProfile");
        let passwordIdProfile = document.getElementById("passwordIdProfile");
        let passwordIdProfileConfirme = document.getElementById("passwordIdProfileConfirme");
        let checkBox = document.getElementById("check-box");

        let errorMessage = document.getElementById("error-message");
        let validForm = 0;
        let validPassword = 0;


        let  userNameFriend = document.getElementById("userNameProfile")
        if(userNameFriend)
            userNameFriend.innerHTML = localStorage.getItem("username");

        let  emailProfile = document.getElementById("emailProfile");
        if(emailProfile)
            emailProfile.innerHTML = localStorage.getItem("email");

        let cancel = document.getElementById("cancel");

        let save = document.getElementById("save");
        let containerEdit = document.getElementById("container-edit");
        let editProfile = document.getElementById("edit-profile");
        let containerError = document.getElementById("container-error")



        let containerHistoryChalange = document.getElementById("container-history-chalange");
        if(containerHistoryChalange)
        {
            const users = JSON.parse(localStorage.getItem("users"))
            if (users && users.length > 0) {
                let index = 0;
                containerHistoryChalange.innerHTML  = ``
                // Using a while loop to iterate over the array
                
                while (index < users.length) {
                    const user = users[index];
                    if(user.namePlayer1 == localStorage.getItem("username") || user.namePlayer2 == localStorage.getItem("username"))
                    {
                        containerHistoryChalange.innerHTML += `
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

        if(cancel)
        {
            // editProfile
            cancel.addEventListener("click", function() {
                containerEdit.style.display = "none";
                containerError.style.display = "none"
                validForm = 0;
                validPassword = 0;
                usernameIdProfile.value = ""
                emailIdProfile.value = ""
                passwordIdProfile.value = ""
                passwordIdProfileConfirme.value = ""
                });

                editProfile.addEventListener("click", function() {
                containerEdit.style.display = "flex";
                const photo = localStorage.getItem("photo");
                const username = localStorage.getItem("username");
                // const email = localStorage.getItem("email");

                const avatar = document.getElementsByClassName("avatars");
                let i = 0;
                while(i < avatar.length)
                {   
                    avatar[i].src = photo;
                    i++;
                }
                fetch(`/api/get/${localStorage.getItem("username")}/`)
                .then(response => response.json())
                .then(data => {
                    //("get item ===> ", data)
                    if(data.is_2fa_enabled == true)
                        checkBox.checked = true
                    else
                        checkBox.checked = false
                        usernameIdProfile.value = "";//data.username;
                        emailIdProfile.value = "";//data.email;

                    //("i am here in data");
                })
                .catch(error => {

                });
            });
        }

        fetch(`/api/get/${localStorage.getItem("username")}/`)
        .then(response => response.json())
        .then(data => {
            if(data.id > 100)
                editProfile.style.display = "none"
            //("i am here in data");
        })
        .catch(error => {

        });


        let fileInput = document.getElementById("file-input");
        let labelInput = document.getElementById("label-input");
        let imgUpdate = document.getElementById("img-update");
        let send_image = "";//localStorage.getItem("photo");

        let file = null;
        if(fileInput)
        {
            fileInput.addEventListener("change", function(event) {
                file = event.target.files[0];
                if (file) 
                {
                    imgUpdate.src = URL.createObjectURL(file); // Efficient file preview
                }
            });
        }
        if(save)
        {
            save.addEventListener("click", function() 
            {

                    function updateLocalstorage(UserData) 
                    {
                        //("username", UserData.data.username);
                        //("email", UserData.data.email);
                        //("photo", UserData.data.photo);

                        if (UserData.data.username) localStorage.setItem('username', UserData.data.username);
                        if (UserData.data.email) localStorage.setItem('email', UserData.data.email);
                        // const path = "http://127.0.0.1:8000" + UserData.data.photo;
                        if (UserData.data.photo) localStorage.setItem('photo', "http://127.0.0.1:8000" + UserData.data.photo);
                    }
                    async function sendRequestUpdateProfile() {
                        //("hi mister karim")
                        let stateCheck;
                        if(checkBox.checked)
                            stateCheck = true;
                        else
                            stateCheck = false;
                        //(`{"username":"${usernameIdProfile.value}", "email":"${emailIdProfile.value}", "password":"${passwordIdProfile.value}", "repeat_password": "${passwordIdProfileConfirme.value}", "photo":"${send_image}", "is_2fa_enabled":"${stateCheck}"}`)

                        const username = usernameIdProfile.value;
                        const email = emailIdProfile.value;
                        const password = passwordIdProfile.value;
                        const repeat_password = passwordIdProfileConfirme.value;
                        const is_2fa_enabled = stateCheck;
                        let photo = send_image; 


                    const formData = new FormData();

                    if (username) formData.append("username", username);
                    if (email) formData.append("email", email);
                    if (password) formData.append("password", password);
                    if (repeat_password) formData.append("repeat_password", repeat_password);
                    formData.append("is_2fa_enabled", is_2fa_enabled);
                    if (file) formData.append("photo", file);

                    const UserData = {};

                    //("photo:", photo);
                    //("UserData=================: ", formData);

                    const is_upload = !!file;

                    let body;

                    if(is_upload)
                        body = formData;
                    else
                    {
                        if (username) UserData.username = username;
                        if (email) UserData.email = email;
                        if (password) UserData.password = password;
                        if (repeat_password) UserData.repeat_password = repeat_password;
                        UserData.is_2fa_enabled = is_2fa_enabled;
                        body = UserData;
                    }

                    if (!is_upload && Object.entries(UserData).length === 0) 
                        body = null;
                    //("uplaod::::::::: ", is_upload);
                    //("body::::::::: ", body);

                    const info = await SecureApiRequest("/api/update/profile/","PATCH", body, is_upload);
                    if (info && !info.error) 
                    {
                        //("localStorage updateeeeeed", info);

                        updateLocalstorage(info);

                        containerError.style.display = "block"
                        showError("Profile updated successfully", "error-message");
                        populateProfile();
                        
                        
                    }
                    else
                    {

                        const data = info.error;
                        let errormessage = "";
                        for (const key in data) 
                            if (data[key]) 
                                errormessage += `${data[key]}`; 
                                    
                        containerError.style.display = "block"
                        showError(errormessage, "error-message");

                    }
                    photo = "";
            }
                    sendRequestUpdateProfile();
                    // containerError.style.display = "none"
                    // containerEdit.style.display = "none";
                    validForm = 0;
                    validPassword = 0;
                    usernameIdProfile.value = ""
                    emailIdProfile.value = ""
                    passwordIdProfile.value = ""
                    passwordIdProfileConfirme.value = ""
                    // stateCheck = None;
                // }

                });
        }


        if(inputSearch.value.length <= 0)
            output.style.display = "none";

        let  nameNotification = document.getElementById("nameNotification")
        nameNotification.innerHTML = localStorage.getItem("username");
        inputSearch.addEventListener('input', (event) => {
        //
        // async function delayedExecution() {
        //     //("Waiting for 2 seconds...");
        //     await sleep(500);
        //     //("This message is delayed by 2 seconds");
        //     // Add your code here
        // }

            const username = event.target.value;  
            let valid = 0;

            if (username.trim()) 
            {
                fetch(`/api/get/${username}/`)
                    .then(response => response.json())
                    .then(data => {
                        // //('Response from server:', data);
                        if(data.error == "User not found")
                        {
                            nameSearch.innerHTML = "User not found";
                            imgSearch.src = "./images/notFound.png";
                            buttonFriend.style.display = "none"
                            buttonFriend2.style.display = "flex"
                        }
                        else if(data.username != localStorage.getItem("username"))
                        {
                            nameSearch.innerHTML = data.username;

                            let photo = data.photo;
                                
                            if(!isValidUrl(photo))
                                photo = `http://127.0.0.1:8000${photo}`;

                            imgSearch.src = photo;
                            buttonFriend.style.display = "flex"
                            buttonFriend2.style.display = "none"
                            localStorage.setItem('eachProfileUserName', data.username);
                            localStorage.setItem('eachProfileUserId', data.id);
                            //("see this data===> ",data);


                        }
                        //("i am here in data");
                    })
                    .catch(error => {
                        // console.error('Error fetching data:', error);
                        // nameSearch.innerHTML = "NotFound";
                        // //("i am there error data");
                    });
            }

            buttonFriend.addEventListener("click", function() {
                inputSearch.value = "";

                // handleLocation("/eachprofile")
            });
            if(event.target.value.length > 0)
                output.style.display = "flex"
            else if(event.target.value <= 0)
                output.style.display = "none";

        });
    } 
    else 
    {
        console.error("Element with ID 'input-search' not found.");
    }


    async function fetchDataFriends() 
    {
        const info = await SecureApiRequest("/api/friend/get_friends/");
        if(!info)
            return;
        let friendsContainer = document.getElementById("list-friends-profile");

        if(friendsContainer)
        {


        friendsContainer.innerHTML = '';

        // //("this all my friends => ", info.friends)
        // //("this all my friends => ", info.friends.length)
        if(info.friends.length > 0)
        {
            // if(friendsContainer)
            // {

                var i = 0;
                while(i < info.friends.length)
                {
                    let photo = info.friends[i].photo;
                    if(!isValidUrl(photo))
                        photo = `http://127.0.0.1:8000${photo}`;

                    friendsContainer.innerHTML += `
                    <div class="container-setting">
                        <div class="container-img"><img style="border-radius: 50%;" src="${photo}" ></div>
                        <div class="container-name">
                            <p class="display-name">${info.friends[i].username}</p>
                            <!-- <p>${info.friends[i].username}</p> -->
                        </div>
                    </div>`
                    i++;
                }
            // }
        }
        else
        {
            if(friendsContainer)
            {
                friendsContainer.innerHTML = `
                <div class="container-setting" style="justify-content: center; align-items: center;">
                    <p>No friends</p>
                </div>`
            }

        }

    }
    }
    fetchDataFriends();


    // each profile 

    let usernameEachProfile = document.getElementById("usernmaeEachProfile");
    let usernameEachProfile2 = document.getElementById("usernmaeEachProfile2");
    let usernameEachProfile3 = document.getElementById("usernmaeEachProfile3");
    let emailEachProfile = document.getElementById('emailEachProfile');
    let imageEachProfile = document.getElementById("imageEachProfile");
    let imageEachProfile2 = document.getElementById("imageEachProfile2");
    let imageEachProfile3 = document.getElementById("imageEachProfile3");

    const eachProfileUserName = localStorage.getItem("eachProfileUserName");
    if(eachProfileUserName)
    {
        fetch(`/api/get/${eachProfileUserName}/`)
        .then(response => response.json())
        .then(data => {
            //("i am her i will ")
            //('Response from server karim ok ::::', data);
            if(data.error == "User not found")
            {

            }
            else{
                if(usernameEachProfile)
                {
                    let photo = data.photo;
                        
                    if(!isValidUrl(photo))
                    {
                        //("hello url is path:", isValidUrl(photo));
                        photo = `http://127.0.0.1:8000${photo}`;
                    }

                    usernameEachProfile.innerHTML = data.username;
                    usernameEachProfile2.innerHTML = data.username;
                    usernameEachProfile3.innerHTML = data.username;
                    emailEachProfile.innerHTML = data.email;
                    imageEachProfile.src = photo;
                    imageEachProfile2.src = photo;
                    imageEachProfile3.src = photo;
                }
            }


        });
    }

let addFriendButton = document.getElementById("addFriendButton");
async function returnDataFriendsResquest()
{
    const info = await SecureApiRequest("/api/friend/list_sent_requests/", "GET");
    return info;
}
async function checkButtonAddFriend() 
{
    if(addFriendButton)
    {
        const info = await SecureApiRequest("/api/friend/get_friends/");
        const info2 = await SecureApiRequest("/api/friend/list_sent_requests/", "GET");

        let i = 0;
        let valid = 0;
        //("nchofo info ====> ",info.friends, localStorage.getItem("eachProfileUserName"))
        while(i < info.friends.length)
        {
            //("comp ==> ",info.friends[i].username)
            if(info.friends[i].username == localStorage.getItem("eachProfileUserName"))
                valid = 1;
            i++;
        }
        i = 0;
        while(i < info2.sent_requests.length)
        {
            if(info2.sent_requests[i].to_user == localStorage.getItem("eachProfileUserId"))
                valid = 2;
            i++;
        }
        if(valid == 2)
            addFriendButton.innerHTML = "Panding";
        else if(valid == 1)
            addFriendButton.innerHTML = "Message";
        else if(valid == 0)
            addFriendButton.innerHTML = "Add Friend +";
    }

}
checkButtonAddFriend()



async function sendFriend()
{
    const info = await SecureApiRequest("/api/friend/add/", "POST", `{"to_user": "${localStorage.getItem("eachProfileUserId")}"}`);
    // if(!info)
    //     return;
    //("info ==========> ",info, localStorage.getItem("eachProfileUserId"))

    // localStorage.setItem('eachProfileUserName', data.username);

}

if(addFriendButton)
{
    addFriendButton.addEventListener("click", function(event) {
        if(addFriendButton.innerHTML == "Add Friend +")
        {
            sendFriend();
            checkButtonAddFriend()
        }
        else if(addFriendButton.innerHTML == "Message")
        {
            // alert("1")
            localStorage.setItem("openChat",localStorage.getItem("eachProfileUserName"));
            history.pushState({}, "", '/chat'); 

            handleLocation();
        }
    });
}



























    // let addFriendButton = document.getElementById("addFriendButton");
    // async function checkButtonAddFriend() 
    // {
    //
    //
    //     if(addFriendButton)
    //     {
    //         const info = await SecureApiRequest("/api/friend/get_friends/");
    //         // if(!info)
    //         //     return;
    //
    //         //("i am inside checkButtonAddFriend ok bro", info)
    //         let i = 0;
    //         let valid = 0;
    //         while(i < info.friends.length)
    //         {
    //             if(info.friends[i].unsername == localStorage.getItem("username"))
    //                 valid = 1;
    //             i++;
    //         }
    //         if(valid == 1)
    //             addFriendButton.innerHTML = "Message"
    //         else
    //             addFriendButton.innerHTML = "Add Friend +"
    //     }
    //
    // }
    // checkButtonAddFriend()
    //
    //
    //
    // async function sendFriend()
    // {
    //     const info = await SecureApiRequest("/api/friend/add/", "POST", `{"to_user": "${localStorage.getItem("eachProfileUserId")}"}`);
    //     // if(!info)
    //     //     return;
    //     //("info ==========> ",info, localStorage.getItem("eachProfileUserId"))
    //
    //     // localStorage.setItem('eachProfileUserName', data.username);
    //
    // }
    //
    // if(addFriendButton)
    // {
    //     addFriendButton.addEventListener("click", function(event) {
    //         if(addFriendButton.innerHTML == "Add Friend +")
    //         {
    //             sendFriend();
    //         }
    //     });
    // }

}

