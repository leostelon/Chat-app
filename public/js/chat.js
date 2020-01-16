const socket=io()

//Elements
const $messageForm=document.querySelector("#message-form")
const $messageFormInput=$messageForm.querySelector("input")
const $messageFormButton=$messageForm.querySelector("button")
const $sendLocationButton=document.querySelector("#send-location")
const $messages=document.querySelector("#messages")

//Templates
const $messageTemplate=document.querySelector("#message-template").innerHTML
const $locationMessageTemplate=document.querySelector("#location-template").innerHTML
const $sidebarTemplate=document.querySelector("#sidebar-template").innerHTML

//username and Room name
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

//Autoscroll
const autoscroll=()=>{
    //new Message element
    const $newMessage=$messages.lastElementChild

    //Height of new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight=$messages.offsetHeight

    //Height of messages container
    const containerHeight=$messages.scrollHeight

    //How far i have scrooled from bottom
    const scrollOffSet=$messages.scrollTop + visibleHeight

    if(containerHeight-newMessageHeight-2<=scrollOffSet){
        $messages.scrollTop=containerHeight
    }

}

socket.on("message",(message)=>{
    const html=Mustache.render($messageTemplate,{
        username:message.username,
        message:message.message,
        createdAt:moment(message.timestamp).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on("locationMessage",(message)=>{
    const html=Mustache.render($locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend",html)
    autoscroll()
})

socket.on("roomData",({room,users})=>{
    const html=Mustache.render($sidebarTemplate,{
        room,
        users:users.usersInRoom
    })
    document.querySelector("#sidebar").innerHTML=html
})

$messageForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute("disabled","disabled")

    const message=e.target.elements.message.value

    socket.emit("sendMessage",message,(error)=>{
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value=""
        $messageFormInput.focus()
        if(error){
            return socket.emit("sendMessage",error.message)
        }
        console.log("Message delivered!")
    })
})

$sendLocationButton.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("The browser doesnt support sharing location!")
    }
    $sendLocationButton.setAttribute("disabled","disabled")
    
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("sendLocation",{
            lat:position.coords.latitude,
            long:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute("disabled")
            console.log("Location shared!")
        })
    })
})

socket.emit("join",{username,room},(error)=>{
    if(error){
        alert(error)
    }
    location="/"
})