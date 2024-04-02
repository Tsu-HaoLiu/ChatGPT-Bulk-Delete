function injectScript(src) {
    const s = document.createElement('script');
    const scriptURL = browser.runtime.getURL(src);
    s.onload = () => s.remove();
    s.src = scriptURL;
    (document.head || document.documentElement).appendChild(s);
}

window.addEventListener("load", () => {
    const checkInterval = setInterval(async () => {
        if (document.querySelector('[aria-label="Chat history"]')) {
            injectScript("./apiRequests.js");
            injectScript("./eventHandlers.js");
            clearInterval(checkInterval);
        }
    }, 1000);
});