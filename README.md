# 🧩 Bizzle - Biblical Word Puzzle Game

A spiritually inspired word puzzle adventure game built with Expo React Native (SDK 54). Combine Bible storytelling with interactive jigsaw puzzle gameplay to unlock sacred stories from Scripture.

## 🎮 Game Overview

Bizzle is a mobile puzzle game that takes players on a journey through six biblical stories through jigsaw puzzle gameplay. Each completed puzzle unlocks a new chapter of biblical history, accompanied by beautiful background music and storytelling.

### Stories Included
1. **Samson** (Judges 13-16) - Divine strength and redemption
2. **Jesus** (Matthew 1-28) - The life, death, and resurrection of Christ
3. **The Word** (Exodus 20) - God's commandments and moral law
4. **Creation** (Genesis 1) - God's creation of the world
5. **All The World** (Genesis 2-3) - The fall of man and God's grace
6. **Song To Jesus** (Psalm 150) - Worship and praise through music

## ✨ Features

### Core Gameplay
- **Jigsaw Puzzle Mechanics** with swappable puzzle pieces
- **Progressive Level System** with lock mechanics
- **Move Counters and Time Tracking** for each level
- **Victory Animations** with confetti effects
- **Story Revelations** after puzzle completion
- **Game Over System** with retry options and biblical trivia

### UI/UX Features
- **Animated Custom Splash Screen** with zoom effects
- **Multi-language Support** (English & Amharic)
- **Beautiful Gradient Backgrounds** with animated decorations
- **Smooth Animations** using React Native Reanimated
- **Persistent Progress Saving** using AsyncStorage
- **Audio Integration** with background music for each level
- **Firebase Authentication** (Google Sign-In, Email/Password)
- **Leaderboard System** (mock implementation ready)

### Visual Features
- **Custom Level Cards** with completion badges
- **Coming Soon Card** for future levels
- **Modal Dialogs** for stories, game over, and quizzes
- **Animated Backgrounds** with decorative circles
- **Level-specific Images** bundled locally

## 🛠️ Technology Stack

- **Framework**: Expo SDK 54
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Navigation**: React Navigation (Stack Navigator)
- **State Management**: React Context API + Hooks
- **Animations**: React Native Reanimated 4.1.1
- **Storage**: AsyncStorage 2.2.0
- **Audio**: expo-av 16.0.7
- **Authentication**: Firebase 12.5.0
- **Styling**:
  - expo-linear-gradient 15.0.7
  - react-native-paper 5.12.0
- **Gesture Handling**: react-native-gesture-handler 2.28.0
- **Additional Effects**:
  - moti 0.27.0 (animations)
  - react-native-confetti-view 1.0.0

## 📋 Project Structure

```
bizzle/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── src/
    ├── screens/
    │   ├── HomeScreen.js           # Home screen with progress
    │   ├── LevelSelectionScreen.js # Level grid with unlock system
    │   ├── GameScreen.js           # Main jigsaw puzzle game
    │   ├── AuthScreen.js           # Authentication (Google/Email)
    │   ├── LeaderboardScreen.js    # Player rankings
    │   └── SettingsScreen.js       # App settings
    ├── components/
    │   ├── AnimatedBackground.js   # Reusable animated background
    │   ├── JigsawGrid.js           # Main puzzle grid component
    │   ├── PuzzleFlipCard.js       # Individual puzzle piece
    │   ├── StoryModal.js           # Story revelation modal
    │   ├── GameOverModal.js        # Game over screen with quiz
    │   ├── QuizModal.js            # Biblical trivia quiz
    │   ├── LevelCard.js            # Level selection card
    │   └── CustomSplashScreen.js   # Animated splash screen
    ├── navigation/
    │   └── RootNavigator.js        # Navigation + Auth provider
    ├── contexts/
    │   ├── AuthContext.js          # Firebase authentication
    │   └── LanguageContext.js      # i18n language context
    ├── services/
    │   └── leaderboardService.js   # Leaderboard API (mock)
    ├── utils/
    │   ├── storage.js              # AsyncStorage operations
    │   ├── puzzleLogic.js          # Puzzle game logic
    │   ├── audio.js                # Audio management
    │   └── i18n.js                 # Translation utilities
    ├── constants/
    │   ├── levels.js               # Level data & Bible stories
    │   ├── colors.js               # Color palette & gradients
    │   └── badges.js               # Achievement badges
    └── assets/
        ├── images/                 # Level images (PNG)
        ├── sounds/                 # Background music (MP3)
        ├── icon.png                # App icon
        └── adaptive-icon.png       # Android adaptive icon
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Physical device with Expo Go app (optional)

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd bizzle
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
```

3. **Start the development server**:
```bash
npm start
# or
expo start
```

4. **Run on iOS or Android**:
```bash
# For iOS
npm run ios

# For Android
npm run android

# Or scan QR code with Expo Go app
```

## 📱 Screens & Navigation

### Custom Splash Screen
- Animated app icon with zoom in/out effects
- Breathing/pulse animation
- Gradient background with decorative circles

### Home Screen
- Welcome message with animated title
- Language toggle (English/Amharic)
- Progress display (completed levels / total)
- User profile with sign-out option
- "Start Quest" or "Continue Quest" button
- Navigation to levels, leaderboard, and settings

### Level Selection Screen
- Grid view of all 6 levels + "Coming Soon" card
- Lock icons on unavailable levels
- Completion badges on finished levels
- Progress counter (X/6)
- Smooth animations and transitions
- Home button for quick navigation

### Game Screen
- Jigsaw puzzle with swappable pieces
- Real-time move counter
- Timer display
- Shuffle and back buttons
- Background music controls
- Hint system (optional)
- Victory modal with story revelation

### Auth Screen
- Google Sign-In integration
- Email/Password authentication
- User registration
- Firebase backend

### Leaderboard Screen
- Top players ranking
- Player stats display
- Current user highlighting
- Mock data implementation

## 🎮 Game Mechanics

### Jigsaw Puzzle System
- **Piece Selection**: Tap two pieces to swap positions
- **Grid Sizes**: 3x3 (Level 1-2), 4x4 (Level 3-5), 5x5 (Level 6)
- **Move Limits**: Each level has maximum allowed moves
- **Win Condition**: Arrange all pieces in correct grid positions
- **Shuffle Feature**: Randomize pieces at game start
- **Progress Saving**: Auto-save completion and unlock next level

### Audio Integration
- Background music specific to each level
- Automatic audio loading and playback
- Cleanup on screen exit
- Volume controls

### Progression System
- Level 1 starts unlocked
- Sequential unlocking (complete Level N to unlock N+1)
- Automatic progress persistence
- Return to any unlocked level anytime
- Final quiz after completing all 6 levels

### Quiz System
- Biblical trivia questions
- Multiple choice answers
- Appears after completing all levels or on game over
- Correct answer reveals additional content

## 🎨 Design System

### Color Palette
```javascript
COLORS = {
  primary: '#6B46C1',    // Deep Purple
  secondary: '#EC4899',  // Pink
  accent: '#14B8A6',     // Teal
  gold: '#F59E0B',       // Gold highlights
  success: '#10B981',    // Green
  danger: '#EF4444',     // Red
  darker: '#1A1A2E',     // Dark background
  light: '#E0E0E0',      // Light text
}
```

### Gradients
- **Primary**: Purple to Pink
- **Secondary**: Teal to Purple
- **Success**: Green shades
- **Dark**: Dark blue shades

### Animations
- Spring animations for interactions
- Fade transitions between screens
- Scale animations for victories
- Confetti effects on puzzle completion
- Breathing/pulse effects on splash screen

## 🌍 Internationalization (i18n)

The app supports multiple languages through a custom translation system:

**Supported Languages:**
- English (`en`)
- Amharic (`am`)

**Translatable Content:**
- UI labels and buttons
- Level titles and stories
- Bible verses and references
- Error messages
- Game instructions

Language can be toggled from the Home Screen.

## 📊 Data Persistence

### Progress Storage
```javascript
// AsyncStorage structure
{
  "progress": {
    "1": true,  // Level 1 completed
    "2": false, // Level 2 not completed
    // ...
  },
  "currentLevel": 3,
  "language": "en"
}
```

### User Statistics (per level)
```javascript
{
  "levelId": {
    "moves": 45,
    "time": 120,
    "completed": true,
    "attempts": 3
  }
}
```

## 🔐 Authentication

Firebase Authentication integrated with:
- **Google Sign-In** (OAuth)
- **Email/Password** authentication
- User profile management
- Persistent auth state
- Mock Firestore for user data (ready for implementation)

## 🎵 Audio Assets

Each level includes background music:
- `samson.MP3`
- `jesus.MP3`
- `the-word.MP3`
- `creation.mp3`
- `all-the-world.MP3`
- `song-to-jesus.MP3`

Audio files are located in `src/assets/sounds/`

## 📖 Biblical Content

All stories are biblically accurate with direct references:

1. **Samson** - Judges 13-16 (Divine strength and redemption)
2. **Jesus** - Matthew 1-28 (Life, death, and resurrection)
3. **The Word** - Exodus 20 (Ten Commandments)
4. **Creation** - Genesis 1 (God creates the world)
5. **All The World** - Genesis 2-3 (Fall of man, God's grace)
6. **Song To Jesus** - Psalm 150 (Worship and praise)

## 🐛 Known Limitations

- Firebase configured but using mock data for leaderboard
- No cloud sync for progress (local only)
- Limited to 6 levels (expandable)
- Audio requires internet on first load

## 🔮 Future Enhancements

- [ ] Cloud save sync via Firebase Firestore
- [ ] Real leaderboard with global rankings
- [ ] Additional biblical stories (New Testament expansion)
- [ ] Difficulty levels (Easy/Normal/Hard)
- [ ] Achievement badges system
- [ ] Social sharing of progress
- [ ] Dark mode theme
- [ ] Offline bundle for all assets
- [ ] Hint/help system improvements
- [ ] Custom puzzle piece shapes
- [ ] Time attack mode
- [ ] Multiplayer challenges

## 🙏 Spiritual Purpose

Bizzle is designed to be both entertaining and spiritually enriching, introducing players to important biblical narratives in an interactive and memorable way. Through puzzle-solving and engaging gameplay, players connect with timeless stories of faith, redemption, and God's love.

## 📄 License

MIT License - Feel free to use this as a base for your own projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues

## 📧 Support

For issues or questions:
- Check the [Expo documentation](https://docs.expo.dev/)
- Review the Firebase setup guide
- Open an issue on GitHub

---

**Made with ❤️ and faith**

*"Let everything that has breath praise the Lord." - Psalm 150:6*
