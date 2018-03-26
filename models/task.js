var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

// Define a schema - what fields will a Task document have?
var taskSchema = new Schema({
    text: String,
    completed: Boolean
});

// compile taskSchema description into a Mongoose model
// with the name 'Task'
var Task = mongoose.model('Task', taskSchema);

// export the Task model for use in the application
module.exports = Task;
