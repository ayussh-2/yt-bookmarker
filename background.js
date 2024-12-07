chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(tab.url.split("?")[1]);
        console.log(urlParams);
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParams.get("v"),
        });
    }
});
