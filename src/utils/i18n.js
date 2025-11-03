// Simple i18n implementation
import AsyncStorage from '@react-native-async-storage/async-storage';

// Translation data
const translations = {
  en: {
    // Home Screen
    home: {
      unlockSacredStories: "✨ Unlock Sacred Stories ✨",
      storiesUnlocked: "Stories Unlocked",
      totalStories: "Total Stories",
      personalRecords: "🏆 Personal Records",
      lastGame: "Last Game",
      allTimeBest: "All-Time Best",
      time: "Time",
      moves: "Moves",
      completePuzzlesToSeeRecords: "Complete puzzles to see your records!",
      continueQuest: "Continue Quest",
      startQuest: "Start Quest",
      selectLevel: "🎮 Select Level",
      completePuzzlesToDiscover: "Complete puzzles to discover Bible stories",
    },
    // Settings Screen
    settings: {
      title: "Settings",
      back: "← Back",
      audio: "🔊 Audio",
      puzzleSounds: "Puzzle Sounds",
      puzzleSoundsDescription: "Enable background sounds for puzzles",
      achievements: "🏆 Achievements",
      storiesCompleted: "Stories Completed",
      gamesWon: "Games Won",
      bestTime: "Best Time",
      bestMoves: "Best Moves",
      about: "ℹ️ About",
      aboutUs: "📖 About Us",
      appVersion: "📱 App Version",
      resetAllData: "🔄 Reset All Data",
      resetDataTitle: "⚠️ Reset All Data?",
      resetDataMessage: "This will permanently delete all your progress, achievements, badges, and settings. This action cannot be undone.",
      cancel: "Cancel",
      reset: "Reset",
      success: "Success!",
      dataResetSuccess: "All your data has been reset successfully.",
      error: "Error",
      dataResetError: "Failed to reset data. Please try again.",
      aboutUsContent: "🧩 Bizzle\n\nWe are a group of multidisciplinary individuals dedicated to creating a fun Christian puzzle game that encourages kids to explore Bible verses and captivating stories. Our mission is to make learning about the Bible an unforgettable adventure, combining interactive puzzles with uplifting gospel music.\n\n",
      madeWithFaith: "Made with faith and love",
    },
    // Game Screen
    game: {
      back: "← Back",
      restart: "🔄 Restart",
      hint: "💡 Hint",
      loadingLevel: "Loading level data...",
    },
    // Puzzle Grid Component
    puzzle: {
      try: "Try",
      limit: "Limit",
      remaining: "Remaining",
      close: "Close",
    },
    // Game Over Modal
    gameOver: {
      timesUp: "Time's Up!",
      outOfMoves: "Out of Moves!",
      time: "Time",
      moves: "Moves",
      restarts: "Restarts",
      status: "Status",
      incomplete: "Incomplete",
      timeRanOut: "Time ran out, but every moment is a learning opportunity!",
      pathChallenging: "The path was challenging, but wisdom comes through perseverance!",
      answerToRetry: "Answer a biblical question to earn another chance!",
      answerToRetryButton: "Answer to Retry",
      continueAnyway: "⚡ Continue Anyway",
      backToLevels: "Back to Levels",
      divineWisdom: "📖 Divine Wisdom",
      answerCorrectlyToRetry: "Answer correctly to retry!",
      timesUpQuiz: "⏰ Time's up!",
      correctRetrying: "🎉 Correct! Retrying level...",
      notQuiteRight: "❌ Not quite right. Try again later!",
      skipContinue: "⚡ Skip & Continue",
    },
    // Quiz Modal
    quiz: {
      score: "SCORE",
      streak: "STREAK",
      divineWisdom: "📖 Divine Wisdom",
      answerToContinue: "Answer to continue your quest",
      question: "Question",
      divineChallenge: "⚡ Divine Challenge",
      timesUpTryAgain: "⏰ Time's up! Try again!",
      correctPoints: "🎉 Correct! +{points} points!",
      notQuiteRightTryAgain: "❌ Not quite right. Try again!",
      wisdomGranted: "🙏 Wisdom granted! Starting new quest...",
      seekAnswerTryAgain: "📚 Seek answer and try again!",
      chooseWisely: "⚡ Choose wisely - you must answer correctly to continue!",
    },
    // Story Modal
    story: {
      youveUnlocked: "✨ You've Unlocked ✨",
      close: "Close",
      continue: "Continue",
    },
    // Puzzle Flip Card
    flipCard: {
      puzzleCompleted: "🎉 Puzzle Completed! 🎉",
      moves: "moves",
      tapToReveal: "Tap to reveal story",
      close: "Close",
    },
    // Level Selection Screen
    levelSelection: {
      chooseYourQuest: "Choose Your Quest",
      questComplete: "🎉 Quest Complete! 🎉",
      unlockedAllStories: "You've unlocked all the sacred stories!",
      faceDivineChallenge: "📖 Face Divine Challenge",
      returnHome: "Return Home",
      answerBiblicalQuestion: "⚡ Answer biblical question to continue your journey",
      wisdomGranted: "🎉 Wisdom Granted!",
      correctAnswerMessage: "You have answered correctly! Your quest continues with a fresh start.",
      beginNewQuest: "Begin New Quest",
      moreStoriesComingSoon: "More Stories Coming Soon!",
      newAdventuresPrepared: "New biblical adventures are being prepared for you",
    },
    // Level Card Component
    levelCard: {
      level: "Level",
      locked: "Locked",
      completed: "✓ Completed",
    },
    // Common
    common: {
      language: "Language",
      english: "English",
      amharic: "አማርኛ",
    }
  },
  am: {
    // Home Screen
    home: {
      unlockSacredStories: "✨ ቅዱሳን ታሪኮችን ይክፈቱ ✨",
      storiesUnlocked: "የተከፈቱ ታሪኮች",
      totalStories: "ጠቅላላ ታሪኮች",
      personalRecords: "🏆 የግል መዘክሮች",
      lastGame: "የመጨረሻው ጨዋታ",
      allTimeBest: "ከአጠቃልይ",
      time: "ጊዜ",
      moves: "እንቅስቃሴዎች",
      completePuzzlesToSeeRecords: "መዘክሮችን ለማየት ፋዝሎችን ይሙሉ!",
      continueQuest: "ጉዞውን ይቀጥሉ",
      startQuest: "ጉዞውን ይጀምሩ",
      selectLevel: "🎮 ደረጃ ይምረጡ",
      completePuzzlesToDiscover: "የመጽሐፍ ቅዱስ ታሪኮችን ለማውቀት ፐዝሎችን ይሙሉ",
    },
    // Settings Screen
    settings: {
      title: "ቅንብሮች",
      back: "← ይመለሱ",
      audio: "🔊 ድምፅ",
      puzzleSounds: "የፐዝል ድምፆች",
      puzzleSoundsDescription: "ለፐዝሎች የመደብ ድምፆችን ያንቁ",
      achievements: "🏆 ስኬቶች",
      storiesCompleted: "የተጠናቀቁ ታሪኮች",
      gamesWon: "የአሸነፏቸው ጨዋታዎች",
      bestTime: "ፈጣን ጊዜ",
      bestMoves: "ቀሪ እንቅስቃሴዎች",
      about: "ℹ️ መረጃ",
      aboutUs: "📖 ስለ እኛ",
      appVersion: "📱 የመተግበሪያ ስሪት",
      resetAllData: "🔄 ሁሉንም ቋት እንደገና ያስጀምሩ",
      resetDataTitle: "⚠️ ሁሉንም ቋት እንደገና ይጀምሩ?",
      resetDataMessage: "ይህ ሁሉንም የእርስዎ እድገት፣ ስኬቶች፣ ባጅዎች እና ቅንብሮችን እስከመጨረሻው ይሰርዛል። ይህንን ተግባር መመለስ አይቻልም።",
      cancel: "ይቅር",
      reset: "እንደገና ያስጀምሩ",
      success: "በትክክል ተከናወኗል!",
      dataResetSuccess: "ሁሉም ዳታዎ በተሳካ ሁኔታ እንደገና ተጀምሯል።",
      error: "ስህተት",
      dataResetError: "ዳታውን እንደገና ማስጀመር አልተቻለም። እባክዎ በድጋሜ ይሞክሩ።",
      aboutUsContent: "🧩 የመጽሐፍ ቅዱስ ፐዝል ጉዞ\n\nእኛ የመጽሐፍ ቅዱስ አንቀጾችን እና ገጸባህሪያትን ለመመልከት ልጆችን ለማበረታታት የተሰማሩ የተለያዩ የሙያ ሰዎች ቡድን ነን።\n\n",
      madeWithFaith: "በእምነት እና በፍቅር የተሰራ",
    },
    // Game Screen
    game: {
      back: "← ይመለሱ",
      restart: "🔄 እንደገና ይጀምሩ",
      hint: "💡 ፍንጭ",
      loadingLevel: "የደረጃ መረጃ በመጫን ላይ...",
    },
    // Puzzle Grid Component
    puzzle: {
      try: "ሙከራ",
      limit: "ገደብ",
      remaining: "ቀሪ",
      close: "ይዝጉ",
    },
    // Game Over Modal
    gameOver: {
      timesUp: "ሰዓት አልቋል!",
      outOfMoves: "እንቅስቃሴዎች ጨርሰዋል!",
      time: "ሰዓት",
      moves: "እንቅስቃሴዎች",
      restarts: "እንደገናዎች",
      status: "ሁኔታ",
      incomplete: "አልተጠናቀቀም",
      timeRanOut: "ሰዓት አልቋል ግን እያንዳንዱ ደቂቃ የመማሪያ እድል ነው!",
      pathChallenging: "መንገዱው አስቸጋሪ ነበር ጥበብ በቋሚነት ይመጣል!",
      answerToRetry: "ሌላ እንደገና ለመሞከር የመጽሐፍ ቅዱስ ጥያቄዎቹን ይመልሱ!",
      answerToRetryButton: "ድጋሚ ለመሞከር ይመልሱ",
      backToLevels: "ወደ ደረጃዎች ይመለሱ",
      divineWisdom: "📖 የእግዚእብሔር ጥበብ",
      answerCorrectlyToRetry: "እንደገና ለመሞከር በትክክል ይመልሱ!",
      timesUpQuiz: "⏰ ስዓት አልቋል!",
      correctRetrying: "🎉 ትክክል! ደረጃውን በድጋሜ በማስጀመር ላይ...",
      notQuiteRight: "❌ ትክክል አይደለም። በድጋሜ ይሞክሩ!",
    },
    // Quiz Modal
    quiz: {
      score: "ነጥብ",
      streak: "ተከታታይ",
      divineWisdom: "📖 የእግዚእብሔር ጥበብ",
      answerToContinue: "ጉዞዎን ለመቀጠል ይመልሱ",
      question: "ጥያቄ",
      divineChallenge: "⚡ የእግዚእብሔር ፈተና",
      timesUpTryAgain: "⏰ ሰዓት አልቋል! በድጋሜ ይሞክሩ!",
      correctPoints: "🎉 ትክክለኛ! +{points} ነጥሮች!",
      notQuiteRightTryAgain: "❌ ትክክል አይደለም። በድጋሜ ይሞክሩ!",
      wisdomGranted: "🙏 ጥበብ ተሰጠ! አዲስ ጉዞ በመጀመር ላይ...",
      seekAnswerTryAgain: "📚 መልስ ይፈልጉ እና በድጋሜ ይሞክሩ!",
      chooseWisely: "⚡ በጥንቃቄ ይምረጡ - ለመቀጠል በትክክል መመለስ አለብዎት!",
      skipContinue: "በማስታወር ይቀጥሉ",
    },
    // Story Modal
    story: {
      youveUnlocked: "✨ ተክፍቷል ✨",
      close: "ይዝጉ",
      continue: "ይቀጥሉ",
    },
    // Puzzle Flip Card
    flipCard: {
      puzzleCompleted: "🎉 ፐዝል ተጠናቋል! 🎉",
      moves: "እንቅስቃሴዎች",
      tapToReveal: "ታሪኩን ለማየት ይጫኑ",
      close: "ይዝጉ",
    },
    // Level Selection Screen
    levelSelection: {
      chooseYourQuest: "ጉዞዎን ይምረጡ",
      questComplete: "🎉 ጉዞው ተጠናቋል! 🎉",
      unlockedAllStories: "ሁሉንም ቅዱሳን ታሪኮች አስከፍተዋል!",
      faceDivineChallenge: "📖 የመጽሐፍ ቅዱስ ፈተናን ይመልከቱ",
      returnHome: "ወደ ዋናው ይመልሱ",
      answerBiblicalQuestion: "⚡ ጉዞዎን ለመቀጠል የመጽሐፍ ቅዱስ ጥያቄዎቹን ይመልሱ",
      wisdomGranted: "🎉 ጥበብ ተሰጠ!",
      correctAnswerMessage: "በትክክል መልሰዋል! ጉዞዎ በአዲስ መልክ ይቀጥላል።",
      beginNewQuest: "አዲስ ጉዞ ይጀምሩ",
      moreStoriesComingSoon: "ተጨማሪ ታሪኮች በቅርቡ!",
      newAdventuresPrepared: "አዳዲስ የመጽሐፍ ቅዱስ ታሪኮች ለእርስዎ በዝግጅት ላይ ናቸው",
    },
    // Level Card Component
    levelCard: {
      level: "ደረጃ",
      locked: "ተቆለፏል",
      completed: "✓ ተጠናቋል",
    },
    // Common
    common: {
      language: "ቋንቋ",
      english: "English",
      amharic: "አማርኛ",
    }
  }
};

class I18n {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = translations;
    this.listeners = [];
  }

  async init() {
    try {
      const savedLanguage = await AsyncStorage.getItem('@biblepuzzlequest_language');
      if (savedLanguage && translations[savedLanguage]) {
        this.currentLanguage = savedLanguage;
      }
    } catch (error) {
      console.log('Error loading language setting:', error);
    }
  }

  async setLanguage(language) {
    if (translations[language]) {
      this.currentLanguage = language;
      try {
        await AsyncStorage.setItem('@biblepuzzlequest_language', language);
      } catch (error) {
        console.log('Error saving language setting:', error);
      }
      // Notify all listeners
      this.listeners.forEach(listener => listener());
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  t(key) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to English if key not found
        translation = this.translations.en;
        for (const fallbackKey of keys) {
          if (translation && translation[fallbackKey]) {
            translation = translation[fallbackKey];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }
    
    return translation || key;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

const i18n = new I18n();

export default i18n;