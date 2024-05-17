window.onload = function () {
    console.log("let's go, you are ready to start building");
};
var cameraLaunched = false;
var leftCameraLaunched = false;
var singleAnimationLaunched = false;
var walking = false;
var walkingLeft = false;
var singleAnimationSelectedSprite = 0;
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
    if (event.key === ' ') {
        walking = false;
        cameraLaunched = false;
        animateCharacterOnce('assets/hero/item_creation/item_creation', 3);
    }
});
document.addEventListener("keyup", function (event) {
    if (event.key === 'd' && cameraLaunched === true) {
        walking = false;
        cameraLaunched = false;
    }
    if (event.key === 'q' && leftCameraLaunched === true) {
        walkingLeft = false;
        leftCameraLaunched = false;
    }
});
var cameraMovement = function () {
    if (walking === false) {
        return;
    }
    cameraLaunched = true;
    var gameContainer = document.getElementById("gameContainer");
    var gameContainerLeft = gameContainer.offsetLeft;
    gameContainer.style.left = "".concat(gameContainerLeft - 3, "px");
    requestAnimationFrame(cameraMovement);
};
var leftCameraMovement = function () {
    if (walkingLeft === false) {
        return;
    }
    leftCameraLaunched = true;
    var gameContainer = document.getElementById("gameContainer");
    var gameContainerLeft = gameContainer.offsetLeft;
    gameContainer.style.left = "".concat(gameContainerLeft + 3, "px");
    requestAnimationFrame(leftCameraMovement);
};
var animateCharacterCount = 0;
var currentHeroImgSuffix = 0;
var heroImg = document.getElementById('heroImg');
var animateCharacter = function (spriteBase, spriteLength) {
    if (walking === false) {
        return;
    }
    if (animateCharacterCount < 3) {
        animateCharacterCount++;
        requestAnimationFrame(function () { return animateCharacter(spriteBase, spriteLength); });
        return;
    }
    animateCharacterCount = 0;
    if (currentHeroImgSuffix === spriteLength) {
        currentHeroImgSuffix = 1;
    }
    else {
        currentHeroImgSuffix++;
    }
    heroImg.src = "".concat(spriteBase).concat(currentHeroImgSuffix, ".png");
    requestAnimationFrame(function () { return animateCharacter(spriteBase, spriteLength); });
};
var animateCharacterOnce = function (spriteBase, spriteLength) {
    singleAnimationLaunched = true;
    if (animateCharacterCount < 4) {
        animateCharacterCount++;
        requestAnimationFrame(function () { return animateCharacterOnce(spriteBase, spriteLength); });
        return;
    }
    animateCharacterCount = 0;
    if (singleAnimationSelectedSprite === spriteLength) {
        singleAnimationSelectedSprite = 0;
        return;
    }
    else {
        singleAnimationSelectedSprite++;
    }
    heroImg.src = "".concat(spriteBase).concat(singleAnimationSelectedSprite, ".png");
    requestAnimationFrame(function () { return animateCharacterOnce(spriteBase, spriteLength); });
};
var moveLeft = function (spriteBase, spriteLength) {
    if (walkingLeft === false) {
        return;
    }
    if (animateCharacterCount < 3) {
        animateCharacterCount++;
        requestAnimationFrame(function () { return moveLeft(spriteBase, spriteLength); });
        return;
    }
    animateCharacterCount = 0;
    if (currentHeroImgSuffix === spriteLength) {
        currentHeroImgSuffix = 1;
    }
    else {
        currentHeroImgSuffix++;
    }
    heroImg.src = "".concat(spriteBase).concat(currentHeroImgSuffix, ".png");
    requestAnimationFrame(function () { return moveLeft(spriteBase, spriteLength); });
};
