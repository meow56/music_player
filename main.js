var fileSelect = document.getElementById("file_select");
var music = [];
var musicPlayed = [];
var setEve = true;
var pastMusic = music.slice();
var shuffle = true;
var currentIndex = 0;
var pastShuffle = true;
var skipBackIndex = 0;
var pausing = false;

var fileElem = document.getElementById("file_elem");

function submitFiles() {
  var newFiles = fileSelect.files;
  for(var i = 0; i < newFiles.length; i++) {
    music.push(newFiles[i]);
  }
  musicPlayed = [];
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function playMusic() {
  if(pastMusic.length !== music.length) {
    while(document.getElementById("music_list").firstChild !== null) {
      document.getElementById("music_list").removeChild(document.getElementById("music_list").firstChild);
    }
    for(var i = 0; i < music.length; i++) {
      var temp3 = music[i];
      if(temp3 !== undefined) {
        var temp6 = document.createElement("LI");
        var temp2 = document.createElement("BUTTON");
        var temp4 = temp3.name.split(".");
        for(var j = 0; j < temp4.length - 1; j++) {
          temp2.textContent += temp4[j];
        }
        temp6.id = music[i].name;
        temp2.onclick = function () {
          for(var i = 0; i < music.length; i++) {
            var temp = music[i].name.split(".");
            var temp2 = "";
            for(var j = 0; j < temp.length - 1; j++) {
              temp2 += temp[j];
            }
            if(temp2 === this.textContent) {
              actualPlayMusic(music[i]);
            }
          }
        };
        temp2.style.background = "#FFF";
        temp2.style.border = "none";
        temp6.appendChild(temp2);
        document.getElementById("music_list").appendChild(temp6);
      }
    }
    pastMusic = music.slice();
  }
  
  
  
  if(setEve) {
    fileElem.addEventListener("click", function (e) {
      if (fileSelect) {
        fileSelect.click();
      }
    }, false);
    setEve = false;
  }
  if(document.getElementById("current_music") !== null) {
    if(document.getElementById("current_music").ended) {
      pausing = document.getElementById("current_music").paused;
      if(musicPlayed.length === music.length) {
        musicPlayed = [];
      }
      var musicTemp = music.slice();
      for(var i = 0; i < musicPlayed.length; i++) {
        for(var j = 0; j < musicTemp.length; j++) {
          if(musicPlayed[i] === musicTemp[j]) {
            musicTemp.splice(j, 1);
          }
        }
      }
      if(skipBackIndex !== 0) {
        skipBackIndex++;
        var musicToPlay = musicPlayed[musicPlayed.length - 1 + skipBackIndex];
      } else if(shuffle) {
        var musicToPlay = musicTemp[random(0, musicTemp.length - 1)];
      } else {
        var musicToPlay = music[currentIndex++];
        if(currentIndex >= music.length) {
          currentIndex = 0;
        }
      }
      actualPlayMusic(musicToPlay);
      setTimeout(playMusic, 0);
    } else {
      setTimeout(playMusic, 0);
    }
  } else {
    if(music.length !== 0) {
      var musicTemp = music.slice();
      for(var i = 0; i < musicPlayed.length; i++) {
        for(var j = 0; j < musicTemp.length; j++) {
          if(musicPlayed[i] === musicTemp[j]) {
            musicTemp.splice(j, 1);
          }
        }
      }
      if(skipBackIndex !== 0) {
        skipBackIndex++;
        var musicToPlay = musicPlayed[musicPlayed.length - 1 + skipBackIndex];
      } else if(shuffle) {
        var musicToPlay = musicTemp[random(0, musicTemp.length - 1)];
      } else {
        var musicToPlay = music[currentIndex++];
        if(currentIndex >= music.length) {
          currentIndex = 0;
        }
      }
      actualPlayMusic(musicToPlay);
      setTimeout(playMusic, 0);
    } else {
      setTimeout(playMusic, 0);
    }
  }
}

playMusic();
updateThings();

function actualPlayMusic(musicToPlay) {
  if(document.getElementById("current_music") !== null) {
    document.getElementById("hud").removeChild(document.getElementById("current_music"));
    document.getElementById("hud").removeChild(document.getElementById("break_hud"));
    document.getElementById("hud").removeChild(document.getElementById("now_playing"));
  }
  var temp = document.createElement("AUDIO");
  try {
    temp.srcObject = musicToPlay;
  } catch (error) {
    temp.src = URL.createObjectURL(musicToPlay);
  }
  temp.controls = "true";
  temp.id = "current_music";
  temp.autoplay = "true";
  temp.textAlign = "center";
  if(pausing === true) {
    temp.pause();
  }
  musicPlayed.push(musicToPlay);
  document.getElementById("hud").appendChild(temp);
  var temp6 = document.createElement("BR");
  temp6.id = "break_hud"
  document.getElementById("hud").appendChild(temp6);
  var temp5 = document.createElement("PARAGRAPH");
  var temp4 = musicToPlay.name.split(".");
  temp5.id = "now_playing";
  temp5.innerHTML = "Now playing: \""
  for(var j = 0; j < temp4.length - 1; j++) {
    temp5.innerHTML += temp4[j];
  }
  temp5.innerHTML += "\"";
  temp5.textAlign = "center";
  document.getElementById("hud").appendChild(temp5);
  document.getElementById("time_seek").min = 0;
}

function playPause() {
  if(document.getElementById("current_music") !== null) {
    if(document.getElementById("current_music").paused) {
      document.getElementById("current_music").play();
      while(document.getElementById("play_button").firstChild !== null) {
        document.getElementById("play_button").removeChild(document.getElementById("play_button").firstChild);
      }
      var temp = document.createElement("IMG");
      temp.src = "images/pause.png";
      temp.alt = "Pause";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("play_button").appendChild(temp);
    } else {
      document.getElementById("current_music").pause();
      while(document.getElementById("play_button").firstChild !== null) {
        document.getElementById("play_button").removeChild(document.getElementById("play_button").firstChild);
      }
      var temp = document.createElement("IMG");
      temp.src = "images/play.png";
      temp.alt = "Play";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("play_button").appendChild(temp);
    }
  }
}

function updateThings() {
  if(document.getElementById("current_music") !== null) {
    document.getElementById("time_seek").max = document.getElementById("current_music").duration;
    document.getElementById("time_seek").value = document.getElementById("current_music").currentTime;
  }
  
  if(pastShuffle !== shuffle) {
    while(document.getElementById("shuffle").firstChild !== null) {
      document.getElementById("shuffle").removeChild(document.getElementById("shuffle").firstChild);
    }
    if(shuffle) {
      var temp = document.createElement("IMG");
      temp.src = "images/shuffle.png";
      temp.alt = "Shuffle on";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("shuffle").appendChild(temp);
    } else {
      var temp = document.createElement("IMG");
      temp.src = "images/no shuffle.png";
      temp.alt = "Shuffle off";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("shuffle").appendChild(temp);
    }
  }
  pastShuffle = shuffle;
  setTimeout(updateThings, 0);
}

function skipBack() {
  if(musicPlayed.length !== 0) {
    var temp = musicPlayed.length - 1;
    skipBackIndex--;
    if(musicPlayed[temp + skipBackIndex] !== null) {
      actualPlayMusic(musicPlayed[temp + skipBackIndex]);
    } else {
      skipBackIndex++;
    }
  }
}

document.getElementById("time_seek").oninput = function() {
  if(document.getElementById("current_music") !== null) {
    document.getElementById("current_music").currentTime = this.value;
  }
}

document.getElementById("volume").oninput = function() {
  if(document.getElementById("current_music") !== null) {
    document.getElementById("current_music").volume = this.value;
  }
}

window.onscroll = function() {HUDStick()};

var header = document.getElementById("hud");

var sticky = header.offsetTop;

function HUDStick() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
