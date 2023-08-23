console.log("Shabaaz Functionality");


const backToTop = document.getElementById("backToTop");
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
})



const mainHeading = document.getElementById("mainHeading");
const gridContainer = document.getElementById("gridContainer");
const playHandler = document.getElementById("playHandler");
const forwardHandler = document.getElementById("forwardHandler");
const progressBar = document.getElementById("myProgressBar");
const volumeBar = document.getElementById("myVolumeBar");
const currentSongImage = document.getElementById("currentSongImage");
const currentSongTitle = document.getElementById("currentSongTitle");
const currentSongArtist = document.getElementById("currentSongArtist");
const audio = new Audio();
let currentSongIndex = 0;
let jsonDataFilePath = './trending.json';

const handleAPI = async () => {

    const listContainer = document.getElementById("listContainer");
    mainHeading.innerText = "Trending Songs !!!"
    listContainer.addEventListener('click', async (event) => {
        const clickedItem = event.target;
        if (clickedItem.tagName === 'A') {
            const clickedItemId = clickedItem.id;
            mainHeading.innerText = clickedItem.innerText;

            switch (clickedItemId) {
                case 'trending':
                    jsonDataFilePath = './trending.json';
                    break;
                case 'top':
                    jsonDataFilePath = './top.json';
                    break;
                case 'viral':
                    jsonDataFilePath = './viral.json';
                    break;
                case 'remix':
                    jsonDataFilePath = './remix.json';
                    break;
                case 'melodious':
                    jsonDataFilePath = './melodious.json';
                    break;
                default:
            }

            // Open a new tab with the updated jsonDataFilePath
            const newTab = window.open(jsonDataFilePath, '_blank');
            // Close the new tab if it couldn't be opened
            if (!newTab) {
                alert('Please allow pop-ups for this site to open the content in a new tab.');
            }
        }
    });

    async function fetchDataAndHandle(filePath) {
        try {
            const response = await fetch(filePath);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    playHandler.classList.add("ri-play-fill");
    try {

        const result = await fetchDataAndHandle(jsonDataFilePath);
        // console.log(jsonDataFilePath)
        // const response = await fetch(jsonDataFilePath);
        // const result = await response.json();
        console.log(result);
        function loadAndPlaySong(index) {
            audio.src = result[index].url;
            audio.play();
        }
        let currentlyPlayingGridItem = null;
        result.forEach((song, index) => {
            let gridItem = document.createElement("div");
            gridItem.className = "grid-item";

            let img = document.createElement("img");
            img.src = song.artwork;
            img.alt = song.title;
            gridItem.appendChild(img);

            let title = document.createElement("p");
            title.textContent = song.title;
            gridItem.appendChild(title);

            let artist = document.createElement("p");
            artist.className = "artistName"
            artist.textContent = song.artist;
            gridItem.appendChild(artist);

            let playButtonCard = document.createElement("button");
            playButtonCard.id = "changeButton";
            playButtonCard.className = "controlBtn";
            playButtonCard.innerHTML = '<i class="ri-play-fill"></i>';

            gridItem.appendChild(playButtonCard);

            gridItem.addEventListener("click", () => {
                playHandler.classList.remove("ri-play-fill");
                playHandler.classList.add("ri-pause-fill");
                if (currentlyPlayingGridItem === gridItem) {
                    if (audio.paused) {
                        audio.play();
                        playButtonCard.innerHTML = '<i class="ri-pause-fill"></i>';
                        playHandler.classList.remove("ri-play-fill");
                        playHandler.classList.add("ri-pause-fill");

                    } else {
                        audio.pause();
                        playButtonCard.innerHTML = '<i class="ri-play-fill"></i>';
                        playHandler.classList.remove("ri-pause-fill");
                        playHandler.classList.add("ri-play-fill");

                    }
                } else {
                    if (currentlyPlayingGridItem !== null) {
                        const prevPlayButtonCard = currentlyPlayingGridItem.querySelector(".controlBtn");
                        prevPlayButtonCard.innerHTML = '<i class="ri-play-fill"></i>';
                    }

                    currentlyPlayingGridItem = gridItem;
                    loadAndPlaySong(index);
                    playButtonCard.innerHTML = '<i class="ri-pause-fill"></i>';
                }
                updateCurrentSongInfo(song);
            });

            gridContainer.appendChild(gridItem);
        });


        loadAndPlaySong(currentSongIndex);

        function updateCurrentSongInfo(song) {
            currentSongTitle.textContent = song.title;
            const artistName = `${song.artist} <span><img src="Images/music2.gif" alt=""></span>`
            currentSongArtist.innerHTML = artistName;
            currentSongImage.src = song.artwork;
        }

        playHandler.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                playHandler.classList.remove("ri-play-fill");
                playHandler.classList.add("ri-pause-fill");
                updateCurrentSongInfo(result[currentSongIndex]);
            } else {
                audio.pause();
                playHandler.classList.remove("ri-pause-fill");
                playHandler.classList.add("ri-play-fill");
            }
        });


        forwardHandler.addEventListener("click", () => {
            if (currentSongIndex < result.length - 1) {
                currentSongIndex++;
                loadAndPlaySong(currentSongIndex);
                updateCurrentSongInfo(result[currentSongIndex]);
            }
        });

        backwardHandler.addEventListener("click", () => {
            if (currentSongIndex > 0) {
                currentSongIndex--;
                loadAndPlaySong(currentSongIndex);
                updateCurrentSongInfo(result[currentSongIndex]);
            }
        });

        audio.addEventListener("timeupdate", () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress;
        });

        progressBar.addEventListener("input", () => {
            const seekValue = progressBar.value;
            const seekTime = (seekValue / 100) * audio.duration;
            audio.currentTime = seekTime;
        });

        volumeBar.addEventListener("input", () => {
            audio.volume = volumeBar.value / 100;
        });


    } catch (error) {
        console.error(error);
    }

}
handleAPI();



