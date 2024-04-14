

type OpponentData = string;

class Opponent {
   data: OpponentData;
   element: HTMLElement;

   constructor(data: OpponentData){
     this.data = data;
     this.element = createOpponentElement();
   }
}


const createOpponentElement = () => {
  const element = document.createElement("div");
  element.classList.add("opponent");
  return element;
}


window.onload = () => {
  buildInjectAndlaunchNextOpponent();
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
  
}

const buildOpponent = (data: string) => {
  return new Opponent(data);
 }
