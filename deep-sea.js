// Deep sea creatures and effects

// Create deep sea creatures
function createDeepSeaElements() {
  // Create container for deep sea elements
  const deepSeaContainer = document.createElement('div');
  deepSeaContainer.id = 'deep-sea-container';
  document.getElementById('aquarium').appendChild(deepSeaContainer);
  
  // Add jellyfish
  createJellyfish(3);
  
  // Add seaweed
  createSeaweed(5);
  
  // Add occasional glowing particles
  setInterval(createGlowingParticle, 2000);
}

// Create jellyfish
function createJellyfish(count) {
  const deepSeaContainer = document.getElementById('deep-sea-container');
  
  for (let i = 0; i < count; i++) {
    const jellyfish = document.createElement('div');
    jellyfish.className = 'jellyfish';
    
    // Random position
    jellyfish.style.left = Math.random() * 80 + 10 + '%';
    jellyfish.style.top = Math.random() * 60 + 20 + '%';
    
    // Random size
    const size = Math.random() * 30 + 20;
    jellyfish.style.width = size + 'px';
    jellyfish.style.height = size * 1.5 + 'px';
    
    // Random color (blue/purple hues)
    const hue = Math.floor(Math.random() * 60) + 220; // 220-280 (blue to purple)
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 20) + 70; // 70-90%
    jellyfish.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
    
    // Create tentacles
    const tentacleCount = Math.floor(Math.random() * 3) + 3; // 3-5 tentacles
    for (let j = 0; j < tentacleCount; j++) {
      const tentacle = document.createElement('div');
      tentacle.className = 'tentacle';
      tentacle.style.left = (j * (100 / tentacleCount)) + '%';
      tentacle.style.animationDelay = (Math.random() * 2) + 's';
      tentacle.style.height = (size * (Math.random() * 0.5 + 1)) + 'px';
      jellyfish.appendChild(tentacle);
    }
    
    // Add pulse animation with random delay
    jellyfish.style.animationDelay = (Math.random() * 5) + 's';
    
    deepSeaContainer.appendChild(jellyfish);
  }
}

// Create seaweed
function createSeaweed(count) {
  const deepSeaContainer = document.getElementById('deep-sea-container');
  
  for (let i = 0; i < count; i++) {
    const seaweed = document.createElement('div');
    seaweed.className = 'seaweed';
    
    // Position at bottom with random horizontal position
    seaweed.style.left = Math.random() * 90 + 5 + '%';
    seaweed.style.bottom = '0';
    
    // Random height
    const height = Math.random() * 150 + 100;
    seaweed.style.height = height + 'px';
    
    // Random width
    const width = Math.random() * 10 + 15;
    seaweed.style.width = width + 'px';
    
    // Random color (green hues)
    const hue = Math.floor(Math.random() * 40) + 100; // 100-140 (green)
    seaweed.style.backgroundColor = `hsla(${hue}, 70%, 30%, 0.4)`;
    
    // Random animation delay
    seaweed.style.animationDelay = (Math.random() * 3) + 's';
    
    deepSeaContainer.appendChild(seaweed);
  }
}

// Create glowing particles
function createGlowingParticle() {
  const deepSeaContainer = document.getElementById('deep-sea-container');
  
  const particle = document.createElement('div');
  particle.className = 'glowing-particle';
  
  // Random position
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  
  // Random size (small)
  const size = Math.random() * 4 + 2;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  
  // Random color (cyan/blue/purple)
  const hue = Math.floor(Math.random() * 100) + 180; // 180-280
  particle.style.backgroundColor = `hsla(${hue}, 100%, 70%, 0.8)`;
  particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, 100%, 70%, 0.8)`;
  
  // Random animation duration
  const duration = Math.random() * 5 + 3;
  particle.style.animationDuration = duration + 's';
  
  deepSeaContainer.appendChild(particle);
  
  // Remove after animation
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, duration * 1000);
}

// Initialize deep sea elements when document is loaded
window.addEventListener('DOMContentLoaded', () => {
  createDeepSeaElements();
});