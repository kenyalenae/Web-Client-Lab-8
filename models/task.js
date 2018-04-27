var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// Define a schema - what fields will a Task document have?
var taskSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
    dateCreated: Date,
    dateCompleted: Date,

    /* A reference to the User object who created this task
    It is possible to populate this field with all of the
    details of the User object by using the populate() function */
    _creator: {type:ObjectId, ref:'User'}
});

// compile taskSchema description into a Mongoose model
// with the name 'Task'
var Task = mongoose.model('Task', taskSchema);

// export the Task model for use in the application
module.exports = Task;
