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
  description: {type:String, required:true},
  duration: {type:Number, required:true},
  date: String
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
app.post('/api/exercise/new-user', function(req,res){
  //this store at database from form
  let new_user = new user({
    username: req.body.username //gets the value from input form
  });
  new_user.save(function(error, savedUser){
    if(!error){
      res.json({
        username: savedUser.username,
        _id: savedUser.id
      });
    }else{
      return console.error(error);
    }
  });
 
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
