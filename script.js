document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const audio = document.getElementById("song");
  const heroPlay = document.getElementById("heroPlay");
  const playToggle = document.getElementById("playToggle");
  const seekBar = document.getElementById("seekBar");
  const currentTimeLabel = document.getElementById("currentTime");
  const durationLabel = document.getElementById("duration");
  const playerSection = document.getElementById("playerSection");
  const lyricsTranslateToggle = document.getElementById("lyricsTranslateToggle");
  const lyricsContainer = document.getElementById("lyricsContainer");
  const birthdayCard = document.getElementById("birthdayCard");
  const climaxSparkleLayer = document.getElementById("climaxSparkleLayer");

  // Dynamic DOM Injection of Visualizers
  const playerWaveform = document.getElementById("playerWaveform");
  const sculptureWaveform = document.getElementById("sculptureWaveform");

  const playerBarCount = window.innerWidth <= 560 ? 16 : 24;
  const sculptureBarCount = 17;

  const playerBarElements = [];
  const sculptureBarElements = [];

  // Generate dynamic player bar nodes
  playerWaveform.innerHTML = "";
  for (let i = 0; i < playerBarCount; i++) {
    const bar = document.createElement("span");
    playerWaveform.appendChild(bar);
    playerBarElements.push(bar);
  }

  // Generate dynamic wood-carving bar nodes
  sculptureWaveform.innerHTML = "";
  for (let i = 0; i < sculptureBarCount; i++) {
    const bar = document.createElement("span");
    sculptureWaveform.appendChild(bar);
    sculptureBarElements.push(bar);
  }

  // --- Real Audio Analysis System ---
  let audioCtx = null;
  let analyser = null;
  let sourceNode = null;
  let isWebAudioActive = false;
  let audioAnimationId = null;

  function initWebAudio() {
    if (audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64; // Yields 32 bin frequencies

      sourceNode = audioCtx.createMediaElementSource(audio);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      isWebAudioActive = true;
    } catch (e) {
      // Graceful fallback trigger if CORS or security restrictions exist
      console.warn("Audio Context blocked or running locally. Initializing dynamic math fallback visualization.", e);
      isWebAudioActive = false;
    }
  }

  // Real-time Visualizer Paint Routine
  function drawVisualizers() {
    if (!audio.paused) {
      if (isWebAudioActive && analyser) {
        const frequencies = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencies);

        // Map live frequencies to the player waveform
        for (let i = 0; i < playerBarCount; i++) {
          const val = frequencies[i] || 0;
          const height = (val / 255) * 100;
          playerBarElements[i].style.setProperty("--h", `${Math.max(12, height)}%`);
        }

        // Map alternate frequencies to the sound sculpture
        for (let i = 0; i < sculptureBarCount; i++) {
          const freqIndex = Math.floor(i * (frequencies.length / sculptureBarCount));
          const val = frequencies[freqIndex] || 0;
          const height = (val / 255) * 100;
          sculptureBarElements[i].style.setProperty("--h", `${Math.max(12, height)}%`);
        }
      } else {
        // Organic Fallback Simulator if API is blocked or offline
        const time = Date.now() * 0.003;
        for (let i = 0; i < playerBarCount; i++) {
          const pulse = 15 + Math.abs(Math.sin(time + i * 0.5) * Math.cos(time * 0.8 + i * 0.3)) * 75;
          playerBarElements[i].style.setProperty("--h", `${Math.max(12, pulse)}%`);
        }
        for (let i = 0; i < sculptureBarCount; i++) {
          const pulse = 15 + Math.abs(Math.sin(time * 0.7 + i * 0.4) * Math.cos(time * 1.2 + i * 0.2)) * 70;
          sculptureBarElements[i].style.setProperty("--h", `${Math.max(12, pulse)}%`);
        }
      }
      audioAnimationId = requestAnimationFrame(drawVisualizers);
    } else {
      // Idle wave breathing when paused
      const time = Date.now() * 0.001;
      for (let i = 0; i < playerBarCount; i++) {
        const restingHeight = 15 + Math.sin(time + i * 0.4) * 5;
        playerBarElements[i].style.setProperty("--h", `${restingHeight}%`);
      }
      for (let i = 0; i < sculptureBarCount; i++) {
        const restingHeight = 15 + Math.sin(time * 0.8 + i * 0.3) * 4;
        sculptureBarElements[i].style.setProperty("--h", `${restingHeight}%`);
      }
      audioAnimationId = requestAnimationFrame(drawVisualizers);
    }
  }

  // --- Progressive Scrubber logic ---
  const formatTime = (value) => {
    if (!Number.isFinite(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const updateProgress = () => {
    const duration = audio.duration || 0;
    const current = audio.currentTime || 0;
    const percent = duration ? (current / duration) * 100 : 0;

    seekBar.value = percent;
    seekBar.style.setProperty("--progress", `${percent}%`);
    currentTimeLabel.textContent = formatTime(current);
    durationLabel.textContent = formatTime(duration);
  };

  const setPlayingState = (isPlaying) => {
    body.classList.toggle("is-playing", isPlaying);
    playToggle.setAttribute("data-state", isPlaying ? "playing" : "paused");
    playToggle.setAttribute("aria-label", isPlaying ? "Pause song" : "Play song");

    if (isPlaying) {
      if (!audioAnimationId) drawVisualizers();
    } else {
      if (audioAnimationId) {
        cancelAnimationFrame(audioAnimationId);
        audioAnimationId = null;
      }
    }
  };

  // --- Unified Layout Unlocking Trigger ---
  const openExperience = async () => {
    initWebAudio();
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    body.classList.add("experience-open");

    try {
      await audio.play();
      setPlayingState(true);
    } catch (error) {
      setPlayingState(false);
    }

    window.setTimeout(() => {
      playerSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 450);
  };

  heroPlay.addEventListener("click", openExperience);

  playToggle.addEventListener("click", async () => {
    initWebAudio();
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (audio.paused) {
      try {
        await audio.play();
        setPlayingState(true);
      } catch (error) {
        setPlayingState(false);
      }
    } else {
      audio.pause();
      setPlayingState(false);
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

  // --- Section Transitions Observer ---
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

  // --- Performance-Aware Particle System ---
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let particles = [];
  let animationFrame;
  let isCanvasActive = true;

  const colors = [
    "rgba(72, 227, 255, 0.7)",
    "rgba(255, 93, 99, 0.68)",
    "rgba(255, 154, 61, 0.58)",
    "rgba(255, 214, 128, 0.64)",
    "rgba(143, 99, 255, 0.6)"
  ];

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(60, Math.max(30, Math.floor(window.innerWidth / 22)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.6 + 0.6,
      speed: Math.random() * 0.22 + 0.08,
      drift: (Math.random() - 0.5) * 0.14,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  };

  const drawParticles = () => {
    // Only repaint if canvas is on-screen and visible in active browser tab
    if (isCanvasActive && document.visibilityState === "visible") {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -12) {
          particle.y = window.innerHeight + 12;
          particle.x = Math.random() * window.innerWidth;
        }

        if (particle.x < -12) particle.x = window.innerWidth + 12;
        if (particle.x > window.innerWidth + 12) particle.x = -12;

        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    animationFrame = window.requestAnimationFrame(drawParticles);
  };

  // Intersection Observer to suspend animation loop when canvas is out of view
  const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isCanvasActive = entry.isIntersecting;
    });
  }, { threshold: 0.02 });
  canvasObserver.observe(canvas);

  const startParticles = () => {
    if (motionQuery.matches) return;
    resizeCanvas();
    window.cancelAnimationFrame(animationFrame);
    drawParticles();
  };

  window.addEventListener("resize", resizeCanvas);
  motionQuery.addEventListener("change", () => {
    if (motionQuery.matches) {
      window.cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      startParticles();
    }
  });

  // Tab switching visibility optimization
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (audioAnimationId) cancelAnimationFrame(audioAnimationId);
    } else {
      if (!audio.paused) drawVisualizers();
    }
  });

  // --- Dynamic Lyrics Translation Module ---
  lyricsTranslateToggle.addEventListener("click", () => {
    const displaying = lyricsContainer.classList.toggle("show-translation");
    lyricsTranslateToggle.textContent = displaying ? "Show Originals" : "English Translation";
  });

  // --- Climax Ceremony Celebration Trigger ---
  let celebrationTriggered = false;
  const climaxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !celebrationTriggered) {
        runCelebrationSparkles();
        celebrationTriggered = true;
      }
    });
  }, { threshold: 0.2 });

  climaxObserver.observe(birthdayCard);

  function runCelebrationSparkles() {
    climaxSparkleLayer.innerHTML = "";
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
      const sparkle = document.createElement("span");
      sparkle.className = "star-particle";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 2}s`;
      sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      climaxSparkleLayer.appendChild(sparkle);
    }
  }

  // Launch initial scripts
  startParticles();
  updateProgress();
  drawVisualizers(); // Begins rest state animation breathing
});