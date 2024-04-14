//types
var Topic = /** @class */ (function () {
    function Topic(name, data) {
        this.name = name;
        this.data = data;
    }
    return Topic;
}());
var TopicData = /** @class */ (function () {
    function TopicData(valid, invalid) {
        this.valid = valid;
        this.invalid = invalid;
    }
    return TopicData;
}());
//additionsAndSubstractions
var additionsAndSubstractionsData = new TopicData(["10+1 =11", "100+4=104"], ["30+3 = 30", "10+10 = 11"]);
var additionsAndSubstractions = new Topic("additionsAndSubstractions", additionsAndSubstractionsData);
//topic
var topics = [additionsAndSubstractions];
var hero = document.getElementById("hero");
var opponent = document.getElementById("opponent");
var running = false;
var opponentsOnScreen = [opponent];
var currentTopic = topics[0];
var currentTopicData;
var topicOver = false;
var executed = false;
//create movement
var currentHeroImgSuffix = 1;
//speed 
var opponent_speed_multiplier = 0.15;
var next_opponent_appearance_delay_in_ms = 1000;
var lastFrameTimeStamp = Date.now();
var pixelMovePerMs = 1;
var heroImg = document.getElementById("heroImg");
var injectTopic = function () {
    //document.getElementById("topic")?.innerHTML = "";
};
var injectData = function () {
    var htmlData = document.getElementById("data");
    if (!htmlData) {
        return;
    }
    htmlData.innerHTML = currentTopicData.data;
};
var clearData = function () {
    var htmlData = document.getElementById("data");
    if (!htmlData) {
        return;
    }
    htmlData.innerHTML = "";
};
var pickNextPieceOfData = function () {
    if (currentTopic.data.valid.length === 0 && currentTopic.data.invalid.length === 0) {
        alert("topic over");
        topicOver = true;
        return;
    }
    var nextDataIsvalid = Math.random() > 0.5;
    var validData = nextDataIsvalid ? currentTopic.data.valid : currentTopic.data.invalid;
    if (validData.length === 0) {
        validData = nextDataIsvalid ? currentTopic.data.invalid : currentTopic.data.valid;
        nextDataIsvalid = !nextDataIsvalid;
    }
    currentTopicData = { valid: nextDataIsvalid, index: 0, data: validData[0] };
    injectData();
};
var launchNewOpponent = function () {
    if (!opponent) {
        return;
    }
    pickNextPieceOfData();
    opponent.style.display = 'flex';
    running = true;
    var move = function (character, movementPerFrame) {
        if (!opponent || !hero || topicOver) {
            return;
        }
        var millisecondsBetweenFrames = Date.now() - lastFrameTimeStamp;
        lastFrameTimeStamp = Date.now();
        var currentCharacterLeft = character.offsetLeft;
        var newCharacterLeft = currentCharacterLeft + movementPerFrame;
        character.style.left = "".concat(newCharacterLeft, "px");
        if (!running) {
            return;
        }
        requestAnimationFrame(function () { return move(character, movementPerFrame); });
    };
    move(opponent, -6.5);
    hero && move(hero, 6.5);
};
window.onload = function () {
    running = true;
    //launchNewOpponent();
};
var isThereAcollision = function (hero, opponent) {
    if (!hero || !opponent) {
        return false;
    }
    return opponent.offsetLeft <= (hero.offsetLeft + hero.offsetWidth);
};
var handleKey = function (event) {
    if (event.key === " ") {
        attack();
    }
};
document.addEventListener("keydown", handleKey);
var attack = function () {
    opponentsOnScreen.forEach(function (opponentOnScreen) {
        if (hero && opponentOnScreen && opponentOnScreen.offsetLeft - hero.offsetLeft < 250) {
            killOpponent(opponentOnScreen);
        }
    });
};
var killOpponent = function (opponent) {
    opponent.style.left = '80vw';
    running = false;
    //opponent_speed_multiplier*=2;
    //next_opponent_appearance_delay_in_ms-=200;
    //console.log(next_opponent_appearance_delay_in_ms);
    //if valid or invalid data => continue
    if (currentTopicData.valid) {
        currentTopic.data.valid.splice(currentTopicData.index, 1);
    }
    else {
        currentTopic.data.invalid.splice(currentTopicData.index, 1);
    }
    clearData();
    setTimeout(launchNewOpponent, next_opponent_appearance_delay_in_ms);
};
var animateCharacter = function () {
    if (!heroImg)
        return;
    if (currentHeroImgSuffix === 8) {
        currentHeroImgSuffix = 1;
    }
    else {
        currentHeroImgSuffix++;
    }
    heroImg.style.src = "hero".concat(currentHeroImgSuffix, ".p");
};
