var express = require('express');
var router = express.Router();
var Task = require('../models/task');

/* need to make sure user is logged in before doing tasks
* create a middleware function to check if user is logged in
* redirect to authentication page if not */

function isLoggedIn(req, res, next) {
    console.log('user is auth', req.user)
    if (req.isAuthenticated()) {
        res.locals.username = req.user.local.username;
        next();
    } else {
        res.redirect('/auth')
    }
}

/* this requires all routes in this file to use
* isLoggedIn middleware, but we dont need to specify it */
router.use(isLoggedIn);

/* GET home page, a list of incomplete tasks for the current user */
router.get('/', function(req, res, next) {
  Task.find({_creator:req.user, completed: false})
      .then( (docs) => {
        res.render('index', {title: 'Incomplete tasks', tasks: docs} );
      })
      .catch( (err) => {
        next(err);   // forward to the error handlers
      });
});

/* POST to create a new task */

router.post('/add', function(req, res, next){

  // check if something was entered in the text input
  if (!req.body || !req.body.text) {
      req.flash('error', 'Please enter some text');
      res.redirect('/');
  }
  else {
      // create new Task
      var t = new Task({_creator: req.user, text: req.body.text, completed: false})
      // save the task, and redirect to home page if successful
      t.save().then((newTask) => {
          console.log('The new task created is ', newTask); // just for debugging
          res.redirect('/'); // creates a GET request to '/' (homepage)
      }).catch(() => {
          next(err); // forward error to the error handlers
      });
  }

});

/* POST to mark a task as done. Task _id should be provided as req.body parameter*/

router.post('/done', function(req, res, next){

  Task.findByIdAndUpdate( {_id: req.body._id, _creator:req.user.id}, {completed: true})
      .then( (originalTask) => {
        // originalTask only has a value if a document with this _id was found
        if (!originalTask) {
            res.status(403).send('This is not your task!');
        }
        else {
            req.flash('info', originalTask.text + ' marked as done!');
            res.redirect('/'); // redirect to list of tasks
        }
      })
      .catch( (err) => {
        next(err); // to error handlers
      });
});

/* GET completed tasks */
router.get('/completed', function(req, res, next){

  Task.find( {creator: req.user._id, completed:true} )
      .then( (docs) => {
      res.render('completed_tasks', {tasks:docs});
      }).catch( (err) => {
        next(err);
      })

});

/* POST to delete a task. Task _id is in req.body */

router.post('/delete', function(req, res, next){

  Task.findByIdAndRemove({_id: req.body._id, _creator:req.user.id}, {completed:true})
      .then( (deletedTask) => {
        if (!deletedTask) {
            res.status(403).send('This is not your task!');
        }
        else {
            req.flash('info', 'Task deleted.');
            res.redirect('/');
        }
      })
      .catch( (err) => {
        next(err)
      })
});

/* POST mark all tasks as done */

router.post('/alldone', function(req, res, next){

  Task.updateMany({_creator:req.user, completed:false}, {completed: true}, {multi:true})
      .then( () => {
        req.flash('info', 'All tasks are done!');
        res.redirect('/'); // if preferred, redirect to /completed
      })
      .catch( (err) => {
        next(err);
      });
});

/* GET details about one task */
router.get('/task/:_id', function(req, res, next){

  Task.findById(req.params._id)
      .then( (doc) => {
        if (!doc) {
            res.status(404).send('Task not found.');
        }
        // verify this task was created by the currently logged in user
        else if (!doc._creator.equals(req.user._id)) {
            res.status(403).send('This is not your task!');
        }

        else {
            res.render('task', {task:doc})
        }
      })
      .catch( (err) => {
        next(err);
      });
});

/* POST delete all completed tasks */
router.post('/deleteDone', function (req, res, next) {

        Task.deleteMany({_creator:req.user}, {completed: true})
            .then( (deletedTask) => {
                if (deletedTask) {
                    res.redirect('/');
                } else {
                    var error = new Error('Task not found.')
                    error.status = 404;
                    next(error);
                }
            })
            .catch((err) => {
                next(err);
            })
});


module.exports = router;
