var Opponent = /** @class */ (function () {
    function Opponent(data) {
        this.data = data;
        this.element = createOpponentElement();
    }
    return Opponent;
}());
var animateCharacterCount = 0;
var currentHeroImgSuffix = 0;
var heroImg = document.getElementById("heroImg");
var createOpponentElement = function () {
    var element = document.createElement("div");
    element.classList.add("opponent");
    return element;
};
window.onload = function () {
    buildInjectAndlaunchNextOpponent();
    animateCharacter();
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
