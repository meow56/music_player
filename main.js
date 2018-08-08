var fileSelect = document.getElementById("file_select");
var music = [];
var musicPlayed = [];
var setEve = true;
var pastMusic = music.slice();
var shuffle = true;
var currentIndex = 0;
var pastShuffle = true;
var skipBackIndex = 0;
var inThePast = false;
var totalMusicPlayed = [];
var pauseded = false;

var fileElem = document.getElementById("file_elem");

function submitFiles() {
  var newFiles = fileSelect.files;
  for(var i = 0; i < newFiles.length; i++) {
    music.push(newFiles[i]);
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function playMusic(skipForwardBypass) {
  if(pastMusic.length !== music.length) { // check for an updated music list, indicating an update to the shown list
    while(document.getElementById("music_list").firstChild !== null) {
      document.getElementById("music_list").removeChild(document.getElementById("music_list").firstChild); // remove them all
    }
    if(music.length === 0) {
      var temp = document.createElement("LI");
      temp.textContent = "Nothing.";
      document.getElementById("music_list").appendChild(temp);
    }
    for(var i = 0; i < music.length; i++) {
      var temp3 = music[i];
      if(temp3 !== undefined) { // wait, why do i have this again?
        var temp6 = document.createElement("LI"); // list head
        var temp2 = document.createElement("BUTTON"); // button for music select
        var temp4 = temp3.name.split("."); // split by period
        for(var j = 0; j < temp4.length - 1; j++) {
          temp2.textContent += temp4[j]; // add all the text back, but ignore the file type (ie mp3, wav, ogg)
        }
        temp6.id = music[i].name;
        temp6.draggable = true;
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
        temp2.style.background = "rgba(255, 255, 255, 0)";
        temp2.style.border = "none";
        temp2.style.width = "95%";
        temp6.appendChild(temp2);
        var temp7 = document.createElement("BUTTON");
        temp7.textContent = "X"
        temp7.id = "remove_";
        for(var j = 0; j < temp4.length - 1; j++) {
          temp7.id += temp4[j]; // reused!
        }
        temp7.onclick = function() {
          for(var i = 0; i < music.length; i++) {
            var temp = music[i].name.split(".");
            var temp2 = "remove_";
            for(var j = 0; j < temp.length - 1; j++) {
              temp2 += temp[j];
            }
            if(temp2 === this.id) {
              var temp3 = i;
            }
          }
          if(document.getElementById("current_music") !== null) {
            var temp = music[temp3].name.split(".");
            var temp2 = "Now playing: \"";
            for(var j = 0; j < temp.length - 1; j++) {
              temp2 += temp[j];
            }
            temp2 += "\"";
            if(temp2 === document.getElementById("now_playing").textContent) {
              playMusic(true);
            }
          }
          music.splice(temp3, 1);
        }
        temp7.style.background = "#FF0000";
        temp7.style.border = "none";
        temp7.style.float = "right";
        temp7.style.color = "#250000";
        temp7.style.width = "5%";
        temp6.appendChild(temp7);
        var temp8 = document.createElement("DIV"); // div for dragging stuff
        temp8.ondragover = function(event) {
          event.preventDefault();
        };
        temp8.ondrop = function(event) {
          event.preventDefault();
          document.getElementById("music_list").insertBefore(dragged, event);
        };
        temp8.class = "droparea";
        temp6.appendChild(temp8);
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
  
  if((document.getElementById("current_music") !== null || skipForwardBypass) && music.length !== 0) {
    if(document.getElementById("current_music").ended || skipForwardBypass) {
      inThePast = (skipBackIndex !== 0);
      if(musicPlayed.length >= music.length && !inThePast) {
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
        var musicToPlay = totalMusicPlayed[totalMusicPlayed.length - 1 + skipBackIndex];
      } else if(shuffle) {
        var musicToPlay = musicTemp[random(0, musicTemp.length - 1)];
      } else {
        var musicToPlay = music[currentIndex++];
        if(currentIndex >= music.length) {
          currentIndex = 0;
        }
      }
      actualPlayMusic(musicToPlay);
      setTimeout(playMusic, 0, false);
    } else {
      setTimeout(playMusic, 0, false);
    }
  } else if((document.getElementById("current_music") !== null || skipForwardBypass) && music.length === 0) {
    document.getElementById("hud").removeChild(document.getElementById("current_music"));
    document.getElementById("hud").removeChild(document.getElementById("break_hud"));
    document.getElementById("hud").removeChild(document.getElementById("now_playing"));
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
        var musicToPlay = totalMusicPlayed[totalMusicPlayed.length - 1 + skipBackIndex];
      } else if(shuffle) {
        var musicToPlay = musicTemp[random(0, musicTemp.length - 1)];
      } else {
        var musicToPlay = music[currentIndex++];
        if(currentIndex >= music.length) {
          currentIndex = 0;
        }
      }
      actualPlayMusic(musicToPlay);
      setTimeout(playMusic, 0, false);
    } else {
      setTimeout(playMusic, 0, false);
    }
  }
}

playMusic(false);
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
  temp.id = "current_music";
  if(!pauseded) {
    temp.autoplay = "true";
  }
  temp.textAlign = "center";
  temp.volume = document.getElementById("volume").value;
  if(!inThePast) {
    musicPlayed.push(musicToPlay);
    totalMusicPlayed.push(musicToPlay);
  }
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
      pauseded = false;
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
      pauseded = true;
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
  if(totalMusicPlayed.length !== 0) {
    var temp = totalMusicPlayed.length - 1;
    skipBackIndex--;
    if(totalMusicPlayed[temp + skipBackIndex] !== undefined) {
      inThePast = true;
      actualPlayMusic(totalMusicPlayed[temp + skipBackIndex]);
    } else {
      skipBackIndex++;
    }
  }
}

function skipForward() {
  playMusic(true);
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

var dragged;

document.addEventListener("drag", function (event) {
  
}, false);

document.addEventListener("dragstart", function( event ) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.style.opacity = .5;
}, false);

document.addEventListener("dragend", function( event ) {
    // reset the transparency
    event.target.style.opacity = "";
}, false);
