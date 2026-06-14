document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("song");
  const playToggle = document.getElementById("playToggle");
  const playIcon = playToggle.querySelector(".icon-play");
  const pauseIcon = playToggle.querySelector(".icon-pause");
  const seekBar = document.getElementById("seekBar");
  const currentTimeLabel = document.getElementById("currentTime");
  const durationLabel = document.getElementById("duration");
  
  const translateToggle = document.getElementById("translateToggle");
  const lyricsContainer = document.getElementById("lyricsContainer");

  // --- Audio Player Logic ---
  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const updateProgress = () => {
    const duration = audio.duration || 0;
    const current = audio.currentTime || 0;
    
    // Update Slider
    if (duration > 0) {
      seekBar.value = (current / duration) * 100;
      
      // Update background progress visual for webkit
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

  // Audio Event Listeners
  audio.addEventListener("loadedmetadata", updateProgress);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("play", () => setPlayingState(true));
  audio.addEventListener("pause", () => setPlayingState(false));
  audio.addEventListener("ended", () => {
    setPlayingState(false);
    audio.currentTime = 0;
    updateProgress();
  });

  // --- Lyrics Translation Toggle ---
  translateToggle.addEventListener("click", () => {
    const isShowing = lyricsContainer.classList.toggle("show-translation");
    translateToggle.textContent = isShowing ? "Hide Translation" : "Translation";
    
    // Slight stylistic change to button when active
    if (isShowing) {
      translateToggle.style.background = "var(--accent)";
      translateToggle.style.color = "var(--card-bg)";
    } else {
      translateToggle.style.background = "transparent";
      translateToggle.style.color = "var(--accent)";
    }
  });

  // --- Scroll Reveal Animations ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target); // Unobserve after revealing once
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  // --- Generate Waveform Bars ---
  const waveformContainer = document.getElementById("waveform");
  const barCount = 20; // Number of carved lines

  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("span");
    // Generate a random delay so the wave looks organic when playing
    const randomDelay = (Math.random() * 1.5).toFixed(2);
    bar.style.setProperty('--delay', `-${randomDelay}s`);
    // Randomize resting height slightly for a textured wood look
    const restingHeight = Math.floor(Math.random() * 10) + 10;
    bar.style.height = `${restingHeight}px`;
    
    waveformContainer.appendChild(bar);
  }
  
  // Initialize slider background
  updateProgress();
});