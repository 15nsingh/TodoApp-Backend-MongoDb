const express = require('express')
const {Todo, User} = require("./db.js")
const app = express()
app.use(express.json())
const jwt = require("jsonwebtoken")
const { default: mongoose } = require('mongoose')
const JWT_SECRET = "yoyoyohoneysingh"

const bcrypt = require('bcrypt');
const saltRounds = 10;

mongoose.connect("<mongodb url>")

app.post('/signup', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;

  const hashedPassword = await bcrypt.hash(password,saltRounds)

  await User.insertOne({
    username: username,
    password: hashedPassword, // this automatically stores the salt too!!
    name: name
  })

  res.json({message: "you are now Signed Up"})

})

app.post('/signin', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const response = await User.findOne({
    username: username
  })

  if(!response){
    res.status(403).json({
      message: "User doesnot exist"
    })
  }

  const passwordMatch = await bcrypt.compare(password,response.password)

  if(passwordMatch){
    const token = jwt.sign({
      id: response._id
    }, JWT_SECRET)
    res.json({
      token: token
    })
  }else{
    res.status(403).json({
      message: "Incorrect email or password"
    })
  }
  // const user_login_check = await User.findOne({
  //   username: username,
  //   password: password
  // })

  // console.log(user_login_check)

//   if(user_login_check){
//     const token = jwt.sign({
//       id: user_login_check._id
//     }, JWT_SECRET)
//     res.json({
//       token: token
//     })
//   }else{
//     res.status(403).json({
//       message: "Incorrect email or password"
//     })
//   }
})

const auth = (req,res,next) => {
  const token = req.headers.token
  const decodedData = jwt.verify(token , JWT_SECRET)
  if(decodedData){
    req.id = decodedData.id
    next()
  }else{
    res.status(403).json({
      message: "Incorrect Credentials"
    })
  }
}

app.post('/todo', auth, async(req, res) => {
  const id = req.id
  const description = req.body.description

  await Todo.insertOne({
    userId: id,
    description: description
  })
  res.json({
    message: "Todo added",
    todo: description
  })
})

app.get('/todos', auth, async(req, res) => {
  const id = req.id;
  const todo_list = await Todo.find({
    userId: id
  })
  if(todo_list){
    res.json({
      todo_list
    })
  }else{
      res.json({
        message: "No todos found"
      })
    }
})



app.listen(3000)