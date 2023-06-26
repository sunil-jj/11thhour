const {Router}=require('express')
const { TodoModel } = require('../model/todo.model')

const todoRouter= Router()

todoRouter.get('/', async(req, res)=>{
    try {
        const {status, tag}=req.query;
        const alltodos={userID:req.body.userID}
        if(status){
         alltodos.status=status;
        }
        if(tag){
         alltodos.tag=tag;
        }
        const todos= await TodoModel.find (alltodos);
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json({ message: 'server error' })
    }
})
todoRouter.post('/create',   async(req, res)=>{
    try {
    const {taskname, status, tag, userID}=req.body;
  
    const freshtodo =new TodoModel({taskname, status, tag, userID})
        const ntodo= await freshtodo.save();
        res.send(ntodo)
    } catch (error) {
        res.send("error encountered")
    }
})

todoRouter.get('/:todoID', async(req, res)=>{
    try {
        const {todoID}=req.params;
        const {userID}= req.body;
        const todo= await TodoModel.findOne({_id:todoID, userID})
        if(!todo){
            return res.json({ message: 'no todos'})
        }else{
            res.status(200).json(todo);
        }
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
})

todoRouter.post('/delete/:todoID', async(req, res)=>{
    try {
        const { todoId } = req.params
        const {userID}= req.body;
        const todo= await TodoModel.findOne({_id:todoID, userID})
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
          }
        await todo.remove();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
})

todoRouter.patch('/update/:todoID', async(req, res)=>{
    try {
        const { todoId } = req.params;
        const { taskName, status, tag, userID } = req.body;
        const todo= await TodoModel.findOne({_id:todoID, userID})
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        todo.taskName = taskName || todo.taskName;
        todo.status = status || todo.status;
        todo.tag = tag || todo.tag;
        const updatedone = await todo.save();
        res.status(200).json(updatedone);   
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
    })


module.exports={todoRouter}