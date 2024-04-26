interface ICharacter {
  animate(): void;
  updatePosition(movement: IMovement): void;
  checkForMiddleScreenReaching?(): boolean;
  checkForLeftLimitReaching?(): boolean;
}

interface IMovement {
  direction: DIRECTIONS;
  value: number;
}

interface ICollidable {
  checkCollision(): boolean;
}

interface IAnswer {
  value: string;
  isCorrect(): boolean;
}

enum DIRECTIONS {
  LEFT = "left",
  RIGHT = "right"
}

enum ANSWER_TYPE {
  RIGHT,
  WRONG
}

class ReduxStore {
  private themes: Theme[] = [];
  public inGameTheme: Theme;

  constructor() {
    this.inGameTheme = this.getCapitalsTheme();
  }

  addTheme(theme: Theme): void {
    this.themes.push(theme);
  }

  private getCapitalsTheme(): Theme {
    let goodAnswers = [new Answer("Paris", ANSWER_TYPE.RIGHT), new Answer("London", ANSWER_TYPE.RIGHT)];
    let badAnswers = [new Answer("Chicago", ANSWER_TYPE.WRONG), new Answer("Monaco", ANSWER_TYPE.WRONG)];
    const capitalsTheme = new Theme("capitals", goodAnswers, badAnswers);
    this.addTheme(capitalsTheme);
    return capitalsTheme;
  }
}

class Opponent implements ICharacter, ICollidable {
  private animationTimeout: number | null = null;
  private animateOpponentCount: number = 0;
  private currentFrame: number = 9;
  private initialMovementValue: number;

  constructor(
    private _data: IAnswer,
    private _element: HTMLElement,
    private imgElement: HTMLImageElement,
    private index: number,
    public movement: Movement = RIGHT_TO_LEFT_MOVEMENT
  ) {
    this._element.appendChild(this.imgElement);
    this.initialMovementValue = movement.value;
  }

  get data(): IAnswer {
    return this._data;
  }

  get element(): HTMLElement {
    return this._element;
  }

  animate(): void {
    const animateOpponent = () => {
      if (this.animateOpponentCount < 5) {
        this.animateOpponentCount++;
        requestAnimationFrame(animateOpponent);
        return;
      }

      this.animateOpponentCount = 0;

      if (this.currentFrame === 1) {
        this.currentFrame = 9;
      } else {
        this.currentFrame--;
      }

      this.imgElement.src = `assets/opponents/wolf_run_${this.currentFrame}.png`;

      requestAnimationFrame(animateOpponent);
    };

    animateOpponent();
  }

  resetMovement(): void {
    this.movement.value = this.initialMovementValue;
  }

  clearTimeout(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }
  }

  updatePosition(movement: IMovement): void {
    let position = this.element.offsetLeft;
    this._element.style.left = `${position + movement.value}px`;
  }

  checkCollision(): boolean {
    return this._element.offsetLeft < HERO_HIT_POINT.offsetLeft;
  }

  increaseSpeed(increase: number): void {
    this.movement.value -= increase;
  }
} 

class Hero implements ICharacter {
  private animateCharacterCount: number = 0;
  private currentHeroImgSuffix: number = 0;

  constructor(
    private heroImg: HTMLImageElement,
    private hero: HTMLElement
  ) { }

  animate(): void {
    const animateCharacter = () => {
      if (this.animateCharacterCount < 15) {
        this.animateCharacterCount++;
        requestAnimationFrame(animateCharacter);
        return;
      }

      this.animateCharacterCount = 0;

      if (this.currentHeroImgSuffix === 8) {
        this.currentHeroImgSuffix = 1;
      } else {
        this.currentHeroImgSuffix++;
      }

      this.heroImg.src = `assets/hero/hero${this.currentHeroImgSuffix}.png`;

      requestAnimationFrame(animateCharacter);
    };

    animateCharacter();
  }

  updatePosition(movement: IMovement): void {
    let characterPosition = this.hero.offsetLeft;
    this.hero.style[movement.direction] = `${characterPosition + movement.value}px`;
  }

  checkForMiddleScreenReaching(): boolean {
    return this.hero.offsetLeft >= window.innerWidth / 3;
  }

  checkForLeftLimitReaching(): boolean {
    return this.hero.offsetLeft <= 0;
  }

  heroHits(opponentsOnScreen: OpponentsOnScreen): void {

    for(let i=0; i < opponentsOnScreen.opponents.length; i++){
      
      let opponent = opponentsOnScreen.opponents[i];
      
      if(opponent.element.offsetLeft < HERO_HIT_POINT.offsetLeft + HERO_HIT_POINT.offsetWidth){

        if(opponent.data.isCorrect()){
          alert("Congratulations! You properly killed an opponent");
        } else {
          alert("You made a mistake! You should not have killed that one !");   
        }

      
       }
    }    
  }
}

class Movement implements IMovement {
  constructor(public direction: DIRECTIONS, public value: number) {}
}

class Answer implements IAnswer {
  constructor(public value: string, private answerType: ANSWER_TYPE) {}

  isCorrect(): boolean {
    return this.answerType === ANSWER_TYPE.RIGHT;
  }
}

class Theme {
  constructor(
    public name: string,
    public goodAnswers: Answer[],
    public badAnswers: Answer[]
  ) {}
}

class OpponentsOnScreen {
  private _opponents: Opponent[] = [];

  get opponents(): Opponent[] {
    return this._opponents;
  }

  addOpponent(opponent: Opponent): void {
    this._opponents.push(opponent);
  }

  removeOpponent(opponent: Opponent): void {
    const index = this._opponents.indexOf(opponent);
    if (index !== -1) {
      this._opponents.splice(index, 1);
      opponent.clearTimeout();
      opponent.element.remove();
    }
  }

  getOpponentAtIndex(index: number): Opponent | undefined {
    return this._opponents[index];
  }
}

function createOpponentElement(): HTMLElement {
  const element = document.createElement("div");
  element.classList.add("opponent");
  return element;
}

class Game {
  private hero: Hero;
  private opponentsOnScreen: OpponentsOnScreen;
  private backgroundMovement: number = 0;

  constructor(
    private reduxStore: ReduxStore,
    private dataContainer: HTMLElement,
    private HERO_HIT_POINT: HTMLElement
  ) { }

  init(): void {
    this.hero = new Hero(document.getElementById("heroImg") as HTMLImageElement, document.getElementById("hero") as HTMLElement);
    this.opponentsOnScreen = new OpponentsOnScreen();
    this.buildInjectAndLaunchNextOpponent();
    this.hero.animate();
    this.moveHero(LEFT_TO_RIGHT_MOVEMENT);
    this.animateOpponents();

    document.addEventListener("keydown", (event: KeyboardEvent) => 
      {
        if (event.key === " ") {
          this.hero.heroHits(this.opponentsOnScreen);
        }
      })
   
  }

  buildInjectAndLaunchNextOpponent(): void {
    const opponent = this.getNextOpponent();
    this.injectOpponent(opponent);
    opponent.animate();
    this.triggerOpponentMovement(opponent);
  }

  getNextOpponent(): Opponent {
    const data = this.getNextOpponentData();
    return new Opponent(data, createOpponentElement(), document.createElement('img'), this.opponentsOnScreen.opponents.length - 1, RIGHT_TO_LEFT_MOVEMENT);
  }

  getNextOpponentData(): IAnswer {
    const theme = this.reduxStore.inGameTheme;
    return this.pickRandomAnswer(theme);
  }

  injectOpponent(opponent: Opponent): void {
    this.dataContainer.innerHTML = opponent.data.value;
    const opponentElement = document.createElement("div");
    opponentElement.classList.add("opponent");

    document.body.append(opponent.element);

    this.opponentsOnScreen.addOpponent(opponent);
  }

  triggerOpponentMovement(opponent: Opponent): void {
    const updateMovement = () => {
      opponent.updatePosition(opponent.movement);

      if (opponent.checkCollision() && opponent.data.isCorrect()) {
        //this.opponentsOnScreen.removeOpponent(opponent);
        //return;
      }

      requestAnimationFrame(updateMovement);
      
    };

    updateMovement();
  }

  moveHero(movement: Movement): void {
    if (this.hero.checkForMiddleScreenReaching()) {
      movement.value *= -1;
      const opponentSpeedIncrease = Math.abs(movement.value) + Math.abs(this.backgroundMovement);
      for (const opponent of this.opponentsOnScreen.opponents) {
        opponent.increaseSpeed(opponentSpeedIncrease);
      }
    }
    
    // If hero reaches left limit, reverse the movement
    if (this.hero.checkForLeftLimitReaching()) {
      movement.value *= -1;
      // Also update the background movement
      this.backgroundMovement = movement.value;
      for (const opponent of this.opponentsOnScreen.opponents) {
        opponent.resetMovement();
      }
    }

    this.hero.updatePosition(movement);

    requestAnimationFrame(() => this.moveHero(movement));
    
  }

  animateOpponents(): void {
    for (const opponent of this.opponentsOnScreen.opponents) {
      opponent.animate();
    }
  }

  pickRandomAnswer(theme: Theme): IAnswer {
    const randomValue = Math.random();
    const pool = randomValue < 0.5 ? theme.goodAnswers : theme.badAnswers;
    const otherPool = randomValue < 0.5 ? theme.badAnswers : theme.goodAnswers;

    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const pickedAnswer = pool.splice(randomIndex, 1)[0];
      return pickedAnswer;
    } else if (otherPool.length > 0) {
      return this.pickRandomAnswer(theme);
    } else {
      console.error("No answers available in the theme");
      return new Answer("No answer available", ANSWER_TYPE.WRONG);
    }
  }
}

const LEFT_TO_RIGHT_MOVEMENT = new Movement(DIRECTIONS.LEFT, 2);
const RIGHT_TO_LEFT_MOVEMENT = new Movement(DIRECTIONS.LEFT, -2);

const HERO_HIT_POINT = document.getElementById("hero") as HTMLElement;

const reduxStore = new ReduxStore();
const dataContainer = document.getElementById("data") as HTMLElement;

const game = new Game(reduxStore, dataContainer, HERO_HIT_POINT);
game.init();
