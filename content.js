
// Parse YT url
// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
async function youtube_parser(url){
    try {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    } catch (err) {
        console.error(err)
    }
}

async function getRating() {
    try {
        const url = window.location.href
        const videoId = await youtube_parser(url)
        const urlAPI = 'https://returnyoutubedislikeapi.com/votes?videoId=' + videoId
        const res = await fetch(urlAPI)
        const video = await res.json()
        const videoRating = video.likes / (video.likes + video.dislikes) * 10
        const rating = videoRating.toFixed(1)
        console.log('Video Rating: ' + rating)
        return rating
    } catch (err) {
        console.error(err)
    }
}

function addRating(rating, delay) {
    if(document.readyState !== 'complete') {
        console.log('Loading')
        window.addEventListener('load',setTimeout(() => changeShareTextToRating(rating), delay));
    } else {
        console.log('Complete')
        setTimeout(() => changeShareTextToRating(rating), delay) 
    }
}

function changeShareTextToRating(rating) {
    document.getElementsByClassName("style-scope ytd-button-renderer style-default size-default")[5].innerText = rating
}

async function runRating(delay) {
    const rating = await getRating()
    addRating(rating, delay)
}

// run Rating if YouTube
const domain = window.location.hostname 
if (domain == "www.youtube.com" || "www.youtu.be") runRating(1500)

// Event when window.location.href changes
// https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
var oldHref = document.location.href;
window.onload = function() {
    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                /* Changed ! your code here */
                runRating(500)
            }
        });
    });
    
    var config = {
        childList: true,
        subtree: true
    };
    
    observer.observe(bodyList, config);
};