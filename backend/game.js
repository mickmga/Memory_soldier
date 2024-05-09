const mongoose = require("mongoose");

const {Palace, PalaceRoom} = require('./db.js');

mongoose.connect('mongodb://localhost:27017/memory_soldier');

const db = mongoose.connection;

db.once('open', async () => {
 const datesPalaces = await Palace.findOne({name: 'datesPalaces'});

 console.log("room >");

const room = await PalaceRoom.findById(datesPalaces.rooms[0]);

room.slotDataBlocks.forEach(
    
)

});

