// DOM Elements
const fish = document.getElementById("fish");
const message = document.getElementById("message");
const talkBubble = document.getElementById("talk-bubble");
const feedBtn = document.getElementById("feed-btn");
const talkBtn = document.getElementById("talk-btn");
const colorPicker = document.getElementById("color-picker");
const hungerLevel = document.getElementById("hunger-level");
const bubblesContainer = document.getElementById("bubbles-container");
const aquarium = document.getElementById("aquarium");
const soundBtn = document.getElementById("sound-btn");

// Fish state
const fishState = {
  direction: 1,
  posX: 0,
  posY: 50,
  speed: 2,
  hunger: 100,  // 100 = full, 0 = starving
  mood: "happy", // happy, neutral, sad
  lastFed: Date.now(),
  lastInteraction: Date.now()
};

// Mood-based messages
const moodMessages = {
  happy: [
    "This ocean is super cool!",
    "Hey, check out those weird caves!",
    "Thanks for the awesome home!",
    "Pop! Pop! These bubbles are fun!",
    "Whoa, everything glows down here!"
  ],
  neutral: [
    "Just swimming around...",
    "It's pretty chill down here.",
    "Hey there, what's up?",
    "Swimming laps is my cardio!",
    "Wonder what's behind that rock?"
  ],
  sad: [
    "Kinda lonely down here sometimes...",
    "Getting hungry, got any snacks?",
    "Brr, it's a bit cold today.",
    "Miss ya when you're gone!",
    "Need a hiding spot..."
  ],
  starving: [
    "Sooo hungry...",
    "Food please! Anything!",
    "Need... snacks... now...",
    "Empty tummy = sad fish.",
    "Feed me or I'll give you the sad eyes!"
  ]
};

// Initialize
function init() {
  // Start swimming
  requestAnimationFrame(swim);
  
  // Start hunger decrease
  setInterval(decreaseHunger, 10000); // Decrease hunger every 10 seconds
  
  // Start bubble generation
  setInterval(createBubble, 2000); // Create bubble every 2 seconds
  
  // Start mood updates
  setInterval(updateMood, 15000); // Update mood every 15 seconds
  
  // Event listeners
  feedBtn.addEventListener("click", feedFish);
  talkBtn.addEventListener("click", showRandomTalkBubble);
  colorPicker.addEventListener("input", changeFishColor);
  soundBtn.addEventListener("click", toggleSounds);
  
  // Initialize sounds
  updateSoundButtonIcon(false);
  
  // Add load event for SVG
  fish.addEventListener("load", function() {
    // Once SVG is loaded, add click event to the SVG document
    const fishSvg = fish.contentDocument || fish.getSVGDocument();
    if (fishSvg) {
      fishSvg.addEventListener("click", fishInteraction);
    } else {
      // Fallback if SVG document not accessible
      fish.addEventListener("click", fishInteraction);
    }
  });
  
  // Responsive handling
  window.addEventListener("resize", handleResize);
  
  // Initial setup
  updateHungerMeter();
  updateMoodMessage();
  handleResize();
}

// Fish swimming animation
function swim() {
  const screenWidth = aquarium.clientWidth;
  fishState.posX += fishState.direction * fishState.speed;

  // Boundary check
  if (fishState.posX > screenWidth - 100 || fishState.posX < 0) {
    fishState.direction *= -1;
    fish.style.transform = fishState.direction === 1
      ? "translateY(-50%) scaleX(1)"
      : "translateY(-50%) scaleX(-1)";
  }

  // Random vertical movement
  if (Math.random() < 0.02) {
    fishState.posY += (Math.random() - 0.5) * 10;
    fishState.posY = Math.max(20, Math.min(80, fishState.posY)); // Keep within bounds
  }

  // Apply position
  fish.style.left = fishState.posX + "px";
  fish.style.top = fishState.posY + "%";
  
  // Position talk bubble near fish
  if (!talkBubble.classList.contains("hidden")) {
    talkBubble.style.left = (fishState.posX + 50) + "px";
    talkBubble.style.top = (fishState.posY - 20) + "%";
  }

  requestAnimationFrame(swim);
}

// Hunger management
function decreaseHunger() {
  fishState.hunger = Math.max(0, fishState.hunger - 5);
  updateHungerMeter();
  updateMood();
}

function updateHungerMeter() {
  hungerLevel.style.width = fishState.hunger + "%";
  
  // Change color based on hunger level
  if (fishState.hunger > 70) {
    hungerLevel.style.backgroundColor = "#4CAF50"; // Green
  } else if (fishState.hunger > 30) {
    hungerLevel.style.backgroundColor = "#FFC107"; // Yellow
  } else {
    hungerLevel.style.backgroundColor = "#F44336"; // Red
  }
}

function feedFish() {
  if (fishState.hunger < 100) {
    fishState.hunger = Math.min(100, fishState.hunger + 20);
    fishState.lastFed = Date.now();
    updateHungerMeter();
    updateMood();
    
    // Play feeding sound
    aquariumSounds.play('feed');
    
    // Show happy message
    showTalkBubble("Yum! Thanks dude! 😋");
    
    // Create food particles
    createFoodParticles();
    
    // Speed up temporarily
    const originalSpeed = fishState.speed;
    fishState.speed = 4;
    setTimeout(() => {
      fishState.speed = originalSpeed;
    }, 3000);
  }
}

function createFoodParticles() {
  for (let i = 0; i < 5; i++) {
    const food = document.createElement("div");
    food.className = "food-particle";
    food.style.left = Math.random() * 80 + 10 + "%";
    food.style.top = "0";
    food.style.backgroundColor = `rgb(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 0)`;
    food.style.width = Math.random() * 5 + 5 + "px";
    food.style.height = food.style.width;
    food.style.position = "absolute";
    food.style.borderRadius = "50%";
    food.style.opacity = "0.8";
    food.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
    
    aquarium.appendChild(food);
    
    // Remove after animation
    setTimeout(() => {
      if (food.parentNode) {
        food.parentNode.removeChild(food);
      }
    }, 5000);
  }
  
  // Add falling animation if not already in stylesheet
  if (!document.querySelector("style#food-animation")) {
    const style = document.createElement("style");
    style.id = "food-animation";
    style.textContent = `
      @keyframes fall {
        0% { transform: translateY(0); }
        100% { transform: translateY(100vh); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Mood management
function updateMood() {
  const timeSinceLastFed = Date.now() - fishState.lastFed;
  const timeSinceLastInteraction = Date.now() - fishState.lastInteraction;
  
  if (fishState.hunger < 20) {
    fishState.mood = "starving";
  } else if (fishState.hunger < 40 || timeSinceLastFed > 60000) {
    fishState.mood = "sad";
  } else if (fishState.hunger > 80 && timeSinceLastInteraction < 30000) {
    fishState.mood = "happy";
  } else {
    fishState.mood = "neutral";
  }
  
  updateMoodMessage();
}

function updateMoodMessage() {
  const moodArray = moodMessages[fishState.mood];
  const randomIndex = Math.floor(Math.random() * moodArray.length);
  message.textContent = moodArray[randomIndex];
}

// Talk bubble functionality
function showTalkBubble(text) {
  talkBubble.textContent = text;
  talkBubble.classList.remove("hidden");
  
  // Position near fish
  talkBubble.style.left = (fishState.posX + 50) + "px";
  talkBubble.style.top = (fishState.posY - 20) + "%";
  
  // Hide after a few seconds
  setTimeout(() => {
    talkBubble.classList.add("hidden");
  }, 4000);
}

function showRandomTalkBubble() {
  const moodArray = moodMessages[fishState.mood];
  const randomIndex = Math.floor(Math.random() * moodArray.length);
  showTalkBubble(moodArray[randomIndex]);
  fishState.lastInteraction = Date.now();
  updateMood();
}

// Fish color changing
function changeFishColor(e) {
  const color = e.target.value;
  
  // Wait for SVG to load
  const fishObj = document.getElementById("fish");
  const fishSvg = fishObj.contentDocument || fishObj.getSVGDocument();
  
  if (fishSvg) {
    // Find all paths in the SVG that make up the fish body and tail
    const fishParts = fishSvg.querySelectorAll('path');
    fishParts.forEach(part => {
      // Only change fill color for body and tail (not fins)
      if (part.getAttribute('fill') && part.getAttribute('fill') !== 'none') {
        part.setAttribute('fill', color);
        
        // Adjust stroke color to be a darker shade of the fill color
        const darkerColor = getDarkerColor(color);
        part.setAttribute('stroke', darkerColor);
      }
    });
  } else {
    // Fallback if SVG document not accessible
    fish.style.filter = `drop-shadow(0 0 10px ${color})`;
  }
  
  showTalkBubble("Sweet color, bro! 🌈");
  fishState.lastInteraction = Date.now();
  updateMood();
}

function getDarkerColor(hexColor) {
  // Convert hex to RGB
  let r = parseInt(hexColor.substr(1, 2), 16);
  let g = parseInt(hexColor.substr(3, 2), 16);
  let b = parseInt(hexColor.substr(5, 2), 16);
  
  // Make darker by reducing each component by 30%
  r = Math.floor(r * 0.7);
  g = Math.floor(g * 0.7);
  b = Math.floor(b * 0.7);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Bubble animation
function createBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  
  // Random size and position
  const size = Math.random() * 20 + 10;
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";
  bubble.style.left = Math.random() * 100 + "%";
  
  // Random animation duration
  bubble.style.animationDuration = (Math.random() * 5 + 5) + "s";
  
  bubblesContainer.appendChild(bubble);
  
  // Play bubble sound occasionally (1 in 4 chance)
  if (Math.random() < 0.25) {
    // Choose bubble sound based on size
    if (size > 25) {
      aquariumSounds.play('bubbleLarge');
    } else if (size < 15) {
      aquariumSounds.play('bubbleSmall');
    } else {
      aquariumSounds.play('bubble');
    }
  }
  
  // Remove bubble after animation completes
  setTimeout(() => {
    if (bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  }, 10000);
}

// Fish interaction
function fishInteraction() {
  showTalkBubble("Yo! That tickles! 😄");
  fishState.lastInteraction = Date.now();
  
  // Play click sound
  aquariumSounds.play('click');
  
  // Make fish wiggle
  fish.style.transform += " rotate(10deg)";
  setTimeout(() => {
    fish.style.transform = fishState.direction === 1
      ? "translateY(-50%) scaleX(1)"
      : "translateY(-50%) scaleX(-1)";
  }, 300);
  
  // Play splash sound occasionally
  if (Math.random() < 0.3) {
    aquariumSounds.play('splash');
  }
  
  updateMood();
}

// Responsive handling
function handleResize() {
  // Reset fish position if window resized
  fishState.posX = Math.min(fishState.posX, aquarium.clientWidth - 100);
}

// Show guilty message if user came back
if (performance.navigation && performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD || document.referrer) {
  message.textContent = "You ditched me 😢";
  fishState.mood = "sad";
  setTimeout(() => {
    showTalkBubble("Where ya been?!");
  }, 1000);
}

// Sound toggle function
function toggleSounds() {
  const isPlaying = aquariumSounds.toggleBackground();
  updateSoundButtonIcon(isPlaying);
}

function updateSoundButtonIcon(isPlaying) {
  const icon = soundBtn.querySelector('i');
  if (isPlaying) {
    icon.className = 'fas fa-volume-up';
  } else {
    icon.className = 'fas fa-volume-mute';
  }
}

// Initialize everything
init();
