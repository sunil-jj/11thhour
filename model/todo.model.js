const mongoose= require('mongoose')

const todoSchema= new mongoose.Schema({
    taskname :String,
    status :String,
    tag :String,
    userID:{type:String, required:true},
})
const TodoModel= mongoose.model("todo", todoSchema)
module.exports={TodoModel}