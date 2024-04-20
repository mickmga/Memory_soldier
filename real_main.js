var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
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
var ANSWER_TYPE;
(function (ANSWER_TYPE) {
    ANSWER_TYPE[ANSWER_TYPE["RIGHT"] = 0] = "RIGHT";
    ANSWER_TYPE[ANSWER_TYPE["WRONG"] = 1] = "WRONG";
})(ANSWER_TYPE || (ANSWER_TYPE = {}));
var RightAnswer = /** @class */ (function () {
    function RightAnswer(value) {
        this.value = value;
        this.answerType = ANSWER_TYPE.RIGHT;
    }
    return RightAnswer;
}());
var WrongAnswer = /** @class */ (function () {
    function WrongAnswer(value) {
        this.value = value;
        this.answerType = ANSWER_TYPE.WRONG;
    }
    return WrongAnswer;
}());
var Theme = /** @class */ (function () {
    function Theme(name, goodAnswers, badAnswers) {
        this.name = name;
        this.goodAnswers = goodAnswers;
        this.badAnswers = badAnswers;
    }
    return Theme;
}());
var ReduxStore = /** @class */ (function () {
    function ReduxStore() {
        this.themes = [];
        this.inGameTheme = getCapitalsTheme();
    }
    return ReduxStore;
}());
var collectThemes = function () {
};
var LEFT_TO_RIGHT_MOVEMENT = new Movement(DIRECTIONS.LEFT, 2);
var RIGHT_TO_LEFT_MOVEMENT = new Movement(DIRECTIONS.LEFT, -2);
var ELEMENTS_REFERENCE_POINT = 'left';
var HERO_HIT_POINT = document.getElementById("hero");
var animateCharacterCount = 0;
var currentHeroImgSuffix = 0;
var hero = document.getElementById("hero");
var heroImg = document.getElementById("heroImg");
var dataContainer = document.getElementById("data");
var opponentsOnScreen;
var animationPrePaused = false;
var animationPaused = false;
var additionalCameraSpeed = 0;
var wrongOpponentsCollisions = 0;
var wrongOpponentsKilled = 0;
var reduxStore;
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
    reduxStore = new ReduxStore();
    initOpponentsOnScreen();
    setKeyPressListener();
    buildInjectAndlaunchNextOpponent();
    animateCharacter(heroImg);
    moveHero(LEFT_TO_RIGHT_MOVEMENT);
};
var getCapitalsTheme = function () {
    var goodAnswers = [new RightAnswer("Paris"), new RightAnswer("London")];
    var badAnswers = [new WrongAnswer("Chicago"), new RightAnswer("Monaco")];
    return new Theme("capitals", goodAnswers, badAnswers);
};
var buildInjectAndlaunchNextOpponent = function () {
    //build
    var opponent = buildOpponent(getNextOpponentData());
    //inject
    injectOpponent(opponent);
    //launch
    opponent.animate(9, 500);
    triggerOpponentMovement(opponent);
};
var getNextOpponent = function () {
    var data = getNextOpponentData();
    var opponent = buildOpponent(data);
    injectOpponent(opponent);
    return opponent;
};
var injectOpponent = function (opponent) {
    dataContainer.innerHTML = opponent.data.value;
    document.body.append(opponent.element);
    opponentsOnScreen.addOpponent(opponent);
};
var getNextOpponentData = function () {
    var theme = reduxStore.inGameTheme;
    return pickRandomAnswer(theme, function () {
        alert("Level over!");
    });
};
var triggerOpponentMovement = function (opponent) {
    updateCharacterPosition(opponent.element, new Movement(DIRECTIONS.LEFT, -2 - additionalCameraSpeed));
    if (opponent.element.offsetLeft <= 0) {
        opponentsOnScreen.removeOpponent(opponent);
        return;
    }
    requestAnimationFrame(function () { return triggerOpponentMovement(opponent); });
};
var buildOpponent = function (data) {
    return new Opponent(data, opponentsOnScreen.opponents.length - 1);
};
var animateCharacter = function (character) {
    if (animationPrePaused) {
        animationPaused = true;
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
var addOpponentCollision = function () {
    wrongOpponentsCollisions++;
    alert("wrong opponent collision!");
};
var wrongOpponentCollided = function () {
    addOpponentCollision();
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
    for (var i = 0; i < opponentsOnScreen.opponents.length; i++) {
        var opponent = opponentsOnScreen.opponents[i];
        if (opponent.element.offsetLeft < hero.offsetLeft && opponent.data.answerType === ANSWER_TYPE.RIGHT) {
            wrongOpponentCollided();
        }
    }
    requestAnimationFrame(function () { return moveHero(movement); });
};
var wrongOpponentKilled = function () {
    alert("you killed a wrong opponent!");
    wrongOpponentsKilled++;
};
var heroHits = function () {
    attackAnimation();
    for (var i = 0; i < opponentsOnScreen.opponents.length; i++) {
        var opponent = opponentsOnScreen.opponents[i];
        if (opponent.element.offsetLeft < HERO_HIT_POINT.offsetLeft + HERO_HIT_POINT.offsetWidth) {
            if (opponent.data.answerType === ANSWER_TYPE.WRONG) {
                wrongOpponentKilled();
            }
            opponentsOnScreen.removeOpponent(opponent);
            i--;
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
var pickRandomAnswer = function (theme, levelOver) {
    var randomValue = Math.random();
    var pool = randomValue < 0.5 ? __spreadArray([], theme.goodAnswers, true) : __spreadArray([], theme.badAnswers, true);
    var otherPool = randomValue < 0.5 ? __spreadArray([], theme.badAnswers, true) : __spreadArray([], theme.goodAnswers, true);
    var pickFromPool = function () {
        if (pool.length > 0) {
            var randomIndex = Math.floor(Math.random() * pool.length);
            var pickedAnswer = pool.splice(randomIndex, 1)[0];
            return pickedAnswer;
        }
        else if (otherPool.length > 0) {
            return pickRandomAnswer(theme, levelOver);
        }
        else {
            levelOver();
            return null;
        }
    };
    return pickFromPool();
};
