window.onload = function (){
    const botSelectorBtnOWT = document.querySelector('#bot-openwebtext')
    const botSelectorBtnCD = document.querySelector('#bot-custom')
    const chatHeader = document.querySelector('.chat-header')
    const chatMessages = document.querySelector('.chat-messages')
    const chatInputForm = document.querySelector('.chat-input-form')
    const chatInput = document.querySelector('.chat-input')
    const botIconUrl = document.querySelector('.bot-icon-url')
    const humanIconUrl = document.querySelector('.human-icon-url')
    const newChatBtn = document.querySelector('#new-chat')
    const chatHistory = document.querySelector('.chat-history')

    const messages = JSON.parse(localStorage.getItem('messages')) || []
    const createChatMessageElement = (message) => `
        <div class="message ${message.sender === 'Bot' ? "gray-bg" : "blue-bg"}">
            <div class="messager-sender"><img src=${message.sender === 'Bot' ? botIconUrl : humanIconUrl} class="msg-img">${message.sender}</div>
            <div class="messager-text">${message.text}</div>
            <div class="messager-timestamp">${message.timestamp}</div>
        </div>
    `

    let classID = 10
    let newMessage =""
    let isNewMessage = true

    const createOldMessageElement = () => `
        <div class="old-message old-message-${classID}">
                        <button class="old-message-delete-button id="table-btn-delete"><i class="fa fa-trash icon"></i></button>
                        <button id="message-click-button">${newMessage}</button>
        </div>
    `

    messages.forEach((message) => {
        chatMessages.innerHTML += createChatMessageElement(message)
    }

    )

    let messageSender = "Bot"
    const updateMessageSender = (name, isOWT) =>{
        chatHeader.innerText = `${name}`
        if (isOWT) {
            botSelectorBtnOWT.classList.add('active-bot')
            botSelectorBtnCD.classList.remove('active-bot')
        }

        if (!isOWT) {
            botSelectorBtnCD.classList.add('active-bot')
            botSelectorBtnOWT.classList.remove('active-bot')
        }
        
        chatInput.focus()
    }

    botSelectorBtnOWT.onclick = () => updateMessageSender('Openwebtext GPT2 Chatbot', true)
    botSelectorBtnCD.onclick = () => updateMessageSender('Cusom dataset GPT2 Chatbot', false)

    const sendMessage = (e) => {
        e.preventDefault()

        const timestamp = new Date().toLocaleString('en-US', {hour: 'numeric', minute: 'numeric'})
        const message = {
            sender: messageSender,
            text: chatInput.value,
            timestamp
        }
        if (isNewMessage){
            classID +=1
            newMessage = message.text
            isNewMessage= false
            chatHistory.innerHTML +=createOldMessageElement()
            updateHistory()
        }
        messages.push(message)
        localStorage.setItem('messages', JSON.stringify(messages))
        chatMessages.innerHTML += createChatMessageElement(message)
        chatInputForm.reset()
        chatMessages.scrollTop = chatMessages.scrollHeight
    }

    chatInputForm.addEventListener('submit', sendMessage)

    newChatBtn.addEventListener('click', () => {
        localStorage.clear()
        isNewMessage=true
        chatMessages.innerHTML = ''
        for (var j = 0; j < chatHistory.children.length; j++) {
            let child = chatHistory.children[j]
            child.classList.remove("active-message")
        }
    }
    )

    const updateHistory = () => {
        for (var i = 0; i < chatHistory.children.length; i++) {
            let child = chatHistory.children[i]
            let oldMessageDeleteBtn = child.children[0]
            let oldMessageBtn = child.children[1]
            let classID = child.classList[1]
            oldMessageBtn.addEventListener('click',() => {
                child.classList.add("active-message")
                chatInput.focus()
                for (var j = 0; j < chatHistory.children.length; j++) {
                    let childCom = chatHistory.children[j]
                    if (!(classID === childCom.classList[1])){
                        childCom.classList.remove("active-message")
                    }
                }
    
                }
            )
    
            oldMessageDeleteBtn.addEventListener('click',() => {
                child.remove()
                }
            )
        }
    }

    updateHistory()
    
}