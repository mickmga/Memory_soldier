//types
 class Topic {
  constructor(name:string, data: TopicData){
    this.name = name;
    this.data = data; 
  }
  name: string;
  data: TopicData;
}

 class TopicData {
  constructor(valid:  Array<string>, invalid: Array<string>){
    this.valid = valid;
    this.invalid = invalid; 
  }
    valid: Array<string>;
    invalid: Array<string>;
}

//additionsAndSubstractions


const additionsAndSubstractionsData = new TopicData(["10+1 =11", "100+4=104"], ["30+3 = 30", "10+10 = 11"])

const additionsAndSubstractions = new Topic("additionsAndSubstractions", additionsAndSubstractionsData);

//topic

const topics = [additionsAndSubstractions];


var hero = document.getElementById("hero");

var opponent = document.getElementById("opponent");

var running: boolean = false;

const opponentsOnScreen = [opponent];

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



var heroImg = document.getElementById("heroImg") as HTMLImageElement;



const injectTopic = () => {
   //document.getElementById("topic")?.innerHTML = "";
}

const injectData = () => {
  const htmlData = document.getElementById("data");
   if(!htmlData){
    return;
   }

   htmlData.innerHTML = currentTopicData.data;
}

const clearData = () => {
  const htmlData = document.getElementById("data");
   if(!htmlData){
    return;
   }

   htmlData.innerHTML = "";
  
}

const pickNextPieceOfData = () => {
  if (currentTopic.data.valid.length === 0 && currentTopic.data.invalid.length === 0) {
      alert("topic over");
      topicOver = true;
      return;
  }

  let nextDataIsvalid = Math.random() > 0.5;
  let validData = nextDataIsvalid ? currentTopic.data.valid : currentTopic.data.invalid;

  if (validData.length === 0) {
      validData = nextDataIsvalid ? currentTopic.data.invalid : currentTopic.data.valid;
      nextDataIsvalid = !nextDataIsvalid;
  }

  currentTopicData = { valid: nextDataIsvalid, index: 0, data: validData[0] };

  injectData();
}


 const launchNewOpponent = () => {

  if(!opponent){
    return;
  }

  pickNextPieceOfData();

  opponent.style.display = 'flex';

  running = true;

  const move = (character: HTMLElement, movementPerFrame: number) => {

    if(!opponent || !hero || topicOver){
        return;
    }

    let millisecondsBetweenFrames = Date.now() - lastFrameTimeStamp;

    lastFrameTimeStamp = Date.now();

    const currentCharacterLeft = character.offsetLeft;
    const newCharacterLeft = currentCharacterLeft + movementPerFrame;

    character.style.left = `${newCharacterLeft}px`;

    if(!running){
      return;
    }
    
    requestAnimationFrame(() => move(character, movementPerFrame));

  }

  move(opponent, -6.5);

  hero && move(hero, 6.5);

 }

window.onload = () => {

  running = true;

  //launchNewOpponent();

}

const isThereAcollision = (hero: HTMLElement | null, opponent: HTMLElement | null) : boolean => {

    if(!hero || !opponent){
        return false;
    }

    return opponent.offsetLeft <= (hero.offsetLeft + hero.offsetWidth);
}

const handleKey = (event) => {
  if(event.key === " "){
   attack();
  }
}

document.addEventListener("keydown", handleKey);

const attack = () => {

   opponentsOnScreen.forEach( (opponentOnScreen : HTMLElement | null) => {
      
    if( hero && opponentOnScreen && opponentOnScreen.offsetLeft - hero.offsetLeft < 250 ) {
        killOpponent(opponentOnScreen);
     } 
   });
  
}

const killOpponent = (opponent: HTMLElement) => {
  opponent.style.left = '80vw';
  running = false;
  //opponent_speed_multiplier*=2;
  //next_opponent_appearance_delay_in_ms-=200;

  //console.log(next_opponent_appearance_delay_in_ms);

  //if valid or invalid data => continue

  if(currentTopicData.valid){
    currentTopic.data.valid.splice(currentTopicData.index,1);
  } else {
    currentTopic.data.invalid.splice(currentTopicData.index,1);
  }

  clearData();

  setTimeout( launchNewOpponent, next_opponent_appearance_delay_in_ms);
  
}
