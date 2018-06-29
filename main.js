var fileSelect = document.getElementById("file_select");
var music = [];
var musicPlayed = [];
var setEve = true;
var pastMusic = music.slice();

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
      var temp6 = document.createElement("LI");
      var temp2 = document.createElement("BUTTON");
      var temp3 = music[i].name;
      if(temp3 !== undefined) {
        var temp4 = temp3.split(".");
        for(var j = 0; j < temp4.length - 1; j++) {
          temp2.innerHTML += temp4[j];
        }
        temp6.id = music[i].name;
        temp2.onclick = new Function("actualPlayMusic(" + music[i] + ")");
        temp2.class = "trackSelect";
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
      var musicToPlay = musicTemp[random(0, musicTemp.length - 1)];
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
      var musicToPlay = musicTemp[random(0, musicTemp.length - 1)];
      actualPlayMusic(musicToPlay);
      setTimeout(playMusic, 0);
    } else {
      setTimeout(playMusic, 0);
    }
  }
}

playMusic();

function actualPlayMusic(musicToPlay) {
  if(document.getElementById("current_music") !== null) {
    document.getElementById("hud").removeChild(document.getElementById("current_music"));
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
  musicPlayed.push(musicToPlay);
  document.getElementById("hud").appendChild(temp);
  document.getElementById("hud").appendChild(document.createElement("BR"));
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
