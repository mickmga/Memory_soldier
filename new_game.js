var DIRECTIONS;
(function (DIRECTIONS) {
    DIRECTIONS["LEFT"] = "left";
    DIRECTIONS["RIGHT"] = "right";
})(DIRECTIONS || (DIRECTIONS = {}));
var ANSWER_TYPE;
(function (ANSWER_TYPE) {
    ANSWER_TYPE[ANSWER_TYPE["RIGHT"] = 0] = "RIGHT";
    ANSWER_TYPE[ANSWER_TYPE["WRONG"] = 1] = "WRONG";
})(ANSWER_TYPE || (ANSWER_TYPE = {}));
var ReduxStore = /** @class */ (function () {
    function ReduxStore() {
        this.themes = [];
        this.inGameTheme = this.getCapitalsTheme();
    }
    ReduxStore.prototype.addTheme = function (theme) {
        this.themes.push(theme);
    };
    ReduxStore.prototype.getCapitalsTheme = function () {
        var goodAnswers = [new Answer("Paris", ANSWER_TYPE.RIGHT), new Answer("London", ANSWER_TYPE.RIGHT)];
        var badAnswers = [new Answer("Chicago", ANSWER_TYPE.WRONG), new Answer("Monaco", ANSWER_TYPE.WRONG)];
        var capitalsTheme = new Theme("capitals", goodAnswers, badAnswers);
        this.addTheme(capitalsTheme);
        return capitalsTheme;
    };
    return ReduxStore;
}());
var Opponent = /** @class */ (function () {
    function Opponent(_data, _element, imgElement, index, movement) {
        if (movement === void 0) { movement = RIGHT_TO_LEFT_MOVEMENT; }
        this._data = _data;
        this._element = _element;
        this.imgElement = imgElement;
        this.index = index;
        this.movement = movement;
        this.animationTimeout = null;
        this.animateOpponentCount = 0;
        this.currentFrame = 9;
        this._element.appendChild(this.imgElement);
        this.initialMovementValue = movement.value;
    }
    Object.defineProperty(Opponent.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Opponent.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: false,
        configurable: true
    });
    Opponent.prototype.animate = function () {
        var _this = this;
        var animateOpponent = function () {
            if (_this.animateOpponentCount < 5) {
                _this.animateOpponentCount++;
                requestAnimationFrame(animateOpponent);
                return;
            }
            _this.animateOpponentCount = 0;
            if (_this.currentFrame === 1) {
                _this.currentFrame = 9;
            }
            else {
                _this.currentFrame--;
            }
            _this.imgElement.src = "assets/opponents/wolf_run_".concat(_this.currentFrame, ".png");
            requestAnimationFrame(animateOpponent);
        };
        animateOpponent();
    };
    Opponent.prototype.resetMovement = function () {
        this.movement.value = this.initialMovementValue;
    };
    Opponent.prototype.clearTimeout = function () {
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }
    };
    Opponent.prototype.updatePosition = function (movement) {
        var position = this.element.offsetLeft;
        this._element.style.left = "".concat(position + movement.value, "px");
    };
    Opponent.prototype.checkCollision = function () {
        return this._element.offsetLeft < HERO_HIT_POINT.offsetLeft;
    };
    Opponent.prototype.increaseSpeed = function (increase) {
        this.movement.value -= increase;
    };
    return Opponent;
}());
var Hero = /** @class */ (function () {
    function Hero(heroImg, hero) {
        this.heroImg = heroImg;
        this.hero = hero;
        this.animateCharacterCount = 0;
        this.currentHeroImgSuffix = 0;
    }
    Hero.prototype.animate = function () {
        var _this = this;
        var animateCharacter = function () {
            if (_this.animateCharacterCount < 15) {
                _this.animateCharacterCount++;
                requestAnimationFrame(animateCharacter);
                return;
            }
            _this.animateCharacterCount = 0;
            if (_this.currentHeroImgSuffix === 8) {
                _this.currentHeroImgSuffix = 1;
            }
            else {
                _this.currentHeroImgSuffix++;
            }
            _this.heroImg.src = "assets/hero/hero".concat(_this.currentHeroImgSuffix, ".png");
            requestAnimationFrame(animateCharacter);
        };
        animateCharacter();
    };
    Hero.prototype.updatePosition = function (movement) {
        var characterPosition = this.hero.offsetLeft;
        this.hero.style[movement.direction] = "".concat(characterPosition + movement.value, "px");
    };
    Hero.prototype.checkForMiddleScreenReaching = function () {
        return this.hero.offsetLeft >= window.innerWidth / 3;
    };
    Hero.prototype.checkForLeftLimitReaching = function () {
        return this.hero.offsetLeft <= 0;
    };
    Hero.prototype.heroHits = function (opponentsOnScreen) {
        for (var i = 0; i < opponentsOnScreen.opponents.length; i++) {
            var opponent = opponentsOnScreen.opponents[i];
            if (opponent.element.offsetLeft < HERO_HIT_POINT.offsetLeft + HERO_HIT_POINT.offsetWidth) {
                if (opponent.data.isCorrect()) {
                    alert("Congratulations! You properly killed an opponent");
                }
                else {
                    alert("You made a mistake! You should not have killed that one !");
                }
            }
        }
    };
    return Hero;
}());
var Movement = /** @class */ (function () {
    function Movement(direction, value) {
        this.direction = direction;
        this.value = value;
    }
    return Movement;
}());
var Answer = /** @class */ (function () {
    function Answer(value, answerType) {
        this.value = value;
        this.answerType = answerType;
    }
    Answer.prototype.isCorrect = function () {
        return this.answerType === ANSWER_TYPE.RIGHT;
    };
    return Answer;
}());
var Theme = /** @class */ (function () {
    function Theme(name, goodAnswers, badAnswers) {
        this.name = name;
        this.goodAnswers = goodAnswers;
        this.badAnswers = badAnswers;
    }
    return Theme;
}());
var OpponentsOnScreen = /** @class */ (function () {
    function OpponentsOnScreen() {
        this._opponents = [];
    }
    Object.defineProperty(OpponentsOnScreen.prototype, "opponents", {
        get: function () {
            return this._opponents;
        },
        enumerable: false,
        configurable: true
    });
    OpponentsOnScreen.prototype.addOpponent = function (opponent) {
        this._opponents.push(opponent);
    };
    OpponentsOnScreen.prototype.removeOpponent = function (opponent) {
        var index = this._opponents.indexOf(opponent);
        if (index !== -1) {
            this._opponents.splice(index, 1);
            opponent.clearTimeout();
            opponent.element.remove();
        }
    };
    OpponentsOnScreen.prototype.getOpponentAtIndex = function (index) {
        return this._opponents[index];
    };
    return OpponentsOnScreen;
}());
function createOpponentElement() {
    var element = document.createElement("div");
    element.classList.add("opponent");
    return element;
}
var Game = /** @class */ (function () {
    function Game(reduxStore, dataContainer, HERO_HIT_POINT) {
        this.reduxStore = reduxStore;
        this.dataContainer = dataContainer;
        this.HERO_HIT_POINT = HERO_HIT_POINT;
        this.backgroundMovement = 0;
    }
    Game.prototype.init = function () {
        var _this = this;
        this.hero = new Hero(document.getElementById("heroImg"), document.getElementById("hero"));
        this.opponentsOnScreen = new OpponentsOnScreen();
        this.buildInjectAndLaunchNextOpponent();
        this.hero.animate();
        this.moveHero(LEFT_TO_RIGHT_MOVEMENT);
        this.animateOpponents();
        document.addEventListener("keydown", function (event) {
            if (event.key === " ") {
                _this.hero.heroHits(_this.opponentsOnScreen);
            }
        });
    };
    Game.prototype.buildInjectAndLaunchNextOpponent = function () {
        var opponent = this.getNextOpponent();
        this.injectOpponent(opponent);
        opponent.animate();
        this.triggerOpponentMovement(opponent);
    };
    Game.prototype.getNextOpponent = function () {
        var data = this.getNextOpponentData();
        return new Opponent(data, createOpponentElement(), document.createElement('img'), this.opponentsOnScreen.opponents.length - 1, RIGHT_TO_LEFT_MOVEMENT);
    };
    Game.prototype.getNextOpponentData = function () {
        var theme = this.reduxStore.inGameTheme;
        return this.pickRandomAnswer(theme);
    };
    Game.prototype.injectOpponent = function (opponent) {
        this.dataContainer.innerHTML = opponent.data.value;
        var opponentElement = document.createElement("div");
        opponentElement.classList.add("opponent");
        document.body.append(opponent.element);
        this.opponentsOnScreen.addOpponent(opponent);
    };
    Game.prototype.triggerOpponentMovement = function (opponent) {
        var updateMovement = function () {
            opponent.updatePosition(opponent.movement);
            if (opponent.checkCollision() && opponent.data.isCorrect()) {
                alert("vous n avez pas tué cet adversaire!");
                //this.opponentsOnScreen.removeOpponent(opponent);
                //return;
            }
            requestAnimationFrame(updateMovement);
        };
        updateMovement();
    };
    Game.prototype.moveHero = function (movement) {
        var _this = this;
        if (this.hero.checkForMiddleScreenReaching()) {
            movement.value *= -1;
            var opponentSpeedIncrease = Math.abs(movement.value) + Math.abs(this.backgroundMovement);
            for (var _i = 0, _a = this.opponentsOnScreen.opponents; _i < _a.length; _i++) {
                var opponent = _a[_i];
                opponent.increaseSpeed(opponentSpeedIncrease);
            }
        }
        // If hero reaches left limit, reverse the movement
        if (this.hero.checkForLeftLimitReaching()) {
            movement.value *= -1;
            // Also update the background movement
            this.backgroundMovement = movement.value;
            for (var _b = 0, _c = this.opponentsOnScreen.opponents; _b < _c.length; _b++) {
                var opponent = _c[_b];
                opponent.resetMovement();
            }
        }
        this.hero.updatePosition(movement);
        requestAnimationFrame(function () { return _this.moveHero(movement); });
    };
    Game.prototype.animateOpponents = function () {
        for (var _i = 0, _a = this.opponentsOnScreen.opponents; _i < _a.length; _i++) {
            var opponent = _a[_i];
            opponent.animate();
        }
    };
    Game.prototype.pickRandomAnswer = function (theme) {
        var randomValue = Math.random();
        var pool = randomValue < 0.5 ? theme.goodAnswers : theme.badAnswers;
        var otherPool = randomValue < 0.5 ? theme.badAnswers : theme.goodAnswers;
        if (pool.length > 0) {
            var randomIndex = Math.floor(Math.random() * pool.length);
            var pickedAnswer = pool.splice(randomIndex, 1)[0];
            return pickedAnswer;
        }
        else if (otherPool.length > 0) {
            return this.pickRandomAnswer(theme);
        }
        else {
            console.error("No answers available in the theme");
            return new Answer("No answer available", ANSWER_TYPE.WRONG);
        }
    };
    return Game;
}());
var LEFT_TO_RIGHT_MOVEMENT = new Movement(DIRECTIONS.LEFT, 2);
var RIGHT_TO_LEFT_MOVEMENT = new Movement(DIRECTIONS.LEFT, -2);
var HERO_HIT_POINT = document.getElementById("hero");
var reduxStore = new ReduxStore();
var dataContainer = document.getElementById("data");
var game = new Game(reduxStore, dataContainer, HERO_HIT_POINT);
game.init();
