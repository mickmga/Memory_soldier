var Opponent = /** @class */ (function () {
    function Opponent(data) {
        this.data = data;
        this.element = createOpponentElement();
    }
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
var leftToRightMovement = new Movement(DIRECTIONS.LEFT, 2);
var animateCharacterCount = 0;
var currentHeroImgSuffix = 0;
var hero = document.getElementById("hero");
var heroImg = document.getElementById("heroImg");
var createOpponentElement = function () {
    var element = document.createElement("div");
    element.classList.add("opponent");
    return element;
};
window.onload = function () {
    buildInjectAndlaunchNextOpponent();
    animateCharacter();
    moveHero(leftToRightMovement);
};
var buildInjectAndlaunchNextOpponent = function () {
    //build
    var opponent = buildOpponent("data");
    //inject
    injectOpponent(opponent);
    //launch
    triggerOpponentMovement(opponent);
};
var launchNextOpponent = function () {
    var opponent = getNextOpponent();
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
};
var getNextOpponentData = function () {
    return "data";
};
var triggerOpponentMovement = function (opponent) {
};
var buildOpponent = function (data) {
    return new Opponent(data);
};
var animateCharacter = function () {
    if (animateCharacterCount < 15) {
        animateCharacterCount++;
        requestAnimationFrame(animateCharacter);
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
    requestAnimationFrame(animateCharacter);
};
var updateCharacterPosition = function (character, movement) {
    var characterPosition = character["offset".concat(movement.direction.charAt(0).toUpperCase()).concat(movement.direction.slice(1))];
    character.style[movement.direction] = "".concat(characterPosition + movement.value, "px");
};
var moveHero = function (movement) {
    if (hero.offsetLeft >= window.innerWidth / 2) {
        movement.value *= -1;
    }
    updateCharacterPosition(hero, movement);
    requestAnimationFrame(function () { return moveHero(movement); });
};
