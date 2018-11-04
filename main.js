window.onerror = function(message, source, lineno, colno, error) {
    alert(message);
    alert("Error found on line " + lineno);
    alert("Error found on column " + colno);
}

var fileSelect = document.getElementById("file_select"); // the button that takes the place of the file picker
var music = []; // list of all music
var musicPlayed = []; // list of music played in current cycle
var setEve = true; // starter thing for setting an event listener
var pastMusic = music.slice(); // past music to cut down on music list changes
var shuffle = true; // shuffling or not
var currentIndex = 0; // index for non-shuffle
var pastShuffle = true; // change the shuffle image when shuffle state changes
var skipBackIndex = 0; // how far back in the list of music played it is
var inThePast = false; // whether we are in the past or not
var totalMusicPlayed = []; // all music played, including past cycles
var pauseded = false; // whether or not it's paused
var loop = 2; // determine loop type; 0 = no loop; 1 = single loop; 2 = continuous loop
var pastLoop = loop; // change the loop image when loop state changes
var totalTime = 0; // total length of all music
var currentTotalTime = 0; // total time of all music played
var previousTotalTime = 0; // total time of all music finished
var frameIndex = 0;
var title = [];
var artist = [];
var album = [];
var year = [];
var time = [];

var fileElem = document.getElementById("file_elem"); // the original, invisible file picker

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
    musicLength(0); // index
    
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
        temp6.id = "li_" + music[i].name;
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
          temp7.id += temp4[j];
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
          if(currentIndex > temp3) {
            currentIndex--;
          }
          music.splice(temp3, 1);
          time.splice(temp3, 1);
          title.splice(temp3, 1);
          artist.splice(temp3, 1);
          album.splice(temp3, 1);
          year.splice(temp3, 1);
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
          this.style.background = "#000";
        };
        temp8.ondrop = function(event) {
          event.preventDefault();
          this.style.background = "rgba(255, 255, 255, 0)";
          var temp = "div_";
          var temp2 = dragged.id;
          for(var i = 3; i < temp2.length; i++) {
            temp += temp2[i];
          }
          if(document.getElementById(temp) !== this) {
            document.getElementById("music_list").insertBefore(document.getElementById(temp), this);
            document.getElementById("music_list").insertBefore(dragged, this);
          }
          updateMusicList();
        };
        temp8.ondragleave = function(event) {
          event.preventDefault();
          this.style.background = "rgba(255, 255, 255, 0)";
        };
        temp8.id = "div_" + music[i].name;
        temp8.style.height = "5px";
        temp8.style.width = "100%";
        document.getElementById("music_list").appendChild(temp8);
        document.getElementById("music_list").appendChild(temp6);
      }
    }
    var temp8 = document.createElement("DIV"); // the last div, cuz divs appear above songs and otherwise there wouldn't be one at the end
    temp8.ondragover = function(event) {
      event.preventDefault();
      this.style.background = "#000";
    };
    temp8.ondrop = function(event) {
      event.preventDefault();
      this.style.background = "rgba(255, 255, 255, 0)";
      var temp = "div_";
      var temp2 = dragged.id;
      for(var i = 3; i < temp2.length; i++) {
        temp += temp2[i];
      }
      if(document.getElementById(temp) !== this.previousSibling) { // previousSibling because we're putting songs above this one, and it needs to make sure it's not the same
        document.getElementById("music_list").insertBefore(document.getElementById(temp), this);
        document.getElementById("music_list").insertBefore(dragged, this);
      }
      updateMusicList();
    };
    temp8.ondragleave = function(event) {
      event.preventDefault();
      this.style.background = "rgba(255, 255, 255, 0)";
    };
    temp8.id = "final_div";
    temp8.style.height = "5px";
    temp8.style.width = "100%";
    document.getElementById("music_list").appendChild(temp8);
    pastMusic = music.slice();
  }
  
  
  
  if(setEve) {
    fileElem.addEventListener("click", function (e) {
      if (fileSelect) {
        fileSelect.click();
      }
    }, false);
    
    // Taken from https://ericbidelman.tumblr.com/post/8343485440/reading-mp3-id3-tags-in-javascript
    fileElem.onchange = function(e) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var dv = new jDataView(this.result);

        // "TAG" starts at byte -128 from EOF.
        // See http://en.wikipedia.org/wiki/ID3
        if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
          title.push(dv.getString(30, dv.tell()));
          artist.push(dv.getString(30, dv.tell()));
          album.push(dv.getString(30, dv.tell()));
          year.push(dv.getString(4, dv.tell()));
        } else {
          // no ID3v1 data found.
        }
      };
      for(var i = 0; i < this.files.length; i++) {
        reader.readAsArrayBuffer(this.files[i]);
      }
    };
    
    document.addEventListener("keypress", function (e) {
      if(e.key === " ") {
        e.preventDefault();
        if(document.getElementById("current_music") !== null) {
          if(document.getElementById("current_music").paused) {
            document.getElementById("current_music").play();
          } else {
            document.getElementById("current_music").pause();
          }
        }
      }
    }, false);
    
    setEve = false;
  }
  
  if((document.getElementById("current_music") !== null || skipForwardBypass) && music.length !== 0) {
    if(document.getElementById("current_music").ended || skipForwardBypass) {
      inThePast = (skipBackIndex !== 0);
      if(musicPlayed.length >= music.length && !inThePast && loop !== 0) {
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
      if(loop === 1) {
        for(var i = 0; i < music.length; i++) {
          var temp = music[i].name.split(".");
          var temp2 = "Now playing: \"";
          for(var j = 0; j < temp.length - 1; j++) {
            temp2 += temp[j];
          }
          temp2 += "\"";
          if(temp2 === document.getElementById("now_playing").textContent) {
            var musicToPlay = music[i];
          }
        }
      } else if(skipBackIndex !== 0) {
        skipBackIndex++;
        var musicToPlay = totalMusicPlayed[totalMusicPlayed.length - 1 + skipBackIndex];
      } else if(shuffle) {
        currentIndex = random(0, musicTemp.length - 1);
        var musicToPlay = musicTemp[currentIndex];
      } else {
        if(currentIndex < music.length) {
          var musicToPlay = music[currentIndex++];
        }
        if(currentIndex >= music.length && loop !== 0) {
          currentIndex = 0;
        }
      }
      if(loop !== 0 || musicPlayed.length < music.length || inThePast) {
        actualPlayMusic(musicToPlay);
      }
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
      if(loop === 1) {
        for(var i = 0; i < music.length; i++) {
          var temp = music[i].name.split(".");
          var temp2 = "Now playing: \"";
          for(var j = 0; j < temp.length - 1; j++) {
            temp2 += temp[j];
          }
          temp2 += "\"";
          if(temp2 === document.getElementById("now_playing").textContent) {
            var musicToPlay = music[i];
          }
        }
      } else if(skipBackIndex !== 0) {
        skipBackIndex++;
        var musicToPlay = totalMusicPlayed[totalMusicPlayed.length - 1 + skipBackIndex];
      } else if(shuffle) {
        currentIndex = random(0, musicTemp.length - 1);
        var musicToPlay = musicTemp[currentIndex];
      } else {
        if(loop === 1) {
          var musicToPlay = music[currentIndex];
        } else {
          var musicToPlay = music[currentIndex++];
        }
        if(currentIndex >= music.length && loop !== 0) {
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

function musicLength(index) {
  var temp = document.createElement("AUDIO");
  temp.id = "det_len";
  temp.autoplay = "true";
  temp.volume = 0;
  try {
    temp.srcObject = music[index];
  } catch (error) {
    temp.src = URL.createObjectURL(music[index]);
  }
  document.getElementById("temp_store").appendChild(temp);
  if(index < music.length) {
    setTimeout(determineLength, 10, index);
  }
}

function determineLength(index) {
  if(Number.isNaN(document.getElementById("det_len").duration)) {
    setTimeout(determineLength, 10, index);
  } else {
    time[index] = document.getElementById("det_len").duration;
    document.getElementById("temp_store").removeChild(document.getElementById("det_len"));
    musicLength(index + 1);
  }
}

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
  if(!inThePast && loop !== 1) {
    musicPlayed.push(musicToPlay);
    totalMusicPlayed.push(musicToPlay);
  }
  document.getElementById("hud").appendChild(temp);
  var temp6 = document.createElement("BR");
  temp6.id = "break_hud"
  document.getElementById("hud").appendChild(temp6);
  var temp5 = document.createElement("PARAGRAPH");
  temp5.id = "now_playing";
  for(var i = 0; i < music.length; i++) {
    if(music[i].name === musicToPlay.name) {
      if(title[i] !== undefined) {
        temp5.textContent = "Now playing: \"" + title[i] + "\"";
      } else {
        var temp409 = musicToPlay.name.split(".");
        temp5.textContent = "Now playing: \"";
        for(var j = 0; j < temp409.length - 1; j++) {
          temp5.textContent += temp409[j];
        }
        temp5.textContent += "\"";
      }
    }
  }
  document.getElementById("hud").appendChild(temp5);
  document.getElementById("time_seek").min = 0;
}

function playPause() {
  if(document.getElementById("current_music") !== null) {
    if(document.getElementById("current_music").paused) {
      pauseded = false;
      document.getElementById("current_music").play();
      document.getElementById("pause_image").style.display = "initial";
      document.getElementById("play_image").style.display = "none";
    } else {
      pauseded = true;
      document.getElementById("current_music").pause();
      document.getElementById("pause_image").style.display = "none";
      document.getElementById("play_image").style.display = "initial";
    }
  }
}

function updateThings() {
  frameIndex++
  if(document.getElementById("current_music") !== null) {
    document.getElementById("time_seek").max = document.getElementById("current_music").duration;
    document.getElementById("time_seek").value = document.getElementById("current_music").currentTime;
    totalTime = 0;
    for(var i = 0; i < time.length; i++) {
      totalTime += time[i];
    }
    totalTime = Math.floor(totalTime);
    currentTotalTime = 0;
    for(var i = 0; i < musicPlayed.length; i++) {
      for(var j = 0; j < music.length; j++) {
        if(musicPlayed[i] === music[j]) {
          currentTotalTime += time[j];
        }
      }
    }
    currentTotalTime += document.getElementById("current_music").currentTime;
    currentTotalTime = Math.round(currentTotalTime);
    var tmpe = Math.round(document.getElementById("current_music").currentTime);
    if(tmpe >= 3600) {
      tmpe = Math.floor(tmpe / 3600) + ":" + ((Math.floor(tmpe / 60) % 60 < 10) ? ("0" + Math.floor(tmpe / 60) % 60):(Math.floor(tmpe / 60) % 60)) + ":" + ((tmpe % 60 < 10) ? ("0" + tmpe % 60):(tmpe % 60));
    } else {
      tmpe = ((Math.floor(tmpe / 60) % 60 < 10) ? ("0" + Math.floor(tmpe / 60) % 60):(Math.floor(tmpe / 60) % 60)) + ":" + ((tmpe % 60 < 10) ? ("0" + tmpe % 60):(tmpe % 60));
    }
    var tmep = Math.round(document.getElementById("current_music").duration);
    if(tmep >= 3600) {
      tmep = Math.floor(tmep / 3600) + ":" + ((Math.floor(tmep / 60) % 60 < 10) ? ("0" + Math.floor(tmep / 60) % 60):(Math.floor(tmep / 60) % 60)) + ":" + ((tmep % 60 < 10) ? ("0" + tmep % 60):(tmep % 60));
    } else {
      tmep = ((Math.floor(tmep / 60) % 60 < 10) ? ("0" + Math.floor(tmep / 60) % 60):(Math.floor(tmep / 60) % 60)) + ":" + ((tmep % 60 < 10) ? ("0" + tmep % 60):(tmep % 60));
    }
    document.getElementById("time_words").innerHTML = tmpe + "/" + tmep;
  }
  var temp = Math.round(currentTotalTime);
  if(temp >= 3600) {
    var temp2 = Math.floor(temp / 3600) + ":" + ((Math.floor(temp / 60) % 60 < 10) ? ("0" + Math.floor(temp / 60) % 60):(Math.floor(temp / 60) % 60)) + ":" + ((temp % 60 < 10) ? ("0" + temp % 60):(temp % 60));
  } else {
    var temp2 = ((Math.floor(temp / 60) % 60 < 10) ? ("0" + Math.floor(temp / 60) % 60):(Math.floor(temp / 60) % 60)) + ":" + ((temp % 60 < 10) ? ("0" + temp % 60):(temp % 60));
  }
  if(totalTime >= 3600) {
    var temp3 = Math.floor(totalTime / 3600) + ":" + ((Math.floor(totalTime / 60) % 60 < 10) ? ("0" + Math.floor(totalTime / 60) % 60):(Math.floor(totalTime / 60) % 60)) + ":" + ((totalTime % 60 < 10) ? ("0" + totalTime % 60):(totalTime % 60));
  } else {
    var temp3 = ((Math.floor(totalTime / 60) % 60 < 10) ? ("0" + Math.floor(totalTime / 60) % 60):(Math.floor(totalTime / 60) % 60)) + ":" + ((totalTime % 60 < 10) ? ("0" + totalTime % 60):(totalTime % 60));
  }
  document.getElementById("total_time").innerHTML = temp2 + "/" + temp3;
  
  if(pastShuffle !== shuffle) {
    while(document.getElementById("shuffle").firstChild !== null) {
      document.getElementById("shuffle").removeChild(document.getElementById("shuffle").firstChild);
    }
    if(shuffle) {
      var temp = document.createElement("IMG");
      temp.src = "images/shuffle.png";
      temp.alt = "Shuffle ON";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("shuffle").appendChild(temp);
    } else {
      var temp = document.createElement("IMG");
      temp.src = "images/no shuffle.png";
      temp.alt = "Shuffle OFF";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("shuffle").appendChild(temp);
    }
  }
  pastShuffle = shuffle;
  
  if(pastLoop !== loop) {
    while(document.getElementById("loop").firstChild !== null) {
      document.getElementById("loop").removeChild(document.getElementById("loop").firstChild);
    }
    if(loop === 0) {
      var temp = document.createElement("IMG");
      temp.src = "images/no loop.png";
      temp.alt = "Loop OFF";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("loop").appendChild(temp);
    } else if (loop === 1) {
      var temp = document.createElement("IMG");
      temp.src = "images/single loop.png";
      temp.alt = "Loop SINGLE";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("loop").appendChild(temp);
    } else {
      var temp = document.createElement("IMG");
      temp.src = "images/loop.png";
      temp.alt = "Loop ON";
      temp.width = 25;
      temp.height = 25;
      document.getElementById("loop").appendChild(temp);
    }
  }
  pastLoop = loop;
  
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

function updateMusicList() {
  for(var i = 0; i < music.length; i++) {
    if("li_" + music[i].name !== document.getElementById("music_list").childNodes[(2 * i) + 1].id) { // skip over all the divs
      for(var j = i + 1; j < music.length; j++) {
        if("li_" + music[j].name === document.getElementById("music_list").childNodes[(2 * i) + 1].id) {
          var temp = music.splice(j, 1);
          var temp2 = music.splice(i, 1);
          temp = temp[0];
          temp2 = temp2[0];
          music.splice(i, 0, temp);
          music.splice(j, 0, temp2);
        }
      }
    }
  }
  
  for(var i = 0; i < music.length; i++) {
    var temp = music[i].name.split(".");
    var temp2 = "Now playing: \"";
    for(var j = 0; j < temp.length - 1; j++) {
      temp2 += temp[j];
    }
    temp2 += "\"";
    if(document.getElementById("now_playing").textContent === temp2) {
      currentIndex = i + 1;
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
