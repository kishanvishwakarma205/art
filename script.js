document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // 1. CONTENT DATA
  // ==========================================
  const contentData = {
    audioSrc: "song.mp3",
    hero: {
      accent: "Hidden in the grain",
      title: "I managed to hide your voice inside a piece of wood.",
      subtitle: "Not forever, though. Tap below and listen to the echo it left behind.",
      note: "Yes — the very one you're holding right now."
    },
    player: {
      title: "One Song. One Moment.",
      caption: "A quiet moment we decided to keep safe."
    },
    story: {
      accent: "Voice as object",
      title: "The Shape of a Song",
      paragraphs: [
        "Most songs exist for only a few minutes.",
        "This one became a pattern.",
        "A vibration.",
        "A line carved into wood.",
        "Underneath that pattern, tucked about four millimetres into the grain, sits a small chip — silent until something gets close enough to ask it a question.",
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
      // NEW: Array of 6 photos and captions
      photos: [
        { src: "photos/photo.png", caption: "For the singer in the room." },
        { src: "photos/02.jpeg", caption: "Caption" },
        { src: "photos/03.jpeg", caption: "Caption" },
        { src: "photos/04.jpeg", caption: "Caption" },
        { src: "photos/05.jpeg", caption: "Caption" },
        { src: "photos/07.jpeg", caption: "Caption" },
        { src: "photos/10.jpeg", caption: "Caption" },
        { src: "photos/12.jpeg", caption: "Caption" },
        { src: "photos/13.jpeg", caption: "Caption" },
        { src: "photos/14.jpeg", caption: "Caption" },
        { src: "photos/15.jpeg", caption: "Caption" },
        { src: "photos/16.jpeg", caption: "Caption" },
        { src: "photos/01.jpeg", caption: "Caption" },
        { src: "photos/06.jpeg", caption: "Caption" },
        { src: "photos/09.jpeg", caption: "Caption" },
      ],
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
  document.getElementById("heroNote").textContent = contentData.hero.note;
  
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
  // 3. INTERACTIVE POLAROID DECK
  // ==========================================
  const deckContainer = document.getElementById("photoDeck");
  const baseRotations = [-4, 3, -2, 5, -3, 2]; // Staggered messy look

  // --- Dynamic sizing: the card morphs to match each photo's real shape ---
  const DEFAULT_ASPECT = 3 / 4;     // portrait fallback while an image is still loading
  const MIN_CARD_HEIGHT = 220;      // guard rails so very wide/tall photos don't break the layout
  const MAX_CARD_HEIGHT = 460;
  const FRAME_PAD_X = 20;           // 10px left + 10px right (.photo-frame padding)
  const FRAME_PAD_Y = 50;           // 10px top + 40px bottom (.photo-frame padding)

  let currentTopCard = null;

  const resizeDeckToCard = (figure, animate = true) => {
    if (!figure) return;
    const containerWidth = deckContainer.getBoundingClientRect().width || 280;
    const aspect = parseFloat(figure.dataset.aspect) || DEFAULT_ASPECT; // width / height
    const photoWindowWidth = containerWidth - FRAME_PAD_X;
    let targetHeight = (photoWindowWidth / aspect) + FRAME_PAD_Y;
    targetHeight = Math.min(MAX_CARD_HEIGHT, Math.max(MIN_CARD_HEIGHT, targetHeight));

    if (!animate) {
      deckContainer.style.transition = "none";
    }
    deckContainer.style.height = `${targetHeight}px`;
    if (!animate) {
      void deckContainer.offsetHeight; // force reflow before re-enabling transition
      deckContainer.style.transition = "";
    }
  };

  // Build the deck
  contentData.tribute.photos.forEach((photoData, index) => {
    const figure = document.createElement("figure");
    figure.className = "photo-frame";
    
    // Reverse z-index so the first item in the array is on top
    figure.style.zIndex = contentData.tribute.photos.length - index;
    
    // Assign a rotation based on index
    const rotation = baseRotations[index % baseRotations.length];
    figure.style.transform = `rotate(${rotation}deg)`;
    figure.dataset.rotation = rotation; // Store it for later

    figure.innerHTML = `
      <img src="${photoData.src}" alt="Memory ${index + 1}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWFlMGQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjN2E2MzU1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGhvdG8gUGxhY2Vob2xkZXI8L3RleHQ+PC9zdmc+'">
      <figcaption>${photoData.caption}</figcaption>
    `;
    
    deckContainer.appendChild(figure);

    // Measure the photo's real aspect ratio as soon as it's available
    const imgEl = figure.querySelector("img");
    const recordAspect = () => {
      if (imgEl.naturalWidth && imgEl.naturalHeight) {
        figure.dataset.aspect = imgEl.naturalWidth / imgEl.naturalHeight;
        // If this photo is the one currently on top, fit the card to it now
        if (figure === currentTopCard) {
          resizeDeckToCard(figure);
        }
      }
    };
    if (imgEl.complete) {
      recordAspect();
    } else {
      imgEl.addEventListener("load", recordAspect, { once: true });
    }
  });

  // The first photo in the array starts on top — size the card to it immediately, no animation
  currentTopCard = deckContainer.querySelector(".photo-frame");
  resizeDeckToCard(currentTopCard, false);

  let isAnimating = false;

  deckContainer.addEventListener("click", () => {
    if (isAnimating) return; // Prevent spam clicking
    
    // Hide the hint after the first tap
    const hint = deckContainer.querySelector('.deck-hint');
    if (hint) hint.style.opacity = '0';

    const cards = Array.from(deckContainer.querySelectorAll('.photo-frame'));
    
    // Find the current top card (highest z-index) and the one underneath it
    const sortedByZ = [...cards].sort((a, b) => parseInt(b.style.zIndex) - parseInt(a.style.zIndex));
    const topCard = sortedByZ[0];
    const nextCard = sortedByZ[1] || topCard;

    isAnimating = true;
    currentTopCard = nextCard;
    
    // 1. Swipe it away, and let the card morph to the next photo's shape at the same time
    topCard.classList.add("swipe-out");
    resizeDeckToCard(nextCard);

    // 2. Wait for animation to finish, then reshuffle z-indexes
    setTimeout(() => {
      topCard.classList.remove("swipe-out");
      
      // Move top card to the back
      cards.forEach(card => {
        let z = parseInt(card.style.zIndex);
        if (card === topCard) {
          card.style.zIndex = 1;
        } else {
          card.style.zIndex = z + 1; // Bubble everything else up
        }
      });

      isAnimating = false;
    }, 400); // 400ms matches the CSS transition time
  });

  // ==========================================
  // 4. PLAYER & ANIMATION LOGIC
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
    const restingHeight = Math.floor(Math.random() * 8) + 14; 
    bar.style.height = `${restingHeight}px`;
    bar.dataset.restingHeight = restingHeight;
    waveformContainer.appendChild(bar);
  }

  let audioCtx = null;
  let analyser = null;
  let dataArray = null;
  let waveformRAF = null;

  const setupAudioContext = () => {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const sourceNode = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    } catch (err) {
      console.warn("Waveform analysis unavailable, using fallback animation:", err);
      audioCtx = null;
      analyser = null;
    }
  };

  const startWaveformAnimation = () => {
    if (!analyser) return;
    waveformContainer.classList.add("audio-reactive");
    const bars = waveformContainer.querySelectorAll("span");
    const minBarHeight = 14;
    const maxBarHeight = 50;
    let silentFrames = 0;
    const silentFrameLimit = 40;

    // Precompute a logarithmic bin range per bar instead of one raw bin per bar.
    // Voice/music energy is concentrated in the low end, so a straight linear
    // mapping (bar i -> bin i) leaves the right-hand bars almost always flat.
    // Grouping bins logarithmically + boosting the higher bars compensates for that.
    const binCount = dataArray.length;
    const barBinRanges = Array.from({ length: bars.length }, (_, i) => {
      const t0 = i / bars.length;
      const t1 = (i + 1) / bars.length;
      const start = Math.floor(Math.pow(t0, 1.8) * (binCount - 1));
      const end = Math.max(start + 1, Math.floor(Math.pow(t1, 1.8) * (binCount - 1)));
      return [start, Math.min(end, binCount)];
    });
    const gainCurve = Array.from({ length: bars.length }, (_, i) =>
      1 + (i / Math.max(1, bars.length - 1)) * 1.8
    );

    const loop = () => {
      if (audio.paused || audio.ended) return;
      analyser.getByteFrequencyData(dataArray);

      let peak = 0;
      bars.forEach((bar, i) => {
        const [start, end] = barBinRanges[i];
        let sum = 0;
        for (let b = start; b < end; b++) sum += dataArray[b];
        const avg = sum / (end - start);
        const value = Math.min(255, avg * gainCurve[i]);
        if (value > peak) peak = value;
        const height = minBarHeight + (value / 255) * (maxBarHeight - minBarHeight);
        bar.style.height = `${height}px`;
      });

      if (peak === 0) {
        silentFrames++;
        if (silentFrames > silentFrameLimit) {
          stopWaveformAnimation();
          return;
        }
      } else {
        silentFrames = 0;
      }

      waveformRAF = requestAnimationFrame(loop);
    };
    waveformRAF = requestAnimationFrame(loop);
  };

  const stopWaveformAnimation = () => {
    if (waveformRAF) {
      cancelAnimationFrame(waveformRAF);
      waveformRAF = null;
    }
    waveformContainer.classList.remove("audio-reactive");
    waveformContainer.querySelectorAll("span").forEach((bar) => {
      bar.style.height = `${bar.dataset.restingHeight}px`;
    });
  };

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
      seekBar.style.background = `linear-gradient(to right, #D4A373 0%, #D4A373 ${percent}%, #EAE0D5 ${percent}%, #EAE0D5 100%)`;
    }
    currentTimeLabel.textContent = formatTime(current);
    durationLabel.textContent = formatTime(duration);
  };

  const setPlayingState = (isPlaying) => {
    if (isPlaying) {
      document.body.classList.add("is-playing");
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
      playToggle.setAttribute("aria-label", "Pause song");
    } else {
      document.body.classList.remove("is-playing");
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      playToggle.setAttribute("aria-label", "Play song");
    }
  };

  playToggle.addEventListener("click", () => {
    if (audio.paused) {
      setupAudioContext();
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
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
  audio.addEventListener("play", () => {
    setPlayingState(true);
    playToggle.classList.remove("invite-tap");
    startWaveformAnimation();
  });
  audio.addEventListener("pause", () => {
    setPlayingState(false);
    stopWaveformAnimation();
  });
  audio.addEventListener("ended", () => {
    setPlayingState(false);
    stopWaveformAnimation();
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