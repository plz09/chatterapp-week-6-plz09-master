/* start the external action and say hello */
console.log("App is alive");

let channels = [];
let messages = [];

/** create global variable for the currently selected channel */
let selectedChannel;

// Functions to execute when DOM has loaded
function init(){
    console.log("App is initialized")
    getChannels();
    getMessages();
    loadMessagesIntoChannel();
    displayChannels();
    loadEmojis();
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('emoticon-button').addEventListener('click', toggleEmojiArea);
    document.getElementById('close-emoticon-button').addEventListener('click', toggleEmojiArea);
}

//---------------- Channels-----------------------------------

// get existing channels from mock file or database
function getChannels() {
    channels = mockChannels;
}

// get existing messages from mock file or database
function getMessages() {
    messages = mockMessages;
}

// load existing messages into respective channel
function loadMessagesIntoChannel() {
    channels.forEach(channel => {
        messages.forEach(message => {
            if (message.channel === channel.id) {
                channel.messages.push(message)
            }
        })
    })
}

// display channels in channel area 
function displayChannels() {
    const favoriteList = document.getElementById('favorite-channels');
    const regularList = document.getElementById('regular-channels');
    favoriteList.innerHTML = "";
    regularList.innerHTML = "";
    channels.forEach(channel => {
        const currentChannelHtmlString = `  <li id="` + channel.id + `" onclick="switchChannel(this.id)">
                                                <i class="material-icons">group</i>
                                                <span class="channel-name">` + channel.name + `</span>
                                                <span class="timestamp">` + channel.latestMessage + `</span>
                                            </li>`
        if (channel.favorite) {
            favoriteList.innerHTML += currentChannelHtmlString;
        } else {
            regularList.innerHTML += currentChannelHtmlString;
        }
    })
}

/** 
 * Switches channel 
 * @param {string} selectedChannelID - ID of channel to switch to.
 */
function switchChannel(selectedChannelID) {
    console.log("selected channel with id: " + selectedChannelID);
    if (!!selectedChannel) {
        document.getElementById(selectedChannel.id).classList.remove("selected");
    }
    document.getElementById(selectedChannelID).classList.add("selected")
    channels.forEach(channel => {
        if (channel.id === selectedChannelID) {
            selectedChannel = channel;
        }
    })
    // hide user prompt and show input area the first time a user selects a channel
    if (!!document.getElementById("select-channel")) {
        document.getElementById("select-channel").style.display = "none";
        document.getElementById("input-area").style.display = "flex";
        document.getElementById("message-area-header").style.display = "flex";
    }
    showHeader();
    showMessages();
}

// changes header name and favorite button
function showHeader() {
    document.getElementById("message-area-header").getElementsByTagName('h1')[0].innerHTML = selectedChannel.name;
    document.getElementById('favorite-button').innerHTML = (selectedChannel.favorite) ? "favorite" : "favorite_border";
}

//---------------- Messages-----------------------------------

/** 
 * Message Constructor Function
 * @param {string} user - Name of sender.
 * @param {boolean} own - Own (outgoing) message or incoming.
 * @param {string} text - Message text.
 * @param {string} channelID - ID of channel in which message is sent.
 */
function Message(user, own, text, channelID) {
    this.createdBy = user;
    this.createdOn = new Date(Date.now());
    this.own = own;
    this.text = text;
    this.channel = channelID;
}

//EventListener to send messages
document.getElementById('send-button').addEventListener('click', sendMessage);

// Check if input is provided, send message, and clear input. Return if not.
function sendMessage() {
    const text = document.getElementById('message-input').value;
    if (!!text) {
        const myUserName = "Basti";
        const own = true;
        const channelID = selectedChannel.id;
        const message = new Message(myUserName, own, text, channelID)
        console.log("New message: ", message);
        selectedChannel.messages.push(message);
        document.getElementById('message-input').value = '';
        showMessages();
        displayChannels();
    } else {
        return
    }
}

// Show the messages of the selected channel
function showMessages() {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = ""
    selectedChannel.messages.forEach(message => {
        const messageTime = message.createdOn.toLocaleTimeString("de-DE", {
            hour: "numeric",
            minute: "numeric"
        });
        let currentMessageHtmlString;
        if (message.own) {
            currentMessageHtmlString = `<div class="message outgoing-message">
                                            <div class="message-wrapper">
                                                <div class="message-content">
                                                    <p>` + message.text + `</p>
                                                </div>
                                                <i class="material-icons">account_circle</i>
                                            </div>
                                            <span class="timestamp">` + messageTime + `</span>
                                        </div>`;
        } else {
            currentMessageHtmlString = `<div class="message incoming-message">
                                            <div class="message-wrapper">
                                                <i class="material-icons">account_circle</i>
                                                <div class="message-content">
                                                    <h3>` + message.createdBy + `</h3>
                                                    <p>` + message.text + `</p>
                                                </div>
                                            </div>
                                            <span class="timestamp">` + messageTime + `</span>
                                        </div>`;
        }
        chatArea.innerHTML += currentMessageHtmlString;
    })
}

// --------------------- Emojis ----------------------------

// load emojis into div
function loadEmojis() {
    for (let i = 0; i < emojis.length; i++) {
        document.getElementById("emoji-list").innerHTML += `<span class="button">` + emojis[i] + `</span>`
    }
    const emojisInArea = document.getElementById('emoji-list').childNodes
    for (let i = 0; i < emojisInArea.length; i++) {
        emojisInArea[i].addEventListener('click', function () {
            document.getElementById('message-input').value += this.innerHTML;
            document.getElementById('send-button').style.color = "#00838f";
        });
    }
}

document.getElementById('emoticon-button').addEventListener('click', toggleEmojiArea);
document.getElementById('close-emoticon-button').addEventListener('click', toggleEmojiArea);

function toggleEmojiArea() {
    const emojiArea = document.getElementById('emoji-area');
    const chatArea = document.getElementById('chat-area');
    emojiArea.classList.toggle('toggle-area');
    chatArea.style.height = (emojiArea.classList.contains('toggle-area')) ? "calc(100vh - 132px - 250px)" : "calc(100vh - 132px)";
    chatArea.scrollTop = chatArea.scrollHeight;
}

