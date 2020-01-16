const path=require("path")
const express=require("express")
const http=require("http")
const socketio=require("socket.io")
const Filter=require("bad-words")
const {getMessages,generateLocationMessage}=require("../src/utils/messages")
const {addUser,removeUser,getUser,getUsersInRoom}=require("../src/utils/users")

const app=express()
const server=http.createServer(app)
const io=socketio(server)


const port=process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
console.log(publicDirectoryPath)

app.use(express.static(publicDirectoryPath))

io.on("connection",(socket)=>{

    socket.on("join",(options,callback)=>{
        const {error,user}=addUser({id:socket.id,...options})
        if(error){
            return callback(error)
        }
        socket.join(user.room)

        console.log("New Websocket connection!")
        socket.emit("message",getMessages("Admin","Welcome!"))  
        
        socket.broadcast.to(user.room).emit("message",getMessages("Admin",`${user.username} has joined!`))
        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })


    socket.on("sendMessage",(message,callback)=>{
        const user=getUser(socket.id)
        // const filter=new Filter()

        // if(filter.isProfane(message)){
        //     return callback(getMessages(user.username,"Profanity is not is allowed!"))
        // }

        io.to(user.room).emit("message",getMessages(user.username,message))
        callback()
    })

    socket.on("disconnect",()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit("message",getMessages("Admin","A user has left!"))
            io.to(user.room).emit("roomData",{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }        
    })

    socket.on("sendLocation",(coords,callback)=>{
        const user=getUser(socket.id)
        const locationurl=`https://google.com/maps?q=${coords.lat},${coords.long}`
        io.to(user.room).emit("locationMessage",generateLocationMessage(user.username,locationurl))
        callback()
    })
})

server.listen(port,()=>{
    console.log("server up on port "+port)
})