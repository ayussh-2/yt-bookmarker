import { getCurrentTab } from "./utils.js";

const addBookMark = async () => {};

const viewBookMark = (bookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";
    if (bookmarks.length === 0) {
        bookmarksElement.innerHTML = "<div class='title'>No Bookmarks</div>";
    } else {
        bookmarks.forEach((bookmark) => {
            console.log(bookmark);
        });
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    const queryParams = activeTab.url.split("?")[1];
    const urlParams = new URLSearchParams(queryParams);
    const currentVideo = urlParams.get("v");
    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (result) => {
            const currentVideoBookMarks = result[currentVideo]
                ? JSON.parse(result[currentVideo])
                : [];

            viewBookMark(currentVideoBookMarks);
        });
    } else {
        console.log("Not a youtube video");
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = "<div class='title'>Not a youtube video</div>";
    }
});
