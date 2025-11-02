import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PuzzleGrid } from '../components/PuzzleGrid';
import { JigsawGrid } from '../components/JigsawGrid';
import { PuzzleTypeSelector } from '../components/PuzzleTypeSelector';
import { StoryModal } from '../components/StoryModal';
import { PuzzleFlipCard } from '../components/PuzzleFlipCard';
import { QuizModal } from '../components/QuizModal';
import { GameOverModal } from '../components/GameOverModal';

import {
  generatePuzzleTiles,
  isPuzzleSolved,
  swapTiles,
  isValidMove,
  debugShuffle,
} from '../utils/puzzleLogic';
import { saveProgress, saveLevelStats, saveCurrentGameState, loadCurrentGameState, clearCurrentGameState } from '../utils/storage';
import { playVictorySound, loadLevelSound, playLevelSound, stopLevelSound, stopAllLevelSounds, isSoundEnabled } from '../utils/audio';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardService } from '../services/leaderboardService';
import Confetti from 'react-native-confetti-view';

export const GameScreen = ({ route, navigation }) => {
  const { level, isContinue = false } = route.params || {};
  
  // Safety check for level with default values
  const safeLevel = level || {
    id: 1,
    title: 'Loading...',
    bibleRef: 'Genesis 1',
    verse: '"In the beginning God created the heavens and the earth." - Genesis 1:1',
    gridSize: 4,
    moves: 50,
    slidingMoves: 50,
    jigsawMoves: 40,
    image: null,
    sound: null
  };
  
  // Show loading state if level is not available yet
  if (!level) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A'}}>
        <Text style={{color: '#F59E0B', fontSize: 18, fontWeight: 'bold'}}>
          Loading level data...
        </Text>
      </View>
    );
  }
  const { user } = useAuth();
  const [tiles, setTiles] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showFlipCard, setShowFlipCard] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const victoryScale = new Animated.Value(0);

  useEffect(() => {
    setRestartCount(0);
    initializeGame(isContinue);
    
    // Load sound setting
    isSoundEnabled().then(setSoundEnabled);
    
    return () => {
      // Stop all level sounds when leaving the screen to ensure no audio plays outside puzzle
      stopAllLevelSounds().catch(error => {
        console.log('Error stopping all sounds:', error);
      });
    };
  }, [level, isContinue]);

  useEffect(() => {
    let interval;
    if (gameStarted && !isComplete) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isComplete]);

  // Auto-save game state when it changes
  useEffect(() => {
    if (gameStarted && !isComplete && tiles.length > 0) {
      const gameState = {
        tiles,
        moveCount,
        timer,
        showHints,
        hintsRemaining,
        timestamp: Date.now()
      };
      saveCurrentGameState(safeLevel.id, gameState);
    }
  }, [tiles, moveCount, timer, showHints, hintsRemaining, gameStarted, isComplete]);

  // Auto-save game state when it changes
  useEffect(() => {
    if (gameStarted && !isComplete && tiles.length > 0) {
      const gameState = {
        tiles,
        moveCount,
        timer,
        showHints,
        hintsRemaining,
        timestamp: Date.now()
      };
      saveCurrentGameState(safeLevel.id, gameState);
    }
  }, [tiles, moveCount, timer, showHints, hintsRemaining, gameStarted, isComplete]);

const initializeGame = (isContinue = false) => {
    if (isContinue) {
      // Try to load saved game state
      loadCurrentGameState(safeLevel.id).then(savedState => {
        if (savedState) {
          // Restore saved state
          setTiles(savedState.tiles);
          setMoveCount(savedState.moveCount);
          setTimer(savedState.timer);
          setGameStarted(true);
          setIsComplete(false);
          setShowHints(savedState.showHints || false);
          setHintsRemaining(savedState.hintsRemaining !== undefined ? savedState.hintsRemaining : 3);
        } else {
          // No saved state, start fresh
          startFreshGame();
        }
      }).catch(error => {
        console.log('Error loading saved state, starting fresh:', error);
        startFreshGame();
      });
    } else {
      // Start fresh game
      startFreshGame();
    }
  };

  const startFreshGame = () => {
    const newTiles = generatePuzzleTiles(safeLevel.gridSize, restartCount, safeLevel.id);
    setTiles(newTiles);
    setMoveCount(0);
    setTimer(0);
    setGameStarted(true); // Set to true so puzzle shows
    setIsComplete(false);
    setShowHints(false);
    setHintsRemaining(3);
    
    // Load and play level sound when game starts (non-blocking)
    if (safeLevel.sound) {
      loadLevelSound(safeLevel.sound).then(() => {
        playLevelSound(safeLevel.sound).catch(error => {
          console.log('Sound playback failed, game continues:', error);
        });
      }).catch(error => {
        console.log('Sound loading failed, game continues:', error);
      });
    }
  };

  const handleTilePress = (index1, index2) => {
    if (!isValidMove(index1, index2, safeLevel.gridSize, tiles)) {
      return;
    }

    const newTiles = swapTiles(tiles, index1, index2);
    const newMoveCount = moveCount + 1;
    setTiles(newTiles);
    setMoveCount(newMoveCount);

    if (isPuzzleSolved(newTiles)) {
      completeLevel(newMoveCount);
    } else if (newMoveCount >= safeLevel.moves) {
      setShowGameOver(true);
      setGameStarted(false);
    }
  };

  const completeLevel = async (finalMoveCount = moveCount) => {
    setIsComplete(true);
    setGameStarted(false);
    setRestartCount(0); // Reset restart count on completion

    Animated.timing(victoryScale, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    await saveProgress(safeLevel.id, true);
    await saveLevelStats(safeLevel.id, {
      moves: finalMoveCount,
      time: timer,
      completed: true,
      timestamp: Date.now(),
    });

    // Calculate score based on time and moves
    const baseScore = 1000;
    const timePenalty = Math.max(0, timer * 2);
    const movePenalty = Math.max(0, finalMoveCount * 5);
    const score = Math.max(100, baseScore - timePenalty - movePenalty);

    // Save to leaderboard if user is authenticated
    if (user) {
      try {
        await LeaderboardService.updateUserScore(
          user.uid,
          safeLevel.id,
          score,
          timer,
          finalMoveCount
        );
      } catch (error) {
        console.error('Error saving to leaderboard:', error);
      }
    }

    // Clear saved game state when completed
    await clearCurrentGameState(safeLevel.id);

     await playVictorySound();
     
     // Stop level music when flip card appears
     if (safeLevel.sound) {
       stopLevelSound(safeLevel.sound).catch(error => {
         console.log('Error stopping level sound:', error);
       });
     }
     
setTimeout(() => {
        setShowFlipCard(true);
        // Trigger confetti celebration
        triggerConfetti();
      }, 500);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleRestartLevel = () => {
    setRestartCount(restartCount + 1);
    // Clear saved state when restarting
    clearCurrentGameState(safeLevel.id);
    initializeGame(false); // Start fresh game
  };

  const handleBackToLevels = () => {
    setShowGameOver(false);
    navigation.goBack();
  };

  const toggleSound = async () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    
    // Save to storage
    try {
      await AsyncStorage.setItem('@biblepuzzlequest_sound_enabled', newSoundState.toString());
    } catch (error) {
      console.error('Error saving sound setting:', error);
    }
    
    // Stop sound if muting, play if unmuting
    if (safeLevel.sound) {
      if (newSoundState) {
        playLevelSound(safeLevel.sound);
      } else {
        stopLevelSound(safeLevel.sound);
      }
    }
  };

  const handleRetryFromQuiz = () => {
    setShowGameOver(false);
    setRestartCount(restartCount + 1);
    initializeGame();
  };

  const handleHint = () => {
    if (hintsRemaining > 0) {
      setShowHints(true);
      setHintsRemaining(hintsRemaining - 1);
      
      // Hide hints after 3 seconds
      setTimeout(() => {
        setShowHints(false);
      }, 3000);
    }
  };

  const handleStoryClose = () => {
    setShowStory(false);
  };

  const handleStoryStart = () => {
    setShowStory(false);
    setGameStarted(true);
  };

  const handleContinueFromFlipCard = () => {
    setShowFlipCard(false);
    // Navigate back to level selection after a short delay
    setTimeout(() => {
      navigation.navigate('Levels');
    }, 300);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setUserAnswer('');
  };

  const handleQuizAnswer = (answer) => {
    setUserAnswer(answer);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setUserAnswer('');
  };

  const handleContinueFromStory = () => {
    setShowStory(false);
    setTimeout(() => {
      navigation.navigate('Levels');
    }, 300);
  };

  const handleCloseFlipCard = () => {
    setShowFlipCard(false);
    setTimeout(() => {
      navigation.navigate('Levels');
    }, 300);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  

  return (
  <>
    <LinearGradient
      colors={GRADIENTS.secondary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
<SafeAreaView style={styles.safeArea}>
         {/* Header */}
         <View style={styles.header}>
           <TouchableOpacity
             onPress={handleBackToLevels}
             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
           >
             <Text style={styles.backButton}>← Back</Text>
           </TouchableOpacity>
          <View>
            <Text style={styles.levelTitle}>{safeLevel.title}</Text>
            <Text style={styles.levelRef}>{safeLevel.bibleRef}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.soundButton}
              onPress={toggleSound}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.soundIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
            </TouchableOpacity>
            <View style={styles.timerBox}>
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Bible Verse */}
          <View style={styles.verseContainer}>
            <Text style={styles.verseText}>{safeLevel.verse}</Text>
          </View>

          {/* Puzzle Grid */}
          {gameStarted && tiles.length > 0 && (
            <PuzzleGrid
              tiles={tiles}
              gridSize={safeLevel.gridSize}
              imageUrl={safeLevel.image}
              onTilePress={handleTilePress}
              moveCount={moveCount}
              maxMoves={safeLevel.moves}
              showHints={showHints}
              restartCount={restartCount}
            />
          )}

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRestartLevel}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>🔄 Restart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.hintButtonStyle]}
              onPress={handleHint}
              disabled={hintsRemaining === 0}
              activeOpacity={0.7}
            >
              <Text style={[styles.hintButtonText, hintsRemaining === 0 && styles.disabledButtonText]}>
                💡 Hint ({hintsRemaining})
              </Text>
            </TouchableOpacity>
          </View>
</ScrollView>

      {/* Modals - Outside ScrollView */}
      <StoryModal
        visible={showStory}
        onClose={handleStoryClose}
        onStart={handleStoryStart}
        level={safeLevel}
      />

      <PuzzleFlipCard
        visible={showFlipCard}
        levelData={safeLevel}
        onClose={handleContinueFromFlipCard}
        moveCount={moveCount}
        timeTaken={timer}
      />

      <QuizModal
        visible={showQuiz}
        question={currentQuestion}
        userAnswer={userAnswer}
        onAnswer={handleQuizAnswer}
        onClose={handleQuizClose}
        onComplete={handleQuizComplete}
      />

      <GameOverModal
        visible={showGameOver}
        onClose={() => setShowGameOver(false)}
        onRetry={handleRetryFromQuiz}
        onBackToLevels={handleBackToLevels}
        levelTitle={safeLevel.title}
        restartCount={restartCount}
        maxMoves={safeLevel.moves}
        timeTaken={timer}
      />
      </SafeAreaView>
    </LinearGradient>
    
    {/* Confetti Celebration - On top of everything */}
    {showConfetti && (
      <Confetti
        confettiCount={50}
        duration={3000}
        untilStopped={true}
      />
    )}
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darker,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.darker + 'CC',
  },

  backButton: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gold,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  levelRef: {
    fontSize: 12,
    color: COLORS.light,
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  soundButton: {
    backgroundColor: COLORS.white + '20',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: COLORS.gold + '40',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  soundIcon: {
    fontSize: 18,
  },
  timerBox: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darker,
  },
  verseContainer: {
    backgroundColor: COLORS.white + '15',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  verseText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.light,
    textAlign: 'center',
    lineHeight: 20,
  },
  victoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gold + '30',
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  victoryEmoji: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  victoryText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gold,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.gold,
  },
  hintButtonStyle: {
    backgroundColor: COLORS.gold + '20',
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darker,
  },
  hintButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gold,
  },
  disabledButtonText: {
    color: COLORS.gray,
  },
});
