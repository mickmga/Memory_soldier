var Opponent = /** @class */ (function () {
    function Opponent(data, index) {
        this.animationTimeout = null; // Store timeout ID
        this.data = data;
        this.element = createOpponentElement();
        this.index = index;
        this.imgElement = document.createElement('img'); // Create img element
        this.imgElement.classList.add('opponentImg'); // Add class to img element
        this.element.appendChild(this.imgElement); // Append img element to opponent element
    }
    Opponent.prototype.animate = function (frames, interval) {
        var _this = this;
        var currentFrame = frames;
        var animateOpponentCount = 0;
        var animateOpponent = function () {
            console.log("animating");
            if (animateOpponentCount < 5) {
                animateOpponentCount++;
                requestAnimationFrame(animateOpponent);
                return;
            }
            animateOpponentCount = 0;
            if (currentFrame === frames) {
                currentFrame = 1;
            }
            else {
                currentFrame++;
            }
            _this.imgElement.src = "assets/opponents/wolf_run_".concat(currentFrame, ".png");
            requestAnimationFrame(animateOpponent);
        };
        animateOpponent();
    };
    Opponent.prototype.clearTimeout = function () {
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout); // Clear the timeout when opponent is removed
            this.animationTimeout = null; // Reset the timeout variable
        }
    };
    return Opponent;
}());
var DIRECTIONS;
(function (DIRECTIONS) {
    DIRECTIONS["LEFT"] = "left";
    DIRECTIONS["RIGHT"] = "right";
})(DIRECTIONS || (DIRECTIONS = {}));
var Movement = /** @class */ (function () {
    function Movement(direction, value) {
        this.direction = direction;
        this.value = value;
    }
    return Movement;
}());
var OpponentsOnScreen = /** @class */ (function () {
    function OpponentsOnScreen() {
        this.opponents = [];
    }
    OpponentsOnScreen.prototype.addOpponent = function (opponent) {
        this.opponents.push(opponent);
    };
    OpponentsOnScreen.prototype.removeOpponent = function (opponent) {
        var index = this.opponents.indexOf(opponent);
        if (index !== -1) {
            this.opponents.splice(index, 1);
            opponent.element.remove();
        }
    };
    OpponentsOnScreen.prototype.getOpponentAtIndex = function (index) {
        if (index >= 0 && index < this.opponents.length) {
            return this.opponents[index];
        }
        else {
            console.error("Invalid index provided for getting opponent.");
            return undefined;
        }
    };
    return OpponentsOnScreen;
}());
var LEFT_TO_RIGHT_MOVEMENT = new Movement(DIRECTIONS.LEFT, 2);
var RIGHT_TO_LEFT_MOVEMENT = new Movement(DIRECTIONS.LEFT, -2);
var ELEMENTS_REFERENCE_POINT = 'left';
var HERO_HIT_POINT = document.getElementById("hero");
var animateCharacterCount = 0;
var currentHeroImgSuffix = 0;
var hero = document.getElementById("hero");
var heroImg = document.getElementById("heroImg");
var opponentsOnScreen;
var animationPrePaused = false;
var animationPaused = false;
var additionalCameraSpeed = 0;
var pauseAnimation = function () {
    animateCharacterCount = 0;
    animationPrePaused = true;
};
var resumeAnimation = function () {
    animationPrePaused = false;
    animationPaused = false;
    animateCharacter(heroImg);
    moveHero(LEFT_TO_RIGHT_MOVEMENT);
};
var initOpponentsOnScreen = function () {
    opponentsOnScreen = new OpponentsOnScreen();
};
var createOpponentElement = function () {
    var element = document.createElement("div");
    element.classList.add("opponent");
    return element;
};
var setKeyPressListener = function () {
    // Function to execute when space key is pressed
    var handleSpaceKeyPress = function (event) {
        if (event.key === " ") {
            heroHits();
        }
    };
    // Attach event listener to the document
    document.addEventListener("keydown", handleSpaceKeyPress);
};
window.onload = function () {
    initOpponentsOnScreen();
    setKeyPressListener();
    buildInjectAndlaunchNextOpponent();
    animateCharacter(heroImg);
    moveHero(LEFT_TO_RIGHT_MOVEMENT);
};
var buildInjectAndlaunchNextOpponent = function () {
    //build
    var opponent = buildOpponent(getNextOpponentData());
    //inject
    injectOpponent(opponent);
    //launch
    opponent.animate(9, 500); // 9 frames, 100ms interval between frames
    triggerOpponentMovement(opponent);
};
var getNextOpponent = function () {
    var data = getNextOpponentData();
    var opponent = buildOpponent(data);
    injectOpponent(opponent);
    return opponent;
};
var injectOpponent = function (opponent) {
    document.body.append(opponent.element);
    opponentsOnScreen.addOpponent(opponent);
};
var getNextOpponentData = function () {
    return "data";
};
var triggerOpponentMovement = function (opponent) {
    updateCharacterPosition(opponent.element, new Movement(DIRECTIONS.LEFT, -2 - additionalCameraSpeed));
    if (opponent.element.offsetLeft <= 0) {
        opponentsOnScreen.removeOpponent(opponent);
        return; // Stop the animation if opponent is removed
    }
    requestAnimationFrame(function () { return triggerOpponentMovement(opponent); });
};
var buildOpponent = function (data) {
    return new Opponent(data, opponentsOnScreen.opponents.length - 1);
};
var animateCharacter = function (character) {
    if (animationPrePaused) {
        animationPaused = true;
        console.log("returning");
        return;
    }
    if (animateCharacterCount < 15) {
        animateCharacterCount++;
        requestAnimationFrame(function () { return animateCharacter(character); });
        return;
    }
    animateCharacterCount = 0;
    if (currentHeroImgSuffix === 8) {
        currentHeroImgSuffix = 1;
    }
    else {
        currentHeroImgSuffix++;
    }
    heroImg.src = "assets/hero/hero".concat(currentHeroImgSuffix, ".png");
    requestAnimationFrame(function () { return animateCharacter(character); });
};
var updateCharacterPosition = function (character, movement) {
    var characterPosition = character.offsetLeft;
    character.style[movement.direction] = "".concat(characterPosition + movement.value, "px");
};
var moveHero = function (movement) {
    if (animationPrePaused) {
        animationPaused = true;
        return;
    }
    if (hero.offsetLeft >= window.innerWidth / 2) {
        movement.value *= -1;
        additionalCameraSpeed = 4;
    }
    if (hero.offsetLeft <= 0) {
        movement.value *= -1;
        additionalCameraSpeed = 0;
    }
    updateCharacterPosition(hero, movement);
    requestAnimationFrame(function () { return moveHero(movement); });
};
var heroHits = function () {
    attackAnimation();
    for (var i = 0; i < opponentsOnScreen.opponents.length; i++) {
        var opponent = opponentsOnScreen.opponents[i];
        if (opponent.element.offsetLeft < HERO_HIT_POINT.offsetLeft + HERO_HIT_POINT.offsetWidth) {
            opponentsOnScreen.removeOpponent(opponent); // Clear opponent from the list and DOM
            i--; // Adjust index after removing opponent
            setTimeout(buildInjectAndlaunchNextOpponent, 3000);
        }
    }
};
var attackAnimation = function () {
    var attackFrame = 1;
    pauseAnimation();
    var animateAttack = function () {
        if (attackFrame <= 4) {
            heroImg.src = "assets/hero/hero_attack_".concat(attackFrame, ".png");
            attackFrame++;
            requestAnimationFrame(animateAttack);
        }
        else {
            resumeAnimation();
        }
    };
    animateAttack();
};
