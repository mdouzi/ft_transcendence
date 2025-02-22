

export function loadTournament()
{
    return(`
    
    <div class="containeStartGame"><button id="continueButton">Continue</button></div>
    <div class="containerCount"><div class="sircleCount"><p class="countPlace"></p></div></div>
    <div class="parent-container-join-tournament">
    <div class="container-box">
        <div class="container-icon"><i class="fa-solid fa-circle-xmark" id="close-tournament"></i></div>
        <div class="container-title"><p>Join to The Tournament</p></div>
        <div class="container-desc"><p>Chose 3 of your firends: </p></div>
        <div class="container-friends">
            
        </div>
        <div class="container-start"><button id="startTournament">START</button></div>
        <div class="container-start"><button id="backToProfile">Profile</button></div>
    </div>
    </div>
    <!-- start main -->
    <div class="container-main-home2"> </div>
    <div class="container-main-home">
        <div class="child-container-main-home">
            <!-- start make the left side of main -->
            <div class="left-side">
                <div class="titles">
                    <p style="text-align:center;">History Matches</p>
                    <p>All matches players</p>
                </div>
                <div class="container-best-players" id="container-best-players">
                    
                </div>
            </div>
            <!-- finish make the left side of main -->

            <!-- start main the midle side -->
            <div class="midle-side">
                <div class="top">
                    <div class="first-halef">
                        <i class="fa-solid fa-arrow-left"></i>
                        <p>Pinger's Room</p>
                    </div>
                    <div class="second-halef">
                        <button id="join-tournament">Join tournament</button>
                    </div>
                </div>
                <div class="midle">
                    <div class="container-midle">
                        <svg width="90%" height="100%" viewBox="0 0 3768 834"  fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect x="1" y="23" width="694" height="178" rx="89" fill="#D9D9D9" fill-opacity="0.55" stroke="white" stroke-width="2"/>
                            <rect x="1" y="633" width="694" height="178" rx="89" fill="#D9D9D9" fill-opacity="0.55" stroke="white" stroke-width="2"/>
                            <rect x="697" y="328" width="694" height="178" rx="89" fill="#D9D9D9" fill-opacity="0.55" stroke="white" stroke-width="2"/>
                            <rect opacity="0.55" x="1537.5" y="1.5" width="693" height="831" rx="106.5" fill="#66103E" stroke="white" stroke-width="3"/>
                            <rect x="-1" y="1" width="694" height="178" rx="89" transform="matrix(-1 0 0 1 3766 22)" fill="#D9D9D9" fill-opacity="0.55" stroke="white" stroke-width="2"/>
                            <rect x="-1" y="1" width="694" height="178" rx="89" transform="matrix(-1 0 0 1 3766 632)" fill="#D9D9D9" fill-opacity="0.55" stroke="white" stroke-width="2"/>
                            <rect x="-1" y="1" width="694" height="178" rx="89" transform="matrix(-1 0 0 1 3070 327)" fill="#D9D9D9" fill-opacity="0.55" stroke="white" stroke-width="2"/>
                            <path d="M1056 327V194C1056 150.37 1020.63 115 977 115H696" stroke="white" stroke-opacity="0.55" stroke-width="4"/>
                            <path d="M2712 327V194C2712 150.37 2747.37 115 2791 115H3072" stroke="white" stroke-opacity="0.55" stroke-width="4"/>
                            <path d="M1056 507V640C1056 683.63 1020.63 719 977 719H696" stroke="white" stroke-opacity="0.55" stroke-width="4"/>
                            <path d="M2712 507V640C2712 683.63 2747.37 719 2791 719H3072" stroke="white" stroke-opacity="0.55" stroke-width="4"/>
                            <path d="M1392 417H1536" stroke="white" stroke-opacity="0.55" stroke-width="4"/>
                            <path d="M2232 417H2376" stroke="white" stroke-opacity="0.55" stroke-width="4"/>
                            
                            <mask id="rounded-mask">
                                <rect x="30" y="40" width="150" height="150" rx="50%" ry="50%" fill="white"/>
                            </mask>
                            <image  class="imagePlayer" xlink:href="./images/avatar.png" x="30" y="40" width="150" height="150" mask="url(#rounded-mask)" />
                            <text x="220" class="namePlayer" y="130" font-family="Arial" font-size="50" fill="white">none</text>

                            <mask id="rounded-mask2">
                                <rect x="30" y="650" width="150" height="150" rx="50%" ry="50%" fill="white"/>
                            </mask>
                            <image  class="imagePlayer" xlink:href="./images/avatar.png" x="30" y="650" width="150" height="150" mask="url(#rounded-mask2)" />
                            <text x="220" class="namePlayer" y="740" font-family="Arial" font-size="50" fill="white">none</text>
                            <mask id="rounded-mask3">
                                <rect x="730" y="345" width="150" height="150" rx="50%" ry="50%" fill="white"/>
                            </mask>
                            <image  class="imagePlayer" xlink:href="./images/avatar.png" x="730" y="345" width="150" height="150" mask="url(#rounded-mask3)" />
                            <text x="920" class="namePlayer" y="435" font-family="Arial" font-size="50" fill="white">none</text>
                            <mask id="rounded-mask4">
                                <rect x="1690" y="70" width="400" height="400" rx="50%" ry="50%" fill="white"/>
                            </mask>
                            <image  class="imagePlayer" xlink:href="./images/avatar.png" x="1690" y="70" width="400" height="400" mask="url(#rounded-mask4)" />
                            <text x="1750"class="namePlayer" y="585" font-family="Arial" font-size="60" fill="white">none</text>

                            <mask id="rounded-mask5">
                                <rect x="2400" y="345" width="150" height="150" rx="50%" ry="50%" fill="white"/>
                            </mask>
                            <image  class="imagePlayer" xlink:href="./images/avatar.png" x="2400" y="345" width="150" height="150" mask="url(#rounded-mask5)" />
                            <text x="3295" class="namePlayer" y="130" font-family="Arial" font-size="50" fill="white">none</text>

                            <mask id="rounded-mask6">
                                <rect x="3100" y="650" width="150" height="150" rx="50%" ry="50%" fill="white"/>
                            </mask>
                            <image  class="imagePlayer" xlink:href="./images/avatar.png" x="3100" y="650" width="150" height="150" mask="url(#rounded-mask6)" />
                            <text x="3295" class="namePlayer" y="745" font-family="Arial" font-size="50" fill="white">none</text>
                            <mask id="rounded-mask7">
                                <rect x="3100" y="40" width="150" height="150" rx="50%" ry="50%" fill="white"/>
                            </mask>
                            <image  class="imagePlayer" xlink:href="./images/avatar.png" x="3100" y="40" width="150" height="150" mask="url(#rounded-mask7)" />
                            <text x="2590"class="namePlayer" y="435" font-family="Arial" font-size="50" fill="white">none</text>
                            <defs>
                            <pattern id="pattern0_677_886" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image0_677_886" transform="scale(0.00133333)"/>
                            </pattern>
                            <pattern id="pattern1_677_886" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image1_677_886" transform="scale(0.00133333)"/>
                            </pattern>
                            <pattern id="pattern2_677_886" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image2_677_886" transform="scale(0.00133333)"/>
                            </pattern>
                            <pattern id="pattern3_677_886" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image3_677_886" transform="scale(0.00133333)"/>
                            </pattern>
                            <pattern id="pattern4_677_886" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image3_677_886" transform="scale(0.00133333)"/>
                            </pattern>
                            <pattern id="pattern5_677_886" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image2_677_886" transform="scale(0.00133333)"/>
                            </pattern>
                            <pattern id="pattern6_677_886" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image2_677_886" transform="scale(0.00133333)"/>
                            </pattern>
                            
                            </defs>
                            </svg>
                    </div>
                </div>
                <div class="bottom">
                    <div class="container-bottom">
                        <div class="container-title"><p>Match details</p></div>
                        <div class="container-details">
                            <div class="first-side" id="ScoreGame1">
                                
                            </div>
                            
                            <div class="second-halef" id="ScoreGame2">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- finish main the midle side -->
        </div>
    </div>

    <!-- end main -->
    `)
}