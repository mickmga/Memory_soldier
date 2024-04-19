type OpponentData = string;

class Opponent {
  data: OpponentData;
  element: HTMLElement;
  index: number;
  imgElement: HTMLImageElement; // Add imgElement property

  constructor(data: OpponentData, index: number) {
    this.data = data;
    this.element = createOpponentElement();
    this.index = index;
    this.imgElement = document.createElement('img'); // Create img element
    this.imgElement.classList.add('opponentImg'); // Add class to img element
    this.element.appendChild(this.imgElement); // Append img element to opponent element
  }


  private animationTimeout: number | null = null; // Store timeout ID

  animate(frames: number, interval: number) {
    let currentFrame = frames;
  
    let animateOpponentCount = 0;
  

    const animateOpponent = () => {

      console.log("animating")

      if(animateOpponentCount < 5){
        animateOpponentCount++;
        requestAnimationFrame(animateOpponent);
        return;
      }

      animateOpponentCount=0;
    
      if(currentFrame === frames) {
        currentFrame = 1;
      } else {
        currentFrame++;
      }
    
      this.imgElement.src = `assets/opponents/wolf_run_${currentFrame}.png`;
    
      requestAnimationFrame(animateOpponent);
    }

    animateOpponent();
  }

  clearTimeout() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout); // Clear the timeout when opponent is removed
      this.animationTimeout = null; // Reset the timeout variable
    }
  }
}


enum DIRECTIONS {
  LEFT="left" ,
  RIGHT="right" 
}

class Movement {
  direction: DIRECTIONS;
  value: number;

  constructor(direction: DIRECTIONS, value: number){
    this.direction = direction;
    this.value = value;
  }
}

class OpponentsOnScreen {
  opponents: Opponent[];

  constructor() {
      this.opponents = [];
  }

  addOpponent(opponent: Opponent) {
      this.opponents.push(opponent);
  }

  removeOpponent(opponent: Opponent) {
      const index = this.opponents.indexOf(opponent);
      if (index !== -1) {
          this.opponents.splice(index, 1);
          opponent.element.remove();
      }
  }

  getOpponentAtIndex(index: number): Opponent | undefined {
      if (index >= 0 && index < this.opponents.length) {
          return this.opponents[index];
      } else {
          console.error("Invalid index provided for getting opponent.");
          return undefined;
      }
  }
}


type Character = HTMLElement;

type Answer = string;

class Theme {
  name: string;
  goodAnswers: Array<Answer>;
  badAnswers: Array<Answer>;

  constructor(name: string, goodAnswers: Array<Answer>, badAnswers: Array<Answer>){
    this.name = name;
    this.goodAnswers = goodAnswers;
    this.badAnswers = badAnswers;
  }
}

class ReduxStore {
  themes: Array<Theme>;
  inGameTheme: Theme;
}

const collectThemes = () => {

}


const LEFT_TO_RIGHT_MOVEMENT = new Movement(DIRECTIONS.LEFT, 2);
const RIGHT_TO_LEFT_MOVEMENT = new Movement(DIRECTIONS.LEFT, -2);

const ELEMENTS_REFERENCE_POINT = 'left';

const HERO_HIT_POINT = document.getElementById("hero")!!;

var animateCharacterCount = 0;

var currentHeroImgSuffix = 0;

var hero =  document.getElementById("hero")!!;
var heroImg = document.getElementById("heroImg") as HTMLImageElement;

var opponentsOnScreen: OpponentsOnScreen;

var animationPrePaused = false;
var animationPaused = false;

var additionalCameraSpeed = 0;

var reduxStore = new ReduxStore();

const pauseAnimation = () => {
   animateCharacterCount=0;
   animationPrePaused = true;
};

const resumeAnimation = () => {
   animationPrePaused = false;
   animationPaused = false;
   animateCharacter(heroImg);
   moveHero(LEFT_TO_RIGHT_MOVEMENT);
};

const initOpponentsOnScreen = () => {
  opponentsOnScreen = new OpponentsOnScreen();
}


const createOpponentElement = () => {
  const element = document.createElement("div");
  element.classList.add("opponent");
  return element;
}

const setKeyPressListener = () => {
  
// Function to execute when space key is pressed
const handleSpaceKeyPress = (event: KeyboardEvent) => {
  if (event.key === " ") {
    heroHits();
  }
}

// Attach event listener to the document
document.addEventListener("keydown", handleSpaceKeyPress);

}


window.onload = () => {
  initOpponentsOnScreen();
  setKeyPressListener();
  buildInjectAndlaunchNextOpponent();
  animateCharacter(heroImg);
  moveHero(LEFT_TO_RIGHT_MOVEMENT);

  reduxStore.themes.push(getCapitalsTheme());
  reduxStore.inGameTheme = Object.create(Object.getPrototypeOf(this.themes[0]));

}

const getCapitalsTheme = () => {

  let goodAnswers = ["Paris", "London"];
  let badAnswers = ["Monaco", "Chicago"];

  return new Theme("capitals", goodAnswers, badAnswers);
}

const buildInjectAndlaunchNextOpponent = () => { 
  //build
  const opponent = buildOpponent(getNextOpponentData());
  //inject
  injectOpponent(opponent);
  //launch
  opponent.animate(9, 500); // 9 frames, 100ms interval between frames
  triggerOpponentMovement(opponent);
}

const getNextOpponent = () => {
    const data = getNextOpponentData();
    const opponent = buildOpponent(data);
    injectOpponent(opponent);
    return opponent;
}

const injectOpponent = (opponent: Opponent) => {
   document.body.append(opponent.element);
   opponentsOnScreen.addOpponent(opponent);
}

const getNextOpponentData = (): string => {
  return "data";
}

const triggerOpponentMovement = (opponent: Opponent) => {

  updateCharacterPosition(opponent.element, new Movement(DIRECTIONS.LEFT, -2 - additionalCameraSpeed));

  if (opponent.element.offsetLeft <= 0) {
    opponentsOnScreen.removeOpponent(opponent);
    return; // Stop the animation if opponent is removed
}

  requestAnimationFrame(() => triggerOpponentMovement(opponent));
}

const buildOpponent = (data: string) => {
  return new Opponent(data, opponentsOnScreen.opponents.length - 1);
 }

 
const animateCharacter = (character: Character) => {

  if(animationPrePaused){
    animationPaused=true;
    console.log("returning")
    return;
  }

  if(animateCharacterCount < 15){
    animateCharacterCount++;
    requestAnimationFrame(() => animateCharacter(character));
    return;
  }

  animateCharacterCount=0;

  if(currentHeroImgSuffix === 8) {
   currentHeroImgSuffix = 1;
  } else {
   currentHeroImgSuffix++;
  }

  heroImg.src = `assets/hero/hero${currentHeroImgSuffix}.png`;

  requestAnimationFrame(() => animateCharacter(character));

}

const updateCharacterPosition = (character: Character, movement: Movement) => {
  let characterPosition = character.offsetLeft;
  character.style[movement.direction] = `${characterPosition + movement.value}px`;
}

const moveHero = (movement: Movement) => {

  if(animationPrePaused){
    animationPaused=true;
    return;
  }

  if(hero.offsetLeft >= window.innerWidth/2){
    movement.value*=-1;
    additionalCameraSpeed=4;
  }

  if(hero.offsetLeft <= 0){
    movement.value*=-1;
    additionalCameraSpeed=0;
  }

  updateCharacterPosition(hero, movement);

  requestAnimationFrame(() => moveHero(movement));
}

const heroHits = () => {

  attackAnimation();

   for(let i=0; i < opponentsOnScreen.opponents.length; i++){
     let opponent = opponentsOnScreen.opponents[i]; 
    if(opponent.element.offsetLeft < HERO_HIT_POINT.offsetLeft + HERO_HIT_POINT.offsetWidth){
      opponentsOnScreen.removeOpponent(opponent); // Clear opponent from the list and DOM
      i--; // Adjust index after removing opponent
      setTimeout(buildInjectAndlaunchNextOpponent, 3000);
    }
   }
}

const attackAnimation = () => {
  let attackFrame = 1;
  pauseAnimation();

  const animateAttack = () => {
     if (attackFrame <= 4) {
        heroImg.src = `assets/hero/hero_attack_${attackFrame}.png`;
        attackFrame++;
        requestAnimationFrame(animateAttack);
     } else {
      resumeAnimation();
    }
  }

  animateAttack();
}




const pickRandomAnswer = (theme: Theme, levelOver: () => void): any => {
  const randomValue = Math.random(); // Random value between 0 and 1

  let pool: any[];
  let otherPool: any[];

  if (randomValue < 0.5) {
      pool = theme.goodAnswers;
      otherPool = theme.badAnswers;
  } else {
      pool = theme.badAnswers;
      otherPool = theme.goodAnswers;
  }

  const pickFromPool = () => {
      if (pool.length > 0) {
          const randomIndex = Math.floor(Math.random() * pool.length);
          const pickedAnswer = pool.splice(randomIndex, 1)[0]; // Remove the picked answer from the pool
          console.log("Rendered answer:", pickedAnswer);
          return pickedAnswer;
      } else if (otherPool.length > 0) {
          // If current pool is empty, try picking from the other pool
          return pickRandomAnswer(theme, levelOver);
      } else {
          // If both pools are empty, execute levelOver()
          levelOver();
          return null; // Or any other value to indicate no answer available
      }
  };

  return pickFromPool();
};