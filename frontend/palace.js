window.onload = function () {
    console.log("let's go, you are ready to start building");
};
let launched = false;


document.addEventListener("keydown", function (event) {
    
    if (event.key === 'd' && launched === false) {
       // cameraMovement();
        //animateCharacter("assets/hero/walk/walk", 6);
        animateCharacterOnce('assets/hero/item_creation/item_creation', 3);
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


const animateCharacter = (spriteBase, spriteLength) => {

    if (animateCharacterCount < 3) {
      animateCharacterCount++;
      requestAnimationFrame(animateCharacter);
      return;
    }

    animateCharacterCount = 0;

    if (currentHeroImgSuffix === spriteLength) {
      currentHeroImgSuffix = 1;
    } else {
      currentHeroImgSuffix++;
    }
    heroImg.src = `${spriteBase}${currentHeroImgSuffix}.png`;

    requestAnimationFrame(() => animateCharacter(spriteBase, spriteLength));

  };


  const animateCharacterOnce = (spriteBase, spriteLength) => {

    console.log(spriteBase)

    if (animateCharacterCount < 5) {
      animateCharacterCount++;
      requestAnimationFrame( () => animateCharacterOnce(spriteBase, spriteLength) );
      return;
    }

    animateCharacterCount = 0;

    if (currentHeroImgSuffix === spriteLength) {
      return;
    } else {
      currentHeroImgSuffix++;
    }
    heroImg.src = `${spriteBase}${currentHeroImgSuffix}.png`;

    requestAnimationFrame(() => animateCharacterOnce(spriteBase, spriteLength));

  };



