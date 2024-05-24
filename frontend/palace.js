window.onload = function () {
    console.log("let's go, you are ready to start building");
};
var cameraLaunched = false;
var leftCameraLaunched = false;
var singleAnimationLaunched = false;
var walking = false;
var walkingLeft = false;
var singleAnimationSelectedSprite = 0;
var openedMenu = false;
var selectedSlot = null;
var dataEditor = document.getElementById('dataEditor');
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
var openOrCloseMenu = function () {
    var menu = document.getElementById("menu");
    menu.style.display = openedMenu ? 'none' : 'flex';
    openedMenu = !openedMenu;
};
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
var extractAfterValue = function (value, filePath) {
    var index = filePath.indexOf(value);
    if (index !== -1) {
        return filePath.substring(index + value.length);
    }
    return ""; // or handle it in another way if "frontend/" is not found
};
var pickItem = function (event) {
    var itemSrc = extractAfterValue('frontend/', event.target.currentSrc);
    updateSlotImage(itemSrc);
    openDataEditor();
};
var selectSlot = function (event) {
    var slotId = extractAfterValue('slot_', event.target.id);
    selectedSlot = slotId;
    openOrCloseMenu();
};
var updateSlotImage = function (src) {
    var result = fetch("http://localhost:3000/slot/update_item?src=" + src + "&slot_id=" + selectedSlot).then(function (res) {
        if (res.status === 200) {
            var imgElement = document.getElementById("img_slot_" + selectedSlot);
            imgElement.src = src;
        }
    });
};
var openDataEditor = function () {
    dataEditor.style.display = 'flex';
    openOrCloseMenu();
};
var saveText = function () {
    var dataTitleInput = document.getElementById('dataTitle');
    var textArea = document.getElementById('editorArea');
    fetch("http://localhost:3000/content", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({
            left: selectedSlot,
            data: {
                title: dataTitleInput.value,
                body: textArea.value
            }
        }) // Convert the data object to a JSON string
    }).then(function (response) {
        // Check if the response is successful (status code 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
        .then(function (data) {
        // Handle the parsed JSON data
        console.log('Success:', data);
    })["catch"](function (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
    });
};
