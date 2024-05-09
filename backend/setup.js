const mongoose = require('mongoose');

const {PalaceTemplate, PalaceTemplateRoom, PalaceTemplateElement, Palace, PalaceRoom, PalaceSlotData} = require('./db');

// Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/memory_soldier';
mongoose.connect(mongoDB);

// Get the default connection
const db = mongoose.connection;


// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Bind connection to open event (to get notification of successful connection)
db.once('open', async function () {
   console.log("the db is opened");

   const {room1, castlePalaceTemplate} = await generateCastleTemplate();

   console.log(room1.elements)

   const datesPalaceRoom1 = await new PalaceRoom(
    {
      name: 'dpr1',
      slotDataBlocks: await generateCastleSlotsDataBlocks(room1.elements)
    }
   ).save();

   const datesPalace = await new Palace({
    name: 'datesPalaces',
    template_id: castlePalaceTemplate.id,
    rooms: [datesPalaceRoom1.id]
   }).save();
});

const generateCastleRoom1elements = async () => {

  const rooms = [];

  for(let i = 3; i < 14; i++ ){

    const element = new PalaceTemplateElement({
      type: 'Slot',
      coordinates: {
        x_tile: i,
        y_tile: 4,
      },
      size: {
        height_in_tile: 2,
        width_in_tile: 1,
      }

    }

    );

    await element.save();

    rooms.push(
      element.id
    )

  }

  return rooms;

}

const generateCastleTemplate = async () => {

  const room1 = await new PalaceTemplateRoom({
    elements: await generateCastleRoom1elements()
  }
  ).save();

  const castlePalaceTemplate = await new PalaceTemplate({
    name: 'Castle',
    rooms: [room1.id]
  }).save()

  return {room1, castlePalaceTemplate};
  
}

const generateCastleSlotsDataBlocks = (templateElements) => {
 
    const slotsDataBlocks = [];

    templateElements.forEach(async templateElement => {

      const slotData = await new PalaceSlotData(
        {
          element_id: templateElement,
          image: "none"
        }
      ).save();

      slotsDataBlocks.push(
        slotData.id
      )

    });

    return slotsDataBlocks;
}

