window.onload = function () {
    console.log("let's go, you are ready to start building");
};
let cameraLaunched = false;
let leftCameraLaunched = false;
let singleAnimationLaunched = false;
let walking = false;
let walkingLeft = false;
let singleAnimationSelectedSprite = 0;
let openedMenu = false;

let selectedSlot: string | null = null;

const dataEditor = document.getElementById('dataEditor');

document.addEventListener("keydown", function (event) {
    if (event.key === 'd' && cameraLaunched === false) {
       walking = true;
       cameraMovement();
       animateCharacter("assets/hero/walk/walk", 6);
    } 
    if (event.key === 'q' && leftCameraLaunched === false) {
      walkingLeft = true;
      leftCameraMovement();
      moveLeft("assets/hero/walk_left/walk_left", 6);
   } 

    if(event.key === ' '){
      walking = false;
      cameraLaunched=false;
      animateCharacterOnce('assets/hero/item_creation/item_creation',3)
    }
});

document.addEventListener("keyup", function (event) {
  if (event.key === 'd' && cameraLaunched === true) {
     walking = false;
     cameraLaunched=false;
  }
  if (event.key === 'q' && leftCameraLaunched === true) {
    walkingLeft = false;
    leftCameraLaunched=false;
 } 
});

const openOrCloseMenu = () => {

    const menu = document.getElementById("menu")!;

    menu.style.display = openedMenu ? 'none' : 'flex';

    openedMenu = !openedMenu;

}


const cameraMovement = () => {

  if(walking === false) {
    return;
  }

  cameraLaunched = true;

  const gameContainer = document.getElementById("gameContainer")!;

  const gameContainerLeft = gameContainer.offsetLeft;

  gameContainer.style.left = `${gameContainerLeft-3}px`;

  requestAnimationFrame(cameraMovement);

}

const leftCameraMovement = () => {

  if(walkingLeft === false) {
    return;
  }

  leftCameraLaunched = true;

  const gameContainer = document.getElementById("gameContainer")!;

  const gameContainerLeft = gameContainer.offsetLeft;

  gameContainer.style.left = `${gameContainerLeft+3}px`;

  requestAnimationFrame(leftCameraMovement);
}

let animateCharacterCount = 0;

let currentHeroImgSuffix = 0;

let heroImg = document.getElementById('heroImg') as HTMLImageElement;


const animateCharacter = (spriteBase, spriteLength) => {

  if(walking === false) {
    return;
  }
  
    if (animateCharacterCount < 3) {
      animateCharacterCount++;
      requestAnimationFrame(() => animateCharacter(spriteBase, spriteLength));
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

    singleAnimationLaunched = true;

    if (animateCharacterCount < 4) {
      animateCharacterCount++;
      requestAnimationFrame( () => animateCharacterOnce(spriteBase, spriteLength) );
      return;
    }

    animateCharacterCount = 0;

    if (singleAnimationSelectedSprite === spriteLength) { 
      singleAnimationSelectedSprite = 0;
      return;
    } else {
      singleAnimationSelectedSprite++;
    }
    heroImg.src = `${spriteBase}${singleAnimationSelectedSprite}.png`;

    requestAnimationFrame(() => animateCharacterOnce(spriteBase, spriteLength));

  };


  const moveLeft = (spriteBase, spriteLength) => {

    if(walkingLeft === false) {
      return;
    }
    
      if (animateCharacterCount < 3) {
        animateCharacterCount++;
        requestAnimationFrame(() => moveLeft(spriteBase, spriteLength));
        return;
      }
  
      animateCharacterCount = 0;
  
      if (currentHeroImgSuffix === spriteLength) {
        currentHeroImgSuffix = 1;
      } else {
        currentHeroImgSuffix++;
      }
      heroImg.src = `${spriteBase}${currentHeroImgSuffix}.png`;
  
      requestAnimationFrame(() => moveLeft(spriteBase, spriteLength));
  
    };

    const  extractAfterValue= (value: string, filePath: string): string => {
      const index = filePath.indexOf(value);
      if (index !== -1) {

        return filePath.substring(index + value.length);
      }
      return ""; // or handle it in another way if "frontend/" is not found
    }
    

  const pickItem = (event: {target: {currentSrc: string}}) => {
    const itemSrc = extractAfterValue('frontend/', event.target.currentSrc);
    updateSlotImage(itemSrc);
    openDataEditor();
  }

  const selectSlot = (event: {target: {id: string} } ) => {
    const slotId = extractAfterValue('slot_', event.target.id);
    selectedSlot=slotId;
    openOrCloseMenu();
  }

  const updateSlotImage = (src: string) => {
     const result = fetch("http://localhost:3000/slot/update_item?src=" + src + "&slot_id=" + selectedSlot).then(
     res => {
        if(res.status === 200){
          const imgElement = document.getElementById("img_slot_" + selectedSlot)! as HTMLImageElement;
          imgElement.src=src;
        }
       }
     );

  }

  const openDataEditor = () => {
     dataEditor!.style.display = 'flex';
     openOrCloseMenu();
  }

  const saveText = () => {
    const textArea = document.getElementById('editorArea')! as HTMLTextAreaElement;
    
    fetch("http://localhost:3000/content", {
      method: "POST",
      headers: {
        
      }
    })
  }
