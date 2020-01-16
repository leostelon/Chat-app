const getMessages=(username,text)=>{
    return {
        username,
        message:text,
        timestamp:new Date().getTime()
    }
}

const generateLocationMessage=(username,url)=>{
    return {
        username,
        url,
        createdAt:new Date().getTime()
    }
}

module.exports={
    getMessages,
    generateLocationMessage
}