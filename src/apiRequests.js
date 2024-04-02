let _accessToken;
const sessionURL = "https://chat.openai.com/api/auth/session";
const conversationURL = `https://chat.openai.com/backend-api/conversation/`;

function sleep(t) {
    return new Promise(r => setTimeout(r, t));
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

async function apiGetAccessToken() {
    return await fetch(sessionURL, {
        credentials: "include",
        referrer: "https://chat.openai.com/",
        method: "GET",
    })
    .then(res => res.json())
    .then(data => {
        _accessToken = data.accessToken;
    });
}

async function apiDeleteConversation(conversation_id) {
    return await fetch(conversationURL + conversation_id, {
        method: "PATCH",
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${_accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"is_visible": false}),
    })
    .then(res => res.json())
    .then(data => data.success === true);
}

async function deleteConversations() {
    // Get all "checked" conversations
    const selectedConversations = document.querySelectorAll(".custom-checkbox:checked");
    if (selectedConversations.length === 0) return;

    for (const checkboxElement of selectedConversations) {
        const conversationId = checkboxElement.nextElementSibling.pathname.replace("/c/", "");

        await apiDeleteConversation(conversationId);
        checkboxElement.parentElement.parentElement.style.display = "none";
    
        // Ratelimit
        console.log(`[${new Date().toLocaleTimeString()}]` , "sleeping");
        await sleep(getRandomArbitrary(2000, 8000));
    }
}
