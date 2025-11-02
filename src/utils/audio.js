import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

let victorySound = null;
let backgroundMusic = null;
let levelSounds = {};
let currentLevelSound = null;

export const initAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

// Load and play level-specific sound
export const loadLevelSound = async (soundFile) => {
  try {
    if (!soundFile) return null;
    
    const soundKey = soundFile.toString();
    
    // Unload previous level sound if exists
    if (levelSounds[soundKey]) {
      try {
        await levelSounds[soundKey].unloadAsync();
      } catch (unloadError) {
        console.log('Error unloading previous sound:', unloadError);
      }
    }
    
    // Load new level sound with timeout and shouldPlay: false
    const loadPromise = Audio.Sound.createAsync(soundFile, { shouldPlay: false });
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Sound loading timeout')), 5000)
    );
    
    const { sound } = await Promise.race([loadPromise, timeoutPromise]);
    levelSounds[soundKey] = sound;
    return sound;
  } catch (error) {
    console.error('Error loading level sound:', error);
    return null;
  }
};

export const isSoundEnabled = async () => {
  try {
    const soundPref = await AsyncStorage.getItem('@biblepuzzlequest_sound_enabled');
    return soundPref === null ? true : soundPref === 'true';
  } catch (error) {
    console.error('Error checking sound setting:', error);
    return true; // Default to enabled
  }
};

export const playLevelSound = async (soundFile) => {
  try {
    if (!soundFile) return;
    
    // Check if sound is enabled
    const soundEnabled = await isSoundEnabled();
    if (!soundEnabled) return;
    
    const soundKey = soundFile.toString();
    let sound = levelSounds[soundKey];
    
    // Stop existing sound if it's playing
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.setPositionAsync(0); // Reset to beginning
      } catch (stopError) {
        console.log('Error stopping sound:', stopError);
      }
    } else {
      // Load sound if not already loaded
      sound = await loadLevelSound(soundFile);
    }
    
    if (sound) {
      // Check if sound is loaded before playing
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.replayAsync();
        currentLevelSound = soundKey; // Track current playing sound
      }
    }
  } catch (error) {
    console.error('Error playing level sound:', error);
  }
};

export const stopLevelSound = async (soundFile) => {
  try {
    if (!soundFile) return;
    
    const soundKey = soundFile.toString();
    if (levelSounds[soundKey]) {
      await levelSounds[soundKey].stopAsync();
      await levelSounds[soundKey].unloadAsync(); // Also unload to free memory
      delete levelSounds[soundKey]; // Remove from object
    }
    
    // Clear current level sound if it matches
    if (currentLevelSound === soundKey) {
      currentLevelSound = null;
    }
  } catch (error) {
    console.error('Error stopping level sound:', error);
  }
};

// Create a simple beep sound effect using synthesized audio
export const playVictorySound = async () => {
  try {
    // Use a simple built-in sound or skip if not available
    // In production, you would load an actual audio file
    if (victorySound) {
      await victorySound.playAsync();
    }
  } catch (error) {
    console.error('Error playing victory sound:', error);
  }
};

export const playClickSound = async () => {
  try {
    // Click sound effect
    if (Audio.Sound) {
      const sound = new Audio.Sound();
      // In production, load actual audio file
      // await sound.loadAsync(require('../assets/click.mp3'));
      // await sound.playAsync();
    }
  } catch (error) {
    console.error('Error playing click sound:', error);
  }
};

export const stopBackgroundMusic = async () => {
  try {
    if (backgroundMusic) {
      await backgroundMusic.stopAsync();
      await backgroundMusic.unloadAsync();
      backgroundMusic = null;
    }
  } catch (error) {
    console.error('Error stopping background music:', error);
  }
};

// Stop all level sounds immediately
export const stopAllLevelSounds = async () => {
  try {
    // Stop and unload all level sounds
    const soundKeys = Object.keys(levelSounds);
    await Promise.all(soundKeys.map(async (soundKey) => {
      if (levelSounds[soundKey]) {
        try {
          await levelSounds[soundKey].stopAsync();
          await levelSounds[soundKey].unloadAsync();
        } catch (error) {
          console.log('Error stopping sound during cleanup:', error);
        }
      }
    }));
    
    levelSounds = {};
    currentLevelSound = null;
  } catch (error) {
    console.error('Error stopping all level sounds:', error);
  }
};

export const cleanup = async () => {
  try {
    await stopBackgroundMusic();
    if (victorySound) {
      await victorySound.unloadAsync();
      victorySound = null;
    }
    
    await stopAllLevelSounds();
  } catch (error) {
    console.error('Error cleaning up audio:', error);
  }
};