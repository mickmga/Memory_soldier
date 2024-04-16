type OpponentData = string;

class Opponent {
   data: OpponentData;
   element: HTMLElement;

   constructor(data: OpponentData){
     this.data = data;
     this.element = createOpponentElement();
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

  removeOpponentAtIndex(index: number) {
      if (index >= 0 && index < this.opponents.length) {
          this.opponents.splice(index, 1);
      } else {
          console.error("Invalid index provided for removing opponent.");
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


const LEFT_TO_RIGHT_MOVEMENT = new Movement(DIRECTIONS.LEFT, 2 );
const RIGHT_TO_LEFT_MOVEMENT = new Movement(DIRECTIONS.LEFT, -2 );

var animateCharacterCount = 0;
var currentHeroImgSuffix = 0;

var hero =  document.getElementById("hero")!!;
var heroImg = document.getElementById("heroImg") as HTMLImageElement;


const createOpponentElement = () => {
  const element = document.createElement("div");
  element.classList.add("opponent");
  return element;
}


window.onload = () => {
  buildInjectAndlaunchNextOpponent();
  animateCharacter();
  moveHero(LEFT_TO_RIGHT_MOVEMENT);
}

const buildInjectAndlaunchNextOpponent = () => { 
  //build
  const opponent = buildOpponent("data");
  //inject
  injectOpponent(opponent);
  //launch

  triggerOpponentMovement(opponent);
}

const launchNextOpponent = () => {
  const opponent = getNextOpponent();
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
}

const getNextOpponentData = (): string => {
  return "data";
}

const triggerOpponentMovement = (opponent: Opponent) => {
  updateCharacterPosition(opponent.element, RIGHT_TO_LEFT_MOVEMENT);

  requestAnimationFrame(() => triggerOpponentMovement(opponent));
}

const buildOpponent = (data: string) => {
  return new Opponent(data);
 }

 
const animateCharacter = () => {
  if(animateCharacterCount < 15){
   animateCharacterCount++;
   requestAnimationFrame(animateCharacter);
   return;
  }

  animateCharacterCount=0;

  if(currentHeroImgSuffix === 8) {
   currentHeroImgSuffix = 1;
  } else {
   currentHeroImgSuffix++;
  }

  heroImg.src = `assets/hero/hero${currentHeroImgSuffix}.png`;

  requestAnimationFrame(animateCharacter);
}

const updateCharacterPosition = (character: Character, movement: Movement) => {
  let characterPosition = character[`offset${movement.direction.charAt(0).toUpperCase()}${movement.direction.slice(1)}`];
  character.style[movement.direction] = `${characterPosition + movement.value}px`;
}

const moveHero = (movement: Movement) => {

  if(hero.offsetLeft >= window.innerWidth/2 || hero.offsetLeft <= 0){
    movement.value*=-1
  }

  updateCharacterPosition(hero, movement);

  requestAnimationFrame(() => moveHero(movement));

}

