const mongoose = require("mongoose");

const {Palace, PalaceRoom, PalaceSlotData, PalaceTemplate, PalaceTemplateRoom, PalaceTemplateElement} = require('./db.js');

mongoose.connect('mongodb://localhost:27017/memory_soldier');

const db = mongoose.connection;

db.once('open', async () => {

 const castleTemplate = await PalaceTemplate.findOne({name: 'Castle'});

 const castleTemplateRoom1 = await PalaceTemplateRoom.findById(castleTemplate.rooms[0]);

 const castleTemplateRoom1elements = [];

 for(let i=0; i < castleTemplateRoom1.elements.length; i++){

  const element = await PalaceTemplateElement.findById(castleTemplateRoom1.elements[i]);
    
  castleTemplateRoom1elements.push(element);

 }

 const datesPalaces = await Palace.findOne({name: 'datesPalaces'});

 const room = await PalaceRoom.findById(datesPalaces.rooms[0]);

 const dataSlots = [];

  for(let i = 0; i < room.slotDataBlocks.length; i++){

    const slotDataBlock = room.slotDataBlocks[i];

    const slotData = await PalaceSlotData.findById(slotDataBlock);

    dataSlots.push(slotData);
  }


  const lookForSlot = async (elementObjectId) => {

    for(let i=0; i < dataSlots.length; i++){

       const slotDataDataB = dataSlots[i];

       if(slotDataDataB.element_id.toString() === elementObjectId){
        
        return slotDataDataB;
       }

    }

    return null;

  }


console.log("ok, we'll try to get the slot corresponding to the first element, being of type slot")

 console.log(castleTemplateRoom1elements[0].id);

 console.log(lookForSlot(castleTemplateRoom1elements[0].id));

});
