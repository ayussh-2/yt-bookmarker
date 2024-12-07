(() => {
    let ytLeftControls, ytPlayer;
    let currentVideo = "";
    let currentBookMarks = [];
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, videoId, value } = obj;
        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        }
    });

    const fetchBookMarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (result) => {
                resolve(
                    result[currentVideo] ? JSON.parse(result[currentVideo]) : []
                );
            });
        });
    };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists =
            document.getElementsByClassName("bookmark-btn")[0];

        currentBookMarks = await fetchBookMarks();

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Bookmark at this point?";

            ytLeftControls =
                document.getElementsByClassName("ytp-left-controls")[0];

            ytPlayer = document.getElementsByClassName("video-stream")[0];

            ytLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookMarkEventHandler);
        }
    };

    const addNewBookMarkEventHandler = async () => {
        const currentTime = ytPlayer.currentTime;
        const newBookMark = {
            time: currentTime,
            desc: "Bookmarked at " + getFormattedTime(currentTime),
        };

        console.log("Adding new bookmark", newBookMark);
        currentBookMarks = await fetchBookMarks();

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify(
                [...currentBookMarks, newBookMark].sort(
                    (a, b) => a.time - b.time
                )
            ),
        });
    };

    newVideoLoaded();
})();

getFormattedTime = (time) => {
    const date = new Date(0);
    date.setSeconds(time);
    return date.toISOString().substr(11, 8);
};
