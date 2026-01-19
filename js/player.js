/**
 * AS ROME BURNS - Custom Music Player
 * 
 * INSTRUCTIONS:
 * 1. Add your MP3 files to the /music folder
 * 2. Update the tracks array below with your actual file names and metadata
 * 3. For production, consider using a CDN or audio hosting service for better performance
 */

// Track list - UPDATE THESE with your actual songs
const tracks = [
  {
    title: "I Am Your Enemy",
    artist: "As Rome Burns",
    // Replace with your actual file path or URL
    src: "music/i-am-your-enemy.mp3",
    duration: "6:37"
  },
  {
    title: "Animal",
    artist: "As Rome Burns",
    src: "music/animal.mp3",
    duration: "4:44"
  },
  {
    title: "I Think You Should Leave",
    artist: "As Rome Burns",
    src: "music/i-think-you-should-leave.mp3",
    duration: "3:21"
  },
  {
    title: "BOY",
    artist: "As Rome Burns",
    src: "music/boy.mp3",
    duration: "3:24"
  }
];

// Player state
let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();

// DOM Elements
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const tracklist = document.getElementById('tracklist');

// Initialize player
function init() {
  renderTracklist();
  loadTrack(0);
  setupEventListeners();
}

// Render the track list
function renderTracklist() {
  tracklist.innerHTML = tracks.map((track, index) => `
    <li class="tracklist__item${index === 0 ? ' active' : ''}" data-index="${index}">
      <span class="tracklist__number">${index + 1}</span>
      <span class="tracklist__title">${track.title}</span>
      <span class="tracklist__duration">${track.duration}</span>
    </li>
  `).join('');
}

// Load a track
function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[index];
  
  audio.src = track.src;
  currentTrackTitle.textContent = track.title;
  durationEl.textContent = track.duration;
  
  // Update active state in tracklist
  document.querySelectorAll('.tracklist__item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
  
  // Reset progress
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
}

// Play/Pause toggle
function togglePlay() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(e => {
      console.log('Playback failed:', e);
      // If file doesn't exist, show a message
      if (e.name === 'NotSupportedError') {
        alert('Audio file not found. Please add your MP3 files to the /music folder.');
      }
    });
  }
}

// Update play/pause icons
function updatePlayButton() {
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Go to next track
function nextTrack() {
  const nextIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(nextIndex);
  if (isPlaying) audio.play();
}

// Go to previous track
function prevTrack() {
  // If more than 3 seconds in, restart current track
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prevIndex);
  if (isPlaying) audio.play();
}

// Setup event listeners
function setupEventListeners() {
  // Play button
  playBtn.addEventListener('click', togglePlay);
  
  // Next/Prev buttons
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);
  
  // Audio events
  audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
  });
  
  audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
  });
  
  audio.addEventListener('ended', nextTrack);
  
  audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });
  
  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
  });
  
  // Progress bar click
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });
  
  // Tracklist clicks
  tracklist.addEventListener('click', (e) => {
    const item = e.target.closest('.tracklist__item');
    if (item) {
      const index = parseInt(item.dataset.index);
      loadTrack(index);
      audio.play();
    }
  });
  
  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; // Don't interfere with form inputs
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
        break;
      case 'ArrowLeft':
        audio.currentTime = Math.max(audio.currentTime - 10, 0);
        break;
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
