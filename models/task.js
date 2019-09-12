let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    taskID : Number,
    taskName : String,
    assignedTo : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'developer'

    },
    dueDate : Date,
    taskStatus : String,
    taskDesc: String
})

let taskModel = mongoose.model('task',taskSchema)

module.exports = taskModel ;