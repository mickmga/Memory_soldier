window.onload = function () {
    console.log("let's go, you are ready to start building");
};
let launched = false;


document.addEventListener("keydown", function (event) {
    
    if (event.key === 'd' && launched === false) {
        cameraMovement();
        animateCharacter();
    }
});


const cameraMovement = () => {

  launched = true;

  const gameContainer = document.getElementById("gameContainer");

  const gameContainerLeft = gameContainer.offsetLeft;

  gameContainer.style.left = `${gameContainerLeft-3}px`;

  requestAnimationFrame(cameraMovement);


}


let animateCharacterCount = 0;

let currentHeroImgSuffix = 0;

let heroImg = document.getElementById('heroImg');


const animateCharacter = () => {
    if (animateCharacterCount < 3) {
      animateCharacterCount++;
      requestAnimationFrame(animateCharacter);
      return;
    }

    animateCharacterCount = 0;

    if (currentHeroImgSuffix === 6) {
      currentHeroImgSuffix = 1;
    } else {
      currentHeroImgSuffix++;
    }

    heroImg.src = `assets/hero/walk/walk${currentHeroImgSuffix}.png`;

    requestAnimationFrame(animateCharacter);
  };