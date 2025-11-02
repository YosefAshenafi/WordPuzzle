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
      continueQuest: "▶ Continue Quest",
      startQuest: "▶ Start Quest",
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
      aboutUsContent: "🧩 Bible Puzzle Quest\n\nWe are a group of multidisciplinary individuals dedicated to creating a fun Christian puzzle game that encourages kids to explore Bible verses and captivating stories. Our mission is to make learning about the Bible an unforgettable adventure, combining interactive puzzles with uplifting gospel music.\n\n",
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
      close: "✕ Close",
    },
    // Game Over Modal
    gameOver: {
      timesUp: "⏰ Time's Up!",
      outOfMoves: "⏰ Out of Moves!",
      time: "⏱️ Time",
      restarts: "🔄 Restarts",
      status: "📊 Status",
      incomplete: "❌ Incomplete",
      timeRanOut: "Time ran out, but every moment is a learning opportunity!",
      pathChallenging: "The path was challenging, but wisdom comes through perseverance!",
      answerToRetry: "Answer a biblical question to earn another chance!",
      answerToRetryButton: "Answer to Retry",
      backToLevels: "← Back to Levels",
      divineWisdom: "📖 Divine Wisdom",
      answerCorrectlyToRetry: "Answer correctly to retry!",
      timesUpQuiz: "⏰ Time's up!",
      correctRetrying: "🎉 Correct! Retrying level...",
      notQuiteRight: "❌ Not quite right. Try again later!",
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
      continueQuest: "▶ ጉዞውን ይቀጥሉ",
      startQuest: "▶ ጉዞውን ይጀምሩ",
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
      gamesWon: "የተሸነፉ ጨዋታዎች",
      bestTime: "ጥሩ ጊዜ",
      bestMoves: "ቀሪ እንቅስቃሴዎች",
      about: "ℹ️ ᵍለ",
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
      aboutUsContent: "🧩 የመጽሐፍ ቅዱስ ፐዝል ጉዞ\n\nእኛ የመጽሐፍ ቅዱስ አንቀጾችን እና ገጸባህሪያትን ለመመልከት ልጆችን ለማበረታታት የተሰማሩ የተለያዩ የሙያ ሰዎች ቡድን ነን። የእኛ ተልእኮ የመጽሐፍ ቅዱስን ማወቅን በንትር ፋዝሎች እና በአድነት ያለው የወንጌል ሙዚቃ በመዋሃድ እስከመጨረሻው ያልተረዳን ተልእኮ ማድረግ ነው።\n\n",
      madeWithFaith: "በእምነት እና በፍቅር የተሰራ",
    },
    // Game Screen
    game: {
      back: "← ይመለሱ",
      restart: "🔄 እንደገና ይጀምሩ",
      hint: "💡 ፍንጭ",
      loadingLevel: "የደረጃ ዳታ በመጠን ነው...",
    },
    // Puzzle Grid Component
    puzzle: {
      try: "ሙከራ",
      limit: "ገደብ",
      remaining: "ቀሪ",
      close: "✕ ዝጋ",
    },
    // Game Over Modal
    gameOver: {
      timesUp: "⏰ ጊዜ ደረቀ!",
      outOfMoves: "⏰ እንቅስቃሴዎች አለቀ!",
      time: "⏱️ ጊዜ",
      restarts: "🔄 እንደገናዎች",
      status: "📊 ሁኔታ",
      incomplete: "❌ አልተጠናነ",
      timeRanOut: "ጊዜ አለፈ ግን እያንደር ደረቃው የመማሪያ እድል ነው!",
      pathChallenging: "መንገዱው አስቸግሎ ነበር ጥበብ በቋሚነት ይመጣል!",
      answerToRetry: "ሌላ እንደገና ለመሞከር የመጽሐፍ ቅዱስ ጥያቄን ይመልሱ!",
      answerToRetryButton: "ለመሞከር ይመልሱ",
      backToLevels: "← ወደ ደረጃዎች ተመለስ",
      divineWisdom: "📖 የእግዚእ ጥበብ",
      answerCorrectlyToRetry: "በትክክል ለመሞከር ይመልሱ!",
      timesUpQuiz: "⏰ ጊዜ ደረቀ!",
      correctRetrying: "🎉 ትክክ! ደረጃውን በድጋሜ ይጀምራል...",
      notQuiteRight: "❌ በጣም አይደለም። በድጋሜ ይሞክሩ!",
    },
    // Quiz Modal
    quiz: {
      score: "ነጥር",
      streak: "ተከታል",
      divineWisdom: "📖 የእግዚእ ጥበብ",
      answerToContinue: "ጉዞዎን ለመቀጠል ይመልሱ",
      question: "ጥያቄ",
      divineChallenge: "⚡ የእግዚእ ፈተና",
      timesUpTryAgain: "⏰ ጊዜ ደረቀ! በድጋሜ ይሞክሩ!",
      correctPoints: "🎉 ትክክ! +{points} ነጥሮች!",
      notQuiteRightTryAgain: "❌ በጣም አይደለም። በድጋሜ ይሞክሩ!",
      wisdomGranted: "🙏 ጥበብ ተሰጠ! አዲስ ጉዞ በመጀመር ላይ...",
      seekAnswerTryAgain: "📚 መልስን ይፈልጡ እና በድጋሜ ይሞክሩ!",
      chooseWisely: "⚡ በጥብቀት ይምረጡ - ለመቀጠል በትክክል መልስ አለብዎት!",
    },
    // Story Modal
    story: {
      youveUnlocked: "✨ አክተዋል ✨",
      close: "ዝጋ",
      continue: "ቀጥል",
    },
    // Puzzle Flip Card
    flipCard: {
      puzzleCompleted: "🎉 ፋዝል ተጠናቀ! 🎉",
      moves: "እንቅስቃሴዎች",
      tapToReveal: "ታሪኩን ለማሳየት ይጫኑ",
      close: "ዝጋ",
    },
    // Level Selection Screen
    levelSelection: {
      chooseYourQuest: "ጉዞዎን ይምረጡ",
      questComplete: "🎉 ጉዞው ተጠናቀቀ! 🎉",
      unlockedAllStories: "ሁሉንም ቅዱሳን ታሪኮች አክተዋል!",
      faceDivineChallenge: "📖 የመጽሐፍ ቅዱስ ፈተናን ይመልከቱ",
      returnHome: "ወደ ቤት ተመለስ",
      answerBiblicalQuestion: "⚡ ጉዞዎን ለመቀጠል የመጽሐፍ ቅዱስ ጥያቄን ይመልሱ",
      wisdomGranted: "🎉 ጥበብ ተሰጠ!",
      correctAnswerMessage: "በትክክል መለሱ! ጉዞዎ በአዲስ መልክዮ ይቀጥላል።",
      beginNewQuest: "አዲስ ጉዞ ጀምር",
    },
    // Level Card Component
    levelCard: {
      level: "ደረጃ",
      locked: "ተቆለፈ",
      completed: "✓ ተጠናቀ",
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