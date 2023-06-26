const express= require('express')
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken') 
require('dotenv').config()



const {connection}=require("./config/db")
const{todoRouter}=require("./routes/todo.routes")
const {authenticate}=require("./middlewear/authentication")
const{UserModel}=require("./model/user.model")







/* app.use(authenticate) */
/* app.use("/todo",todocontroller) */
const app = express()
app.use(express.json())
app.get('/', (req, res)=>{
    res.send("basic end point")
})
app.post('/signup', (req, res)=>{
    const {email, password, name , age}=req.body
    bcrypt.hash(password, 10, async function(err, hash_password) {
       if(err){
        res.send("this is from bcrypt")
       }
        const new_user=new UserModel({
            email, password:hash_password,
        })
        await new_user.save()
        res.send("signup successfully")
        
    });
})

app.post('/login', async(req, res)=>{
    const {email, password}=req.body
    const user=await UserModel.findOne({email})
    if(!user){
        return res.send("please signup")
    }
    const hash= user.password
    bcrypt.compare(password, hash, function(err, data) {
        if(err){
            res.send('this is from login error')
        }
        if(data){
            var token = jwt.sign({ userID : user._id }, process.env.JWT_SECRET);
            res.json({"msg":"login success", "token": token})
        }else{
            res.json("login failed")
        }
    })
    
})

app.use('/todos',authenticate, todoRouter)




app.listen(process.env.PORT, async()=>{
    try {
        await connection()
        console.log("connect to db successfully")
    } catch (error) {
        console.log("db is not connect")
    }
    console.log(`listening at port ${process.env.PORT}`)
})
