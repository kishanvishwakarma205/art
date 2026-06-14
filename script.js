document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. CONTENT DATA
  // ==========================================
  const contentData = {
    audioSrc: "song.mp3",
    hero: {
      accent: "Hidden in the grain",
      title: "I managed to hide your voice inside a piece of wood.",
      subtitle: "Not forever, though. Tap below and listen to the echo it left behind."
    },
    player: {
      title: "One Song. One Moment.",
      caption: "Captured from one of Sannidhi's Instagram reels."
    },
    story: {
      accent: "Voice as object",
      title: "The Shape of a Song",
      paragraphs: [
        "Most songs exist for only a few minutes.",
        "This one became a pattern.",
        "A vibration.",
        "A line carved into wood.",
        "A small reminder that beautiful things do not always have to disappear."
      ]
    },
    lyrics: {
      accent: "Words, held gently",
      title: "Lyrics",
      lines: [
        { original: "Tere aane ke baad samjhe hain mohabbat kya hai", translated: "Since you arrived, I have truly learned what love means" },
        { original: "Ab hamein chaand ki, taaron ki zaroorat kya hai", translated: "Now, what need do I have for the moon and stars?" },
        { original: "Pyaar se badhke bhala kaun sa gehna hoga", translated: "What ornament could ever outshine true love?" },
        { original: "Ab hamein aap ke kadmon mein rehna hoga", translated: "Now, I wish only to walk beside your path" },
        { original: "Sharm aati hai magar aaj yeh kehna hoga", translated: "I feel shy, but today I must find the voice to say this..." }
      ]
    },
    tribute: {
      accent: "A conspiracy of friends",
      title: "Happy Birthday, Sannidhi",
      photoSrc: "photo.png",
      photoCaption: "For the singer in the room.",
      paragraphs: [
        "Some people collect photos. Some collect memories. You seem to collect songs.",
        "From random conversations, late replies, shared jokes, and countless melodies - here's one voice we thought deserved a permanent place.",
        "May this year bring new adventures and many more reasons to keep singing."
      ],
      signature: "- Eww/Shii",
      instagramUrl: "https://www.instagram.com/_sannidhiii_/"
    }
  };

  // ==========================================
  // 2. INJECT CONTENT INTO DOM
  // ==========================================
  
  document.getElementById("song").src = contentData.audioSrc;
  
  document.getElementById("heroAccent").textContent = contentData.hero.accent;
  document.getElementById("heroTitle").textContent = contentData.hero.title;
  document.getElementById("heroSubtitle").textContent = contentData.hero.subtitle;
  
  document.getElementById("playerTitle").textContent = contentData.player.title;
  document.getElementById("playerCaption").textContent = contentData.player.caption;
  
  document.getElementById("storyAccent").textContent = contentData.story.accent;
  document.getElementById("storyTitle").textContent = contentData.story.title;
  const storyContainer = document.getElementById("storyContainer");
  contentData.story.paragraphs.forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    storyContainer.appendChild(p);
  });
  
  document.getElementById("lyricsAccent").textContent = contentData.lyrics.accent;
  document.getElementById("lyricsTitle").textContent = contentData.lyrics.title;
  const lyricsContainer = document.getElementById("lyricsContainer");
  contentData.lyrics.lines.forEach(line => {
    const div = document.createElement("div");
    div.className = "lyric-line";
    div.innerHTML = `
      <p class="original">${line.original}</p>
      <p class="translated">${line.translated}</p>
    `;
    lyricsContainer.appendChild(div);
  });
  
  document.getElementById("tributeAccent").textContent = contentData.tribute.accent;
  document.getElementById("tributeTitle").textContent = contentData.tribute.title;
  document.getElementById("tributePhoto").src = contentData.tribute.photoSrc;
  document.getElementById("tributeCaption").textContent = contentData.tribute.photoCaption;
  document.getElementById("instagramLink").href = contentData.tribute.instagramUrl;
  
  const tributeContainer = document.getElementById("tributeContainer");
  contentData.tribute.paragraphs.forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    tributeContainer.appendChild(p);
  });
  const sig = document.createElement("p");
  sig.className = "signature";
  sig.textContent = contentData.tribute.signature;
  tributeContainer.appendChild(sig);

  // ==========================================
  // 3. PLAYER & ANIMATION LOGIC
  // ==========================================
  
  const audio = document.getElementById("song");
  const playToggle = document.getElementById("playToggle");
  const playIcon = playToggle.querySelector(".icon-play");
  const pauseIcon = playToggle.querySelector(".icon-pause");
  const seekBar = document.getElementById("seekBar");
  const currentTimeLabel = document.getElementById("currentTime");
  const durationLabel = document.getElementById("duration");
  const translateToggle = document.getElementById("translateToggle");

  const waveformContainer = document.getElementById("waveform");
  for (let i = 0; i < 20; i++) {
    const bar = document.createElement("span");
    const randomDelay = (Math.random() * 1.5).toFixed(2);
    bar.style.setProperty('--delay', `-${randomDelay}s`);
    const restingHeight = Math.floor(Math.random() * 10) + 10;
    bar.style.height = `${restingHeight}px`;
    waveformContainer.appendChild(bar);
  }

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const updateProgress = () => {
    const duration = audio.duration || 0;
    const current = audio.currentTime || 0;
    
    if (duration > 0) {
      seekBar.value = (current / duration) * 100;
      const percent = seekBar.value;
      seekBar.style.background = `linear-gradient(to right, #3E2A21 0%, #3E2A21 ${percent}%, #EAE0D5 ${percent}%, #EAE0D5 100%)`;
    }
    currentTimeLabel.textContent = formatTime(current);
    durationLabel.textContent = formatTime(duration);
  };

  const setPlayingState = (isPlaying) => {
    if (isPlaying) {
      document.body.classList.add("is-playing");
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      document.body.classList.remove("is-playing");
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  };

  playToggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(e => console.error("Playback prevented:", e));
    } else {
      audio.pause();
    }
  });

  seekBar.addEventListener("input", () => {
    const duration = audio.duration || 0;
    audio.currentTime = (Number(seekBar.value) / 100) * duration;
    updateProgress();
  });

  audio.addEventListener("loadedmetadata", updateProgress);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("play", () => setPlayingState(true));
  audio.addEventListener("pause", () => setPlayingState(false));
  audio.addEventListener("ended", () => {
    setPlayingState(false);
    audio.currentTime = 0;
    updateProgress();
  });

  translateToggle.addEventListener("click", () => {
    const isShowing = lyricsContainer.classList.toggle("show-translation");
    translateToggle.textContent = isShowing ? "Hide Translation" : "Translation";
    
    if (isShowing) {
      translateToggle.style.background = "var(--accent)";
      translateToggle.style.color = "var(--card-bg)";
    } else {
      translateToggle.style.background = "transparent";
      translateToggle.style.color = "var(--accent)";
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
  
  updateProgress();
});