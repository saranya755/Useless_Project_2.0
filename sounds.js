// Sound effects management
const sounds = {
  bubble: new Audio(),
  bubbleLarge: new Audio(),
  bubbleSmall: new Audio(),
  feed: new Audio(),
  splash: new Audio(),
  click: new Audio(),
  background: new Audio()
};

// Set sound sources
sounds.bubble.src = 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3'; // Bubble pop sound
sounds.bubbleLarge.src = 'https://assets.mixkit.co/active_storage/sfx/2685/2685-preview.mp3'; // Large bubble sound
sounds.bubbleSmall.src = 'https://assets.mixkit.co/active_storage/sfx/1171/1171-preview.mp3'; // Small bubble sound
sounds.feed.src = 'https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3'; // Fish eating sound
sounds.splash.src = 'https://assets.mixkit.co/active_storage/sfx/875/875-preview.mp3'; // Water splash


// Configure background sound
sounds.background.loop = true;
sounds.background.volume = 0.3;

// Configure bubble sounds
sounds.bubble.volume = 0.6;
sounds.bubbleLarge.volume = 0.7;
sounds.bubbleSmall.volume = 0.5;

// Function to play a sound
function playSound(soundName) {
  // Create a clone to allow overlapping sounds
  const sound = sounds[soundName].cloneNode();
  sound.volume = sounds[soundName].volume || 0.7;
  sound.play();
}

// Function to toggle background sound
function toggleBackgroundSound() {
  if (sounds.background.paused) {
    sounds.background.play();
    return true;
  } else {
    sounds.background.pause();
    return false;
  }
}

// Export sound functions
window.aquariumSounds = {
  play: playSound,
  toggleBackground: toggleBackgroundSound
};