console.log("input handler loaded");

let KeyWDown = false;
let KeyADown = false;
let KeySDown = false;
let KeyDDown = false;


window.addEventListener("keydown", function(e){
    console.log(document.getElementById('playerImg').src)
    if (e.code == "KeyW") { player.vyu = -player.speed; KeyWDown = true};
    if (e.code == "KeyA") { player.vxl = -player.speed; KeyADown = true};
    if (e.code == "KeyS") { player.vyd = -player.speed; KeySDown = true};
    if (e.code == "KeyD") { player.vxr = -player.speed; KeyDDown = true};
});

window.addEventListener("keyup", function(e){
    if (e.code == "KeyW") { player.vyu = 0; KeyWDown = false; document.getElementById('playerImg').src = 'spritesheet/player_walking_backward.gif'};
    if (e.code == "KeyA") { player.vxl = 0; KeyADown = false; document.getElementById('playerImg').src = 'spritesheet/player_walking_left_NEO_Drone.gif'};
    if (e.code == "KeyS") { player.vyd = 0; KeySDown = false; document.getElementById('playerImg').src = 'spritesheet/player_walking_forward.gif'};
    if (e.code == "KeyD") { player.vxr = 0; KeyDDown = false; document.getElementById('playerImg').src = 'spritesheet/player_walking_right_NEO_Drone.gif'};
});
