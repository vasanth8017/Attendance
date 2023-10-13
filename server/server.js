const express = require('express');
const http = require('http')
const socket =  require('socket.io')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv');
dotenv.config()

//MIDDILWARES
const app = express();
let server = http.createServer(app);
let io = socket(server);
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors())


const adminRoutes = require('./routes/adminRoutes')
const facultyRoutes = require('./routes/facultyRoutes')
const studentRoutes = require('./routes/studentRoutes')

//Passport Middleware
app.use(passport.initialize());

//Passport Config.
require('./config/passport')(passport)

app.use(morgan('dev'))

io.on('connection', (socket) => {
    socket.on('join room', ({room1, room2}) => {
        socket.join(room1)
        socket.join(room2)
    })
    socket.on("private message", (message) => {
        io.to(message.room).emit('new Message', {
            message: message.message,
            sender: message.sender
        });
   })
    socket.on('disconnect', function () {
        console.log('Socket disconnected');
    })
})




//ROUTES
app.use('/api/admin', adminRoutes)
app.use('/api/faculty', facultyRoutes)
app.use('/api/student', studentRoutes)




const PORT = process.env.PORT ;

mongoose.connect(process.env.MONGO_URL
, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true }).then(() => {
   
    console.log("Database Connected")
    console.log(" DB server Started")
}).catch((err) => {
    _response.database = "Unhealthy"
    console.log("Error in connecting to DataBase", err.message)
})


app.use("/", (req, res) => {
    res.json({ message: "Welcome to college attendance application." });
  });


server.listen(PORT, ()=>{
   console.log(`Server is running on port ${PORT}.`)
})

