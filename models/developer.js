let mongoose = require('mongoose');

let devSchema = mongoose.Schema({
    name: {
        firstName: {
            type : String,
            required: true
        },
        LastName: String
    },

    level: {
        type : String,
        validate: {
            validator: function(levelInput){
                return levelInput === "BEGINNER" || levelInput === "EXPERT"
            },
            message: "Level should only be beginner or expert"

        },
        required: true
    },
    address:{
        state: String,
        suburb : String,
        street : String,
        unit : String
    }
})

let devModel = mongoose.model('developer',devSchema)

module.exports = devModel;