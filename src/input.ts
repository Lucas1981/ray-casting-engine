// src/input.ts

// Define a type for the keys we want to monitor
type KeyMap = {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

// Initialize the keys map with all keys set to false
const keys: KeyMap = {
  up: false,
  down: false,
  left: false,
  right: false
}

// Function to handle keydown events
const handleKeyDown = (event: KeyboardEvent): void => {
  switch (event.key) {
    case 'ArrowUp':
      keys.up = true
      break
    case 'ArrowDown':
      keys.down = true
      break
    case 'ArrowLeft':
      keys.left = true
      break
    case 'ArrowRight':
      keys.right = true
      break
  }
}

// Function to handle keyup events
const handleKeyUp = (event: KeyboardEvent): void => {
  switch (event.key) {
    case 'ArrowUp':
      keys.up = false
      break
    case 'ArrowDown':
      keys.down = false
      break
    case 'ArrowLeft':
      keys.left = false
      break
    case 'ArrowRight':
      keys.right = false
      break
  }
}

// Add event listeners to track key presses and releases
window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)

// Export the keys map
export { keys }
