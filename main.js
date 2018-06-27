var fileSelect = document.getElementById("file_select");
var music = [];
var musicPlayed = [];
var setEve = true;

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
  if(setEve) {
    fileSelect.addEventListener("click", function (e) {
      if (fileElem) {
        fileElem.click();
      }
    }, false);
    setEve = false;
  }
  if(document.getElementById("current_music") !== null) {
    if(document.getElementById("current_music").ended) {
      if(musicPlayed.length === music.length) {
        musicPlayed = [];
      }
      document.removeChild(document.getElementById("current_music"));
      var musicTemp = music.slice();
      for(var i = 0; i < musicPlayed.length; i++) {
        for(var j = 0; j < musicTemp.length; j++) {
          if(musicPlayed[i] === musicTemp[j]) {
            musicTemp.splice(j, 1);
          }
        }
      }
      var musicToPlay = musicTemp[random(0, musicTemp.length - 1)];
      var temp = document.createElement("AUDIO");
      temp.file = musicToPlay;
      temp.controls = "true";
      temp.id = "current_music";
      musicPlayed.push(musicToPlay);
      document.appendChild(temp);
    } else {
      setTimeout(playMusic, 0);
    }
  }
}

playMusic();
