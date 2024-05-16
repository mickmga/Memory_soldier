window.onload = function () {
    console.log("let's go, you are ready to start building");
};
let launched = false;


document.addEventListener("keydown", function (event) {
    
    if (event.key === 'd' && launched === false) {
        cameraMovement();
    }
});


const cameraMovement = () => {

  launched = true;

  const gameContainer = document.getElementById("gameContainer");

  const gameContainerLeft = gameContainer.offsetLeft;

  gameContainer.style.left = `${gameContainerLeft-3}px`;

  requestAnimationFrame(cameraMovement);

}