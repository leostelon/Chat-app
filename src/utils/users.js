const users=[]

const addUser=({id,username,room})=>{

     username=username.trim().toLowerCase()
     room=room.trim().toLowerCase()

    if(!username || !room){
        return{
            error:"Please fill in the requires form!"
        }
    }

    const match=users.find((user)=>{
        return user.room===room && user.username===username
    })

    if(match){
        return{
            error:"username already taken in the current room!"
        }
    }

    const user={id,username,room}
    users.push(user)
    return {user}
}


const removeUser=(id)=>{
    const index=users.findIndex((user)=> user.id===id)

    if(index!==-1){
        return users.splice(index,1)[0]
    }
    console.log("user doesnt exist!")
}


const getUser=(id)=>{
    const user=users.find((element)=>element.id===id)
    if(!user){
        return {
            error:"No user found!"
        }
    }
    return user
}

const getUsersInRoom=(room)=>{  
    room=room.trim().toLowerCase()
    const usersInRoom=users.filter(element=>room===element.room)
    return {usersInRoom}
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}