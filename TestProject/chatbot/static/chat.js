const messageForm = document.getElementById('message_form');
const msgInput = document.getElementById('msg_input');
const sendButton = document.getElementById('send_button');
const messages = document.querySelector('.messages');

// Function to append user message to chat
function appendUserMessage(messageText) {
    const messageLi = document.createElement('li');
    messageLi.classList.add('message', 'right', 'appeared');

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar');

    const textWrapperDiv = document.createElement('div');
    textWrapperDiv.classList.add('text_wrapper');

    const messageP = document.createElement('p');
    messageP.textContent = messageText;

    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    timestampDiv.textContent = new Date().toLocaleTimeString();

    textWrapperDiv.appendChild(messageP);
    textWrapperDiv.appendChild(timestampDiv);

    messageLi.appendChild(avatarDiv);
    messageLi.appendChild(textWrapperDiv);

    messages.appendChild(messageLi);

    // Clear input
    msgInput.value = '';

    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight;
}

// Function to append bot message to chat
function appendBotMessage(messageText) {
    const messageLi = document.createElement('li');
    messageLi.classList.add('message', 'left', 'appeared');

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar');

    const textWrapperDiv = document.createElement('div');
    textWrapperDiv.classList.add('text_wrapper');

    const messageP = document.createElement('p');
    messageP.textContent = messageText;

    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    timestampDiv.textContent = new Date().toLocaleTimeString();

    textWrapperDiv.appendChild(messageP);
    textWrapperDiv.appendChild(timestampDiv);

    messageLi.appendChild(avatarDiv);
    messageLi.appendChild(textWrapperDiv);

    messages.appendChild(messageLi);

    // Scroll to bottom
    messages.scrollTop = messages.scrollHeight;
}

// Function to send message to backend and get response
async function sendMessageToBot(userMessage) {
    try {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        const response = await fetch('/chatbot/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        if (response.ok) {
            appendBotMessage(data.bot_response);
        } else {
            appendBotMessage('Sorry, there was an error: ' + data.error);
        }
    } catch (error) {
        appendBotMessage('Sorry, I couldn\'t connect to the server. Please try again.');
        console.error('Error:', error);
    }
}

// Handle form submission
messageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const message = msgInput.value.trim();
    if (message) {
        appendUserMessage(message);
        sendMessageToBot(message);
    }
});

// Handle send button click
sendButton.addEventListener('click', function(event) {
    event.preventDefault();
    const message = msgInput.value.trim();
    if (message) {
        appendUserMessage(message);
        sendMessageToBot(message);
    }
});

// Handle Enter key press in input
msgInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const message = msgInput.value.trim();
        if (message) {
            appendUserMessage(message);
            sendMessageToBot(message);
        }
    }
});