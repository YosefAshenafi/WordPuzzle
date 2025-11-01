import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@biblepuzzlequest_progress';
const GAME_DATA_KEY = '@biblepuzzlequest_gamedata';
const QUIZ_STATE_KEY = '@biblepuzzlequest_quizstate';
const BADGES_KEY = '@biblepuzzlequest_badges';

export const saveProgress = async (levelId, completed) => {
  try {
    const existing = await getProgress();
    const updated = { ...existing, [levelId]: completed };
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

export const getProgress = async () => {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting progress:', error);
    return {};
  }
};

export const saveLevelStats = async (levelId, stats) => {
  try {
    const existing = await AsyncStorage.getItem(GAME_DATA_KEY);
    const data = existing ? JSON.parse(existing) : {};
    data[levelId] = stats;
    await AsyncStorage.setItem(GAME_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving level stats:', error);
    return false;
  }
};

export const getLevelStats = async (levelId) => {
  try {
    const data = await AsyncStorage.getItem(GAME_DATA_KEY);
    if (!data) return null;
    const gameData = JSON.parse(data);
    return gameData[levelId] || null;
  } catch (error) {
    console.error('Error getting level stats:', error);
    return null;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([PROGRESS_KEY, GAME_DATA_KEY]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const getAllStats = async () => {
  try {
    const data = await AsyncStorage.getItem(GAME_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting all stats:', error);
    return {};
  }
};

export const saveQuizState = async (quizState) => {
  try {
    await AsyncStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(quizState));
    return true;
  } catch (error) {
    console.error('Error saving quiz state:', error);
    return false;
  }
};

export const getQuizState = async () => {
  try {
    const data = await AsyncStorage.getItem(QUIZ_STATE_KEY);
    return data ? JSON.parse(data) : { canPlay: true, timeoutUntil: null };
  } catch (error) {
    console.error('Error getting quiz state:', error);
    return { canPlay: true, timeoutUntil: null };
  }
};

export const setQuizTimeout = async (timeoutSeconds) => {
  try {
    const timeoutUntil = Date.now() + (timeoutSeconds * 1000);
    const quizState = { canPlay: false, timeoutUntil };
    await saveQuizState(quizState);
    return true;
  } catch (error) {
    console.error('Error setting quiz timeout:', error);
    return false;
  }
};

export const checkQuizTimeout = async () => {
  try {
    const quizState = await getQuizState();
    if (!quizState.canPlay && quizState.timeoutUntil) {
      if (Date.now() >= quizState.timeoutUntil) {
        await saveQuizState({ canPlay: true, timeoutUntil: null });
        return { canPlay: true, timeLeft: 0 };
      } else {
        const timeLeft = Math.ceil((quizState.timeoutUntil - Date.now()) / 1000);
        return { canPlay: false, timeLeft };
      }
    }
    return { canPlay: true, timeLeft: 0 };
  } catch (error) {
    console.error('Error checking quiz timeout:', error);
    return { canPlay: true, timeLeft: 0 };
  }
};

// Save current game state
export const saveCurrentGameState = async (levelId, gameState) => {
  try {
    const key = `@biblepuzzlequest_currentgame_${levelId}`;
    await AsyncStorage.setItem(key, JSON.stringify(gameState));
    return true;
  } catch (error) {
    console.error('Error saving current game state:', error);
    return false;
  }
};

// Load current game state
export const loadCurrentGameState = async (levelId) => {
  try {
    const key = `@biblepuzzlequest_currentgame_${levelId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading current game state:', error);
    return null;
  }
};

// Clear current game state
export const clearCurrentGameState = async (levelId) => {
  try {
    const key = `@biblepuzzlequest_currentgame_${levelId}`;
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing current game state:', error);
    return false;
  }
};

// Save badges
export const saveBadges = async (badgeIds) => {
  try {
    await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(badgeIds));
    return true;
  } catch (error) {
    console.error('Error saving badges:', error);
    return false;
  }
};

// Get badges
export const getBadges = async () => {
  try {
    const data = await AsyncStorage.getItem(BADGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting badges:', error);
    return [];
  }
};

// Add a badge
export const addBadge = async (badgeId) => {
  try {
    const existingBadges = await getBadges();
    if (!existingBadges.includes(badgeId)) {
      const updatedBadges = [...existingBadges, badgeId];
      await saveBadges(updatedBadges);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding badge:', error);
    return false;
  }
};
