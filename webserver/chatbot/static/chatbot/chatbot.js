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
    
    let newMessage = ""
    let isNewMessage = true
    let isOWTGPT = true
    let gptOwtUrlAPI = baseURL + "gpt2owt/"
    let gptCdUrlAPI = baseURL + "gpt2cd/"
    let getHistoryAPI = baseURL + "gethistory/"
    let delHistoryAPI = baseURL + "delhistory/"

    const createOldMessageElement = () => `
        <div class="old-message old-message-${messageID}">
                        <button class="old-message-delete-button id="table-btn-delete"><i class="fa fa-trash icon"></i></button>
                        <button id="message-click-button">${newMessage}</button>
        </div>
    `

    messages.forEach((message) => {
        chatMessages.innerHTML += createChatMessageElement(message)
    }

    )

    const updateMessageSender = (name, isOWT) =>{
        chatHeader.innerText = `${name}`
        if (isOWT) {
            isOWTGPT = true
            botSelectorBtnOWT.classList.add('active-bot')
            botSelectorBtnCD.classList.remove('active-bot')
        }

        if (!isOWT) {
            isOWTGPT = false
            botSelectorBtnCD.classList.add('active-bot')
            botSelectorBtnOWT.classList.remove('active-bot')
        }
        isNewMessage=true
        chatMessages.innerHTML = ''
        for (var j = 0; j < chatHistory.children.length; j++) {
            let child = chatHistory.children[j]
            child.classList.remove("active-message")
        }
        chatInput.focus()
    }

    botSelectorBtnOWT.onclick = () => updateMessageSender('Openwebtext GPT2 Chatbot', true)
    botSelectorBtnCD.onclick = () => updateMessageSender('Cusom dataset GPT2 Chatbot', false)

    // Default
    updateMessageSender('Openwebtext GPT2 Chatbot', true)

    const sendMessage = (e) => {
        e.preventDefault()

        const timestamp = new Date().toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false})
        const message = {
            sender: "Human",
            text: chatInput.value,
            timestamp
        }
        if (isNewMessage){
            messageID +=1
            newMessage = message.text
            isNewMessage= false
            chatHistory.innerHTML +=createOldMessageElement()
            updateHistory()

            let classID = `old-message-${messageID}`
            let child = document.querySelector(`.${classID}`)
            child.classList.add("active-message")
            for (var j = 0; j < chatHistory.children.length; j++) {
                let childCom = chatHistory.children[j]
                if (!(classID === childCom.classList[1])){
                    childCom.classList.remove("active-message")
                }
            }
        }
        messages.push(message)
        localStorage.setItem('messages', JSON.stringify(messages))
        chatMessages.innerHTML += createChatMessageElement(message)
        let urlAPI = isOWTGPT ? gptOwtUrlAPI : gptCdUrlAPI
        $.ajax({
            type: "POST",
            url: urlAPI,   
            data: {csrfmiddlewaretoken: csrfToken,
                    'messageID': `old-message-${messageID}`,
                    'sender': "Human",
                    'message': chatInput.value,
                    'timestamp': timestamp,
            },  
            success:  function(response){

                let botResponse = $.parseJSON(response);
                const botMessage = {
                    sender: "Bot",
                    text: botResponse["text"],
                    timestamp: botResponse["timestamp"],
                }
                chatMessages.innerHTML += createChatMessageElement(botMessage)
                chatMessages.scrollTop = chatMessages.scrollHeight
            }
        });

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
            let messageID = child.classList[1]
            oldMessageBtn.addEventListener('click',() => {
                child.classList.add("active-message")
                chatInput.focus()
                for (var j = 0; j < chatHistory.children.length; j++) {
                    let childCom = chatHistory.children[j]
                    if (!(messageID === childCom.classList[1])){
                        childCom.classList.remove("active-message")
                    }
                }

                chatMessages.innerHTML = ''
                $.ajax({
                    type: "POST",
                    url: getHistoryAPI,   
                    data: {csrfmiddlewaretoken: csrfToken,
                            'messageID': child.classList[1]},  
                    success:  function(response){
                        let oldMessages = $.parseJSON(response)['history'];
                        for (var j = 0; j < oldMessages.length; j++) {
                              let oldMessage = oldMessages[j]
                              chatMessages.innerHTML += createChatMessageElement(oldMessage)
                          }
                         
                        chatMessages.scrollTop = chatMessages.scrollHeight
                    }
                });
    
                }
            )
    
            oldMessageDeleteBtn.addEventListener('click',() => {
              if (child.classList.length === 3){
                  chatMessages.innerHTML = ''
                }
                $.ajax({
                    type: "POST",
                    url: delHistoryAPI,   
                    data: {csrfmiddlewaretoken: csrfToken,
                            'messageID': child.classList[1]},  
                    success:  function(response){
                       console.log(response) 
                    }
                });
                child.remove()

                }
            )
        }
    }

    updateHistory()
    
}
