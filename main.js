var fileSelect = document.getElementById("file_select");
var music = [];
var musicPlayed = [];

function submitFiles() {
  var newFiles = fileSelect.files;
  for(var i = 0; i < newFiles.length; i++) {
    music.push(newFiles[i]);
  }
}

function playMusic() {
  if(document.getElementById("current_music") !== null) {
    if(document.getElementById("current_music").ended) {
      document.removeChild(document.getElementById("current_music"));
      
      var temp = document.createElement("AUDIO");
      temp.file = musicToPlay;
      temp.controls = "true";
      temp.id = "current_music";
      document.appendChild(temp);
    }
  }
}
