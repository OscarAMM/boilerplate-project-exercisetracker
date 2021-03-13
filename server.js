const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

//database connections
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//database schema
let exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: {type:String, required:false}
});
let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [exerciseSchema]
});
//database model
let exercise = mongoose.model('exercise', exerciseSchema);
let user = mongoose.model('user', userSchema);
//x-form request
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
/**Process module**/
app.post('/api/exercise/new-user', function (req, res) {
  //this store at database from form
  let new_user = new user({
    username: req.body.username //gets the value from input form
  });
  new_user.save(function (error, savedUser) {
    if (!error) {
      res.json({
        username: savedUser.username,
        _id: savedUser.id
      });
    } else {
      return console.error(error);
    }
  });

});
//gets an array of all users
app.get('/api/exercise/users', function (req, res) {
  //this gets all the elements from database
  user.find({}, function (error, user_array) {
    if (!error) {
      res.json(user_array);
    } else {
      console.error(error);
    }
  });
});
//exercise addition fields 
app.post('/api/exercise/add', function (req, res) {
  let user_id = req.body.userId;
  let exercise_session = new exercise({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date:req.body.date,
  });
  if (exercise_session.date === '') {
    exercise_session.date = new Date().toISOString().substring(0,10);
  }
  user.findByIdAndUpdate(user_id, {$push: { log: exercise_session }}, { new: true }, function (error, userUpdated) {
    if(!error){
    res.json({
      _id:userUpdated.id,
      username: userUpdated.username,
      description: exercise_session.description,
      duration: exercise_session.duration,
      date: new Date(exercise_session.date).toDateString()
    });
  }else{
    console.error(error);
  }
  });
});
app.get('/api/exercise/log', function(req, res){
  let user_query_id = req.query.userId;
  user.findById(user_query_id, function(error, result){
    if(!error){
      res.json({
        _id: result.id,
        username: result.username,
        count: result.log.length,
        log: result.log
      });
    }else{
      console.error(error);
    }
  })
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
