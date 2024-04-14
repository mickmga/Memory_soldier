
export class Topic {
    constructor(name:string, data: TopicData){
      this.name = name;
      this.data = data; 
    }
    name: string;
    data: TopicData;
  }
  
  
 export class TopicData {
    constructor(valid:  Array<string>, invalid: Array<string>){
      this.valid = valid;
      this.invalid = invalid; 
    }
      valid: Array<string>;
      invalid: Array<string>;
  }
  
  