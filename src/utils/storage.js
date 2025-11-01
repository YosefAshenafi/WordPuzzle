import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@biblepuzzlequest_progress';
const GAME_DATA_KEY = '@biblepuzzlequest_gamedata';
const QUIZ_STATE_KEY = '@biblepuzzlequest_quizstate';

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
