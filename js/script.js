console.log("lets write the javascript")


let currentSong = new Audio();
let songs;
let currfolder;

function formatSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // Pad both minutes and seconds to 2 digits
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins} : ${formattedSecs}`;
}

async function getsongs(folder) {
    currfolder = folder;
    let a= await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
            
        }
    }

        //Show all songs in the playlist
    let songUL = document.querySelector(".Songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="img/music.svg" alt="" srcset="">
                        <div class="info"> 
                            <div>
                              ${decodeURIComponent(song)}
                            </div>
                            <div>Gaurav</div>
                        
                        </div>
                        <span>
                            Play 
                            <img class=" sizeplay" src="img/play.svg" alt="" srcset="">
                        </span>
        </li>`
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".Songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    } )

    return songs
}

const playmusic = (track,pause=false)=>{
    let audio = new Audio(`/${currfolder}/` + track)
    currentSong.src = `/${currfolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

    
}

async function displayAlbums() {
    let a= await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            //Get the metadata of the folder
        let a= await fetch(`http://127.0.0.1:5500/${folder}/info.json`)
        let response = await a.json();
        console.log(response)
        cardContainer.innerHTML = cardContainer + `<div data-folder="${folder}" class="card">
                        <div class="play">
                             <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <!-- Green circular background -->
                              <circle cx="12" cy="12" r="12" fill="#00FF00" />

                              <!-- Black play icon (right-pointing triangle) -->
                              <polygon points="9,7 17,12 9,17" fill="#000000" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="" srcset="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    
    
}

async function main() {

    //Get the list of all the songs
    let songs = await getsongs("songs/ncs")
    playmusic(songs[0],true)
    console.log(songs)

    //Display all the albums on the page
    
    
    //Attach an event listner to play, next and previous
    play.addEventListener("click",()=>{
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
        
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML= `${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //Add an event listner to  seekbar
    document.querySelector(".seekbar"),addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })
    
    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"
    })
    
    //Add an event listener to previous 
    previous.addEventListener("click",()=>{
        currentSong.pause()
        console.log("previous clicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index-1) >= 0) {
            playmusic(songs[index-1])
        }
    })
    
    //Add an event listener to next
    nextsong.addEventListener("click",()=>{
        currentSong.pause()
        console.log("nextsong clicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index+1) < songs.length) {
            playmusic(songs[index+1])
        }
    })

    //Add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting volume to",e.target.value,"/ 100")
        currentSong.volume = parseInt(e.target.value)/100
    })
    }

     // Add an event listener to mute
    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.targer)
        console.log("changing",e.target.src)
        if (e.target.src.includes("volume.svg")) {
            e.target.src  = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = 1.0
          document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }
    })
  

    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click", async item =>{
            console.log(item,item.currentTarget.dataset)
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
    



main()