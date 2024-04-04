function injectScript(src) {
    const s = document.createElement('script');
    const scriptURL = browser.runtime.getURL(src);
    s.onload = () => s.remove();
    s.src = scriptURL;
    (document.head || document.documentElement).appendChild(s);
}

window.addEventListener("load", () => {
    injectScript("./src/apiRequests.js");
    injectScript("./src/eventHandlers.js");
    injectScript("./src/popupHandlers.js");
    document.querySelector(':root').style.setProperty("--custom-loading-icon", `url(${browser.runtime.getURL("icons/cat_loading_trans.png")})`)
});