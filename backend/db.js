const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define PalaceTemplate schema
const PalaceTemplateSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  name: String,
  rooms: [{
    type: Schema.Types.ObjectId,
    ref: 'PalaceTemplateRoomSchema'
  }]
});

const PalaceTemplateRoomSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },

    elements: [{
      type: Schema.Types.ObjectId,
      ref: 'PalaceTemplateElementSchema'
     }
    ],
  }
);



const PalaceRoomSchema = new Schema({

   _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
   },
   name:String,
   slotDataBlocks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PalaceSlotDataSchema'
    }
   ]

})

// Define PalaceSession schema
const PalaceSessionSchema = new Schema({
  name: String,
  currentRoomIndex: Number,
  rooms: [
    {
      slots: [{
        palace_slot_id: {
          type: Schema.Types.ObjectId,
          ref: 'PalaceTemplate.rooms.slots'
        },
        found: Boolean
      }]
    }
  ]

});

// Define Palace schema
const PalaceSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  name: String,
  template_id: {
    type: Schema.Types.ObjectId,
    ref: 'PalaceTemplateSchema'
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PalaceRoomSchema'
    }
  ]
});


const PalaceTemplateElementSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    coordinates: {
      x_tile: String,
      y_tile: String,
    },
    size: {
      height_in_tile: String,
      width_in_tile: String,
    }
  }
);

const PalaceSlotDataSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    element_id: {
      type: Schema.Types.ObjectId,
      ref: 'PalaceTemplateElementSchema'
    },
    image: String
    }
);


const PalaceTemplate = mongoose.model('PalaceTemplate', PalaceTemplateSchema);
const PalaceTemplateRoom = mongoose.model('PalaceTemplateRoom', PalaceTemplateRoomSchema);
const PalaceTemplateElement = mongoose.model('PalaceTemplateElement', PalaceTemplateElementSchema);
const PalaceSlotData = mongoose.model('PalaceSlotData', PalaceSlotDataSchema);
const Palace = mongoose.model('Palace', PalaceSchema);
const PalaceRoom = mongoose.model('PalaceRoom', PalaceRoomSchema);

module.exports = {PalaceTemplate, PalaceTemplateRoom, PalaceTemplateElement, Palace, PalaceRoom, PalaceSlotData};