const playButton = document.querySelector(".play_button");
const songSlider = document.querySelector(".song_slider");
const sliderWrapper = document.querySelector(".slider_wrapper");
const content = document.querySelectorAll(".content");
const songs = document.querySelectorAll(".song");
const currentTime = document.querySelector(".current_time");
const duration = document.querySelector(".duration");
const rightSwipe = document.querySelector(".right_swipe");
const leftSwipe = document.querySelector(".left_swipe");
const volumeSlider = document.querySelector(".volume_slider");
const volumeWrapper = document.querySelector(".volume_wrapper");
const outputVolume = document.querySelector(".volume");
const muteButton = document.querySelector(".mute_sound");
const songsList = document.querySelectorAll(".song_elem");
const menuButton = document.querySelector(".menu");
const lyrics = document.querySelectorAll(".lyrics");
const lyricsButton = document.querySelector(".lyrics_button");

let audio = songs[0];
let playState = "play";
let animationId = null;
let index = 0;

document.addEventListener("DOMContentLoaded", function () {
    editLyrics();
    showRangeProgressVolume(volumeSlider);
    rightSwipe.addEventListener("click", function(){
        lyrics[index].style.display = "none";
        songsList[index].style.color = "black";
        audio.pause();
        playButton.classList.add("clicked");
        playState = "play";
        if(index<songs.length-1){
            index ++;
        } else{
            index = 0;
        }
        audio = songs[index];
        content[index].style.display = "block";
        lyrics[index].style.display = "block";
        console.log(index);
        for(let i = 0; i<content.length; i++) {
            if(i!=index){
                content[i].style.display = "none";
                audio.currentTime = 0;
            }
        }
        songsList[index].style.color = "white";
        sliderWrapper.style.setProperty("--buffered-width", 0+ '%' )
        displayDuration();
        playButton.classList.remove("clicked");
        requestAnimationFrame(whilePlaying);
        audio.play();
        playState = "pause";
        setSliderMax();
        console.log(songSlider.max);
    })

    leftSwipe.addEventListener("click", function(){
        lyrics[index].style.display = "none";
        songsList[index].style.color = "black";
        audio.pause();
        playButton.classList.add("clicked");
        playState = "play";
        if(index>0){
            index --;
        } else{
            index = songs.length-1;
        }
        songsList[index].style.color = "white";
        audio = songs[index];
        content[index].style.display = "block";
        lyrics[index].style.display = "block";
        console.log(index);
        for(let i = 0; i<content.length; i++) {
            if(i!=index){
                content[i].style.display = "none";
                audio.currentTime = 0;
            }
        }
        sliderWrapper.style.setProperty("--buffered-width", 0+ '%' )
        displayDuration();
        playButton.classList.remove("clicked");
        requestAnimationFrame(whilePlaying);
        audio.play();
        setSliderMax();
        playState = "pause";
    })

    playButton.addEventListener("click", function(){
        if(playState === "pause"){
            playButton.classList.add("clicked");
            cancelAnimationFrame(animationId);
            audio.pause();
            playState = "play";
            console.log(calculateTime(audio.currentTime));
        } else {
            playButton.classList.remove("clicked");
            requestAnimationFrame(whilePlaying);
            audio.play();
            playState = "pause";
            console.log(calculateTime(audio.currentTime));
        }
    })

    songSlider.addEventListener("input", (e) => {
        showRangeProgress(e.target);
        currentTime.textContent = calculateTime(songSlider.value);
        if(!audio.paused) {
            cancelAnimationFrame(animationId);
        }
    });

    songSlider.addEventListener("change", () => {
        audio.currentTime = songSlider.value;
        console.log(calculateTime(songSlider.max));
        currentTime.textContent = calculateTime(songSlider.value);
        if(!audio.paused) {
            requestAnimationFrame(whilePlaying);
        }
    })

    if (audio.readyState > 0) {
        displayDuration();
        setSliderMax();
    } else {
        audio.addEventListener('loadedmetadata', () => {
            setSliderMax();
            displayDuration();
        });
    }

    volumeSlider.addEventListener("input", (e) => {
        showRangeProgressVolume(e.target);
        outputVolume.textContent = e.target.value;
        audio.volume = e.target.value/100;
    })

    muteButton.addEventListener("click", () => {
        if(muteButton.classList.contains("on")){
            muteButton.classList.remove("on");
            audio.muted = true;
        } else{
            muteButton.classList.add("on");
            audio.muted = false;
        }
    })

    for(let i = 0, j = 0; i <songsList.length, j<songs.length; i++,j++){
        if(songs[j].readyState>0){
            let elem = songsList[i].lastElementChild;
            console.log(elem);
            elem.textContent = calculateTime(songs[j].duration);
        } else {
            songs[j].addEventListener("loadedmetadata", function () {
                let elem = songsList[i].lastElementChild;
                console.log(elem);
                elem.textContent = calculateTime(songs[j].duration);
            })
        }
        songsList[i].addEventListener("click", () => {
            lyrics[index].style.display = "none";
            songsList[index].style.color = "black";
            songsList[i].style.color = "white";
            lyrics[i].style.display = "block";
            audio.pause();
            playButton.classList.add("clicked");
            playState = "play";
            index = i;
            audio = songs[index];
            content[index].style.display = "block";
            for(let i = 0; i<content.length; i++) {
                if(i!=index){
                    content[i].style.display = "none";
                    audio.currentTime = 0;
                }
            }
            sliderWrapper.style.setProperty("--buffered-width", 0+ '%' )
            displayDuration();
            playButton.classList.remove("clicked");
            requestAnimationFrame(whilePlaying);
            audio.play();
            playState = "pause";
            setSliderMax();
        })
    }

    menuButton.addEventListener("click", function(){
        if(menuButton.classList.contains("open")){
            menuButton.classList.remove("open");
            document.querySelector(".songs_container").style.transform = "scaleX(0)";
            document.querySelector(".songs_container").style.opacity = "0";
        } else{
            if(window.innerWidth<=1172){
                lyricsButton.classList.remove("open");
                document.querySelector(".lyrics_container").style.transform = "scaleX(0)";
                document.querySelector(".lyrics_container").style.opacity = "0";
            }
            menuButton.classList.add("open");
            if(window.innerWidth >= 1700){
                document.querySelector(".songs_container").style.transform = "scaleX(1)";
                document.querySelector(".songs_container").style.transform = "scale(1.5)";
            } else{
                document.querySelector(".songs_container").style.transform = "scaleX(1)";
            }
            document.querySelector(".songs_container").style.opacity = "1";
        }
    })
    
    lyricsButton.addEventListener("click", function(){
        if(lyricsButton.classList.contains("open")){
            lyricsButton.classList.remove("open");
            document.querySelector(".lyrics_container").style.transform = "scaleX(0)";
            document.querySelector(".lyrics_container").style.opacity = "0";
        } else{
            if(window.innerWidth<=1172){
                menuButton.classList.remove("open");
                document.querySelector(".songs_container").style.transform = "scaleX(0)";
                document.querySelector(".songs_container").style.opacity = "0";
            }
            lyricsButton.classList.add("open");
            if(window.innerWidth >= 1700){
                document.querySelector(".lyrics_container").style.transform = "scaleX(1)";
                document.querySelector(".lyrics_container").style.transform = "scale(1.5)";
            } else{
                document.querySelector(".lyrics_container").style.transform = "scaleX(1)";
            }
            document.querySelector(".lyrics_container").style.opacity = "1";
        }
    })

    window.addEventListener("resize", function(){
        if(this.window.innerWidth>=1700){
            if(document.querySelector(".lyrics_container").style.opacity === "1"){
                document.querySelector(".lyrics_container").style.transform = "scale(1.5)";
            }
            if(document.querySelector(".songs_container").style.opacity === "1"){
                document.querySelector(".songs_container").style.transform = "scale(1.5)";
            }
        } else{
            if(document.querySelector(".lyrics_container").style.opacity === "1"){
                document.querySelector(".lyrics_container").style.transform = "scale(1)";
            }
            if(document.querySelector(".songs_container").style.opacity === "1"){
                document.querySelector(".songs_container").style.transform = "scale(1)";
            }
        }
    })
})

const showRangeProgress = (rangeInput) => {
    sliderWrapper.style.setProperty("--buffered-width", rangeInput.value/ rangeInput.max * 100 + '%' )
}

const showRangeProgressVolume = (rangeInput) => {
    volumeWrapper.style.setProperty("--buffered-width", rangeInput.value/ rangeInput.max * 100 + '%' )
}

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    console.log("duration"+audio.duration);
    duration.textContent = calculateTime(audio.duration);
}

function whilePlaying() {
    songSlider.value = audio.currentTime;
    currentTime.textContent = calculateTime(songSlider.value);
    sliderWrapper.style.setProperty("--buffered-width", `${songSlider.value / songSlider.max * 100}%` )
    animationId = requestAnimationFrame(whilePlaying);
    if(audio.currentTime === audio.duration){
        lyrics[index].style.display = "none";
        songsList[index].style.color = "black";
        audio.pause();
        playButton.classList.add("clicked");
        playState = "play";
        if(index<songs.length-1){
            index ++;
        } else{
            index = 0;
        }
        audio = songs[index];
        content[index].style.display = "block";
        lyrics[index].style.display = "block";
        console.log(index);
        for(let i = 0; i<content.length; i++) {
            if(i!=index){
                content[i].style.display = "none";
                audio.currentTime = 0;
            }
        }
        songsList[index].style.color = "white";
        sliderWrapper.style.setProperty("--buffered-width", 0+ '%' )
        displayDuration();
        playButton.classList.remove("clicked");
        requestAnimationFrame(whilePlaying);
        audio.play();
        playState = "pause";
        setSliderMax();
        console.log(songSlider.max);
    }
}

const setSliderMax = () => {
    songSlider.max = Math.floor(audio.duration);
}

function editLyrics(){
    let result = [];
    for (let i = 0; i <lyrics.length; i++){
        result = lyrics[i].textContent.split("/n");
        console.log(result);
        result.join("\n<br>");
        lyrics[i].textContent = result;
    }
}