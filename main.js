window.onerror = function(message, source, lineno, colno, error) {
    alert(message);
    alert("Error found on line " + lineno);
    alert("Error found on column " + colno);
}

var fileSelect = document.getElementById("file_select"); // the button that takes the place of the file picker
var music = []; // list of all music
var currentMusic; // music that is playing
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
var timeDetermined = false;
var inaccurateMaxTime = false;

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
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playMusic(skipForwardBypass) { // skipForwardBypass: pretend the song is over; emulates skipping forward.
  if(pastMusic.length !== music.length) { // check for an updated music list, indicating an update to the shown list
    totalTime = 0;
    musicLength(0); // index
    
    while(document.getElementById("music_list").firstChild !== null) {
      document.getElementById("music_list").removeChild(document.getElementById("music_list").firstChild); // remove them all
    }
    if(music.length === 0) {
      var nothingElement = document.createElement("LI");
      nothingElement.textContent = "Nothing.";
      document.getElementById("music_list").appendChild(nothingElement);
    } else {
      for(var i = 0; i < music.length; i++) {
        var musicList = document.createElement("LI"); // list head
        var musicButton = document.createElement("BUTTON"); // button for music select
        var nameSplit = music[i].name.split("."); // split by period
        for(var j = 0; j < nameSplit.length - 1; j++) {
          musicButton.textContent += nameSplit[j]; // add all the text back, but ignore the file type (ie mp3, wav, ogg)
        }
        musicList.id = "li_" + music[i].name; // use music name for id because it is unique
        musicList.draggable = true;
        
        
        
        musicButton.onclick = function () { // when you click it, play that song
          for(var i = 0; i < music.length; i++) {
            var nameSplit = music[i].name.split(".");
            var nameNoExt = "";
            for(var j = 0; j < nameSplit.length - 1; j++) {
              nameNoExt += nameSplit[j]; // get the name but without file extension
            }
            if(nameNoExt === this.textContent) {
              actualPlayMusic(music[i]); // if the song names are the same, play it.
            }
          }
        };
        musicList.style.background = "rgba(255, 255, 255, 0)"; // it's transparent
        musicList.style.border = "none"; // no border
        musicList.style.width = "95%"; // 95% screen with
        musicList.appendChild(musicButton); // musicList <- musicButton
        
        
        
        var deleteButton = document.createElement("BUTTON"); // delete the music from the list
        deleteButton.textContent = "X";
        deleteButton.id = "remove_";
        for(var j = 0; j < nameSplit.length - 1; j++) {
          deleteButton.id += nameSplit[j];
        }
        deleteButton.onclick = function() {
          for(var i = 0; i < music.length; i++) {
            var nameSplit = music[i].name.split(".");
            var nameNoExt = "remove_";
            for(var j = 0; j < nameSplit.length - 1; j++) {
              nameNoExt += nameSplit[j];
            }
            if(nameNoExt === this.id) {
              var musicID = i;
            }
          }
          if(document.getElementById("current_music") !== null) { // so long as something is playing...
            if(music[musicID] === currentMusic) { // if the music being deleted is the song playing...
              playMusic(true); // skip the song so we can delete it safely.
            }
          }
          if(currentIndex > musicID) { // if the index of the current song is greater than the song being deleted...
            currentIndex--; // subtract to make sure the index matches up with the current song.
          }
          music.splice(musicID, 1); // delete it! from everywhere.
          time.splice(musicID, 1);
          title.splice(musicID, 1);
          artist.splice(musicID, 1);
          album.splice(musicID, 1);
          year.splice(musicID, 1);
        }
        deleteButton.style.background = "#FF0000"; // it's pure red
        deleteButton.style.border = "none"; // no border
        deleteButton.style.float = "right"; // on the right
        deleteButton.style.color = "#250000"; // text is dark red
        deleteButton.style.width = "5%"; // 5% of screen width
        musicList.appendChild(deleteButton); // musicList <<-- deleteButton, musicButton
        
        
        
        var dragDiv = document.createElement("DIV"); // div for dragging stuff, in between 'musicList's
        dragDiv.ondragover = function(event) {
          event.preventDefault();
          this.style.background = "#000"; // background is pure black
        };
        dragDiv.ondrop = function(event) {
          event.preventDefault();
          this.style.background = "rgba(255, 255, 255, 0)"; // it's transparent again
          var divID = "div_";
          for(var i = 3; i < dragged.id.length; i++) { // interpreting as a string, cut off "li_" and add to divID
            divID += dragged.id[i];
          }
          if(document.getElementById(divID) !== this) { // so long as you didn't just move musicList to the same place...
            document.getElementById("music_list").insertBefore(document.getElementById(divID), this); // move the dragDiv over here
            document.getElementById("music_list").insertBefore(dragged, this); // move the musicList over here
          }
          updateMusicList(); // make sure the array matches, make sure there aren't any doubled dragDivs
        };
        dragDiv.ondragleave = function(event) {
          event.preventDefault();
          this.style.background = "rgba(255, 255, 255, 0)"; // it's transparent again
        };
        dragDiv.id = "div_" + music[i].name;
        dragDiv.style.height = "5px"; // 5 pixels wide
        dragDiv.style.width = "100%"; // completely wide
        document.getElementById("music_list").appendChild(dragDiv); // ... dD mL dD
        document.getElementById("music_list").appendChild(musicList); // ... dD mL dD mL
      }
    }
    var dragDiv = document.createElement("DIV"); // dragDiv for the very end of the list
    dragDiv.ondragover = function(event) {
      event.preventDefault();
      this.style.background = "#000";
    };
    dragDiv.ondrop = function(event) {
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
    dragDiv.ondragleave = function(event) {
      event.preventDefault();
      this.style.background = "rgba(255, 255, 255, 0)";
    };
    dragDiv.id = "final_div";
    dragDiv.style.height = "5px";
    dragDiv.style.width = "100%";
    document.getElementById("music_list").appendChild(dragDiv);
    pastMusic = music.slice(); // copy music to pastMusic
  }
  
  
  
  if(setEve) { // one-time check to add an event listener. Needs to be in here, otherwise the html document isn't correctly loaded
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
        playPause(); // if you press space, it plays or pauses the song; keyboard shortcut
      }
    }, false);
    
    setEve = false; // don't keep initializing event listeners.
  }
  
  if((document.getElementById("current_music") !== null || skipForwardBypass) && music.length !== 0) { // if something is playing and the songlist isn't empty...
    if(document.getElementById("current_music").ended || skipForwardBypass) { // if the song has ended or bypass...
      musicPlayed.push(currentMusic); // the song has been played
      totalMusicPlayed.push(currentMusic); // the song has been played, permanently
      if(loop !== 1) {
        previousTotalTime += currentMusic.length; // add its length as long as we aren't looping the same song over and over again
      }
      
      
      inThePast = (skipBackIndex !== 0); // are we in the past? that is to say, is skipBackIndex not equal to 0?
      if(musicPlayed.length >= music.length && !inThePast && loop !== 0) { // if you've played more music than there are songs, you've reached the end
        musicPlayed = []; // reset musicPlayed for the next loop
      }
      var musicTemp = music.slice(); // copy music
      for(var i = 0; i < musicPlayed.length; i++) {
        for(var j = 0; j < musicTemp.length; j++) {
          if(musicPlayed[i] === musicTemp[j]) {
            musicTemp.splice(j, 1); // remove anything that has already been played
          }
        }
      }
      if(loop === 1) {
        musicToPlay = currentMusic; // if we're looping the same song, just keep playing the same song.
      } else if(skipBackIndex !== 0) {
        skipBackIndex++; // if we're in the past, move forward.
        var musicToPlay = totalMusicPlayed[totalMusicPlayed.length - 1 + skipBackIndex];
      } else if(shuffle) {
        currentIndex = random(0, musicTemp.length - 1); // if we're randomizing order, randomize!
        var musicToPlay = musicTemp[currentIndex];
      } else {
        if(currentIndex < music.length) { // if we haven't reached the end, increase index.
          var musicToPlay = music[currentIndex++];
        }
        if(currentIndex >= music.length && loop !== 0) { // if it's greater, reset!
          currentIndex = 0;
        }
      }
      if(loop !== 0 || musicPlayed.length < music.length || inThePast) { // if we're looping or we haven't finished or we're in the past
        actualPlayMusic(musicToPlay); // play music
      }
      setTimeout(playMusic, 0, false); // rerun this function asap
    } else { // if not ended or bypass...
      setTimeout(playMusic, 0, false); // rerun this function asap
    }
  } else if((document.getElementById("current_music") !== null || skipForwardBypass) && music.length === 0) { // if we've removed all the songs...
    document.getElementById("hud").removeChild(document.getElementById("current_music"));
    document.getElementById("hud").removeChild(document.getElementById("break_hud")); // delete everything because there's nothing to play.
    document.getElementById("hud").removeChild(document.getElementById("now_playing"));
  } else { // otherwise nothing is playing right now...
    if(music.length !== 0) { // so long as there is music...
      var musicTemp = music.slice(); // copy music list
      for(var i = 0; i < musicPlayed.length; i++) {
        for(var j = 0; j < musicTemp.length; j++) {
          if(musicPlayed[i] === musicTemp[j]) {
            musicTemp.splice(j, 1); // remove already played music
          }
        }
      }
      if(loop === 1) { // same as above...
        musicToPlay = currentMusic;
      } else if(skipBackIndex !== 0) {
        skipBackIndex++;
        var musicToPlay = totalMusicPlayed[totalMusicPlayed.length - 1 + skipBackIndex];
      } else if(shuffle) {
        currentIndex = random(0, musicTemp.length - 1);
        var musicToPlay = musicTemp[currentIndex];
      } else {
        var musicToPlay = music[currentIndex++];
        if(currentIndex >= music.length && loop !== 0) {
          currentIndex = 0;
        }
      }
      actualPlayMusic(musicToPlay);
      setTimeout(playMusic, 0, false); // rerun this function asap
    } else {
      setTimeout(playMusic, 0, false); // rerun this function asap
    }
  }
}

playMusic(false);
updateThings();

function musicLength(index) { // determine the length of a song
  var tempSong = document.createElement("AUDIO");
  tempSong.id = "det_len";
  tempSong.autoplay = "true";
  tempSong.volume = 0;
  try {
    tempSong.srcObject = music[index];
  } catch (error) {
    tempSong.src = URL.createObjectURL(music[index]);
  }
  document.getElementById("temp_store").appendChild(tempSong);
  if(index < music.length) {
    setTimeout(determineLength, 100, index);
  }
}

function determineLength(index) {
  if(Number.isNaN(document.getElementById("det_len").duration)) {
    setTimeout(determineLength, 500, index); // if it's still processing, wait a while.
  } else {
    time[index] = document.getElementById("det_len").duration; // set the particular index to be the correct time
    totalTime += document.getElementById("det_len").duration; // add to total time
    alert(totalTime);
    document.getElementById("temp_store").removeChild(document.getElementById("det_len")); // reset
    musicLength(index + 1); // again!
  }
}

function actualPlayMusic(musicToPlay) {
  if(document.getElementById("current_music") !== null) { // if something is playing
    document.getElementById("hud").removeChild(document.getElementById("current_music")); // remove it all
    document.getElementById("hud").removeChild(document.getElementById("break_hud"));
    document.getElementById("hud").removeChild(document.getElementById("now_playing"));
  }
  var newMusic = document.createElement("AUDIO"); // the new music
  try {
    newMusic.srcObject = musicToPlay;
  } catch (error) {
    newMusic.src = URL.createObjectURL(musicToPlay);
  }
  newMusic.id = "current_music";
  if(!pauseded) { // are we paused?
    newMusic.autoplay = "true"; // if not, play automatically
  }
  newMusic.textAlign = "center"; // right in the middle
  newMusic.volume = document.getElementById("volume").value; // set volume as user specifies
  document.getElementById("hud").appendChild(newMusic); // attach to the top
  
  
  
  var hudBreak = document.createElement("BR"); // it's the break
  hudBreak.id = "break_hud";
  document.getElementById("hud").appendChild(hudBreak); // attach to the top
  
  
  
  var nowPlaying = document.createElement("PARAGRAPH"); // it's the title of the song
  nowPlaying.id = "now_playing";
  for(var i = 0; i < music.length; i++) {
    if(music[i].name === musicToPlay.name) {
      if(title[i] !== undefined) { // if it exists, use the title specified by tags
        nowPlaying.textContent = "Now playing: \"" + title[i] + "\"";
      } else { // otherwise, just use the filename minus the extension
        var nameSplit = musicToPlay.name.split(".");
        nowPlaying.textContent = "Now playing: \"";
        for(var j = 0; j < nameSplit.length - 1; j++) {
          nowPlaying.textContent += nameSplit[j];
        }
        nowPlaying.textContent += "\"";
      }
      if(time[i] !== undefined) {
        document.getElementById("time_seek").max = time[i];
      } else {
        inaccurateMaxTime = true;
      }
    }
  }
  document.getElementById("hud").appendChild(nowPlaying);
  document.getElementById("time_seek").min = 0; // reset the slider to the beginning
  currentMusic = musicToPlay; // make sure we know what song we're playing
}

function playPause() {
  if(document.getElementById("current_music") !== null) { // if something is playing...
    if(document.getElementById("current_music").paused) { // if it's paused, unpause
      pauseded = false;
      document.getElementById("current_music").play();
      document.getElementById("pause_image").style.display = "initial";
      document.getElementById("play_image").style.display = "none";
    } else { // otherwise, pause
      pauseded = true;
      document.getElementById("current_music").pause();
      document.getElementById("pause_image").style.display = "none";
      document.getElementById("play_image").style.display = "initial";
    }
  }
}

function updateThings() { // handles time played, etc.
  // frameIndex++
  if(document.getElementById("current_music") !== null) { // if something is playing...
    if(inaccurateMaxTime) {
      if(currentMusic.duration !== undefined) {
        document.getElementById("time_seek").max = currentMusic.duration;
        inaccurateMaxTime = false;
      }
    }
    document.getElementById("time_seek").value = document.getElementById("current_music").currentTime; // make sure the slider is accurate
    currentTotalTime = previousTotalTime + document.getElementById("current_music").currentTime;
    currentTotalTime = Math.round(currentTotalTime);
    var currentTime = formatTime(document.getElementById("current_music").currentTime);
    var currentTotal = formatTime(document.getElementById("current_music").duration);
    document.getElementById("time_words").innerHTML = currentTime + "/" + currentTotal;
  } else {
    currentTotalTime = previousTotalTime;
  }
  var fCurrentTotalTime = formatTime(currentTotalTime);
  var fTotalTime = formatTime(totalTime);
  document.getElementById("total_time").innerHTML = fCurrentTotalTime + "/" + fTotalTime;
  
  if(pastShuffle !== shuffle) { // if user has changed shuffle settings
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
  
  setTimeout(updateThings, 100);
}

function skipBack() { // go back in time... if you wanted to hear that song again.
  if(totalMusicPlayed.length !== 0) { // so long as we can actually go backwards...
    skipBackIndex--;
    if(totalMusicPlayed[totalMusicPlayed.length - 1 + skipBackIndex] !== undefined) {
      inThePast = true;
      actualPlayMusic(totalMusicPlayed[totalMusicPlayed.length - 1 + skipBackIndex]);
    } else {
      skipBackIndex++;
    }
  }
}

function skipForward() {
  playMusic(true);
}

function updateMusicList() { // switches things around to match the front end list
  for(var i = 0; i < music.length; i++) {
    if("li_" + music[i].name !== document.getElementById("music_list").childNodes[(2 * i) + 1].id) { // check all the list elements
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
    if(currentMusic === music[i]) {
      currentIndex = i + 1;
    }
  }
}

function formatTime(time) {
    time = Math.round(time);
    if(time >= 3600) {
      return Math.floor(time / 3600) + ":" + ((Math.floor(time / 60) % 60 < 10) ? ("0" + Math.floor(time / 60) % 60):(Math.floor(time / 60) % 60)) + ":" + ((time % 60 < 10) ? ("0" + time % 60):(time % 60));
    } else {
      return ((Math.floor(time / 60) % 60 < 10) ? ("0" + Math.floor(time / 60) % 60):(Math.floor(time / 60) % 60)) + ":" + ((time % 60 < 10) ? ("0" + time % 60):(time % 60));
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
