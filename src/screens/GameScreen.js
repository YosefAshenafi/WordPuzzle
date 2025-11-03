import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { saveProgress, saveLevelStats, saveCurrentGameState, loadCurrentGameState, clearCurrentGameState, getAttemptCount, incrementAttemptCount } from '../utils/storage';
import { playVictorySound, loadLevelSound, playLevelSound, stopLevelSound, stopAllLevelSounds, isSoundEnabled } from '../utils/audio';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardService } from '../services/leaderboardService';
import { useLanguage } from '../contexts/LanguageContext';
import Confetti from 'react-native-confetti-view';

export const GameScreen = ({ route, navigation }) => {
  const { t } = useLanguage();
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
          {t('game.loadingLevel')}
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
  const [timer, setTimer] = useState(240); // 4 minutes in seconds (reduced from 5)
  const [showGameOver, setShowGameOver] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const [showHints, setShowHints] = useState(false);
    const [hintsRemaining, setHintsRemaining] = useState(2); // Reduced from 3
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [dynamicMoveLimit, setDynamicMoveLimit] = useState(safeLevel.moves || 50);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const victoryScale = useRef(new Animated.Value(0)).current;
  const verseGlow = useRef(new Animated.Value(0)).current;
  const verseIconRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setRestartCount(0);
    initializeGame(isContinue);

    // Load sound setting
    isSoundEnabled().then(setSoundEnabled);

    // Pulsing glow animation for verse
    Animated.loop(
      Animated.sequence([
        Animated.timing(verseGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(verseGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Gentle rotation for decorative icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(verseIconRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(verseIconRotate, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      // Stop all level sounds when leaving the screen to ensure no audio plays outside puzzle
      stopAllLevelSounds().catch(error => {
        console.log('Error stopping all sounds:', error);
      });
    };
  }, [level, isContinue]);

  useEffect(() => {
    let interval;
    if (gameStarted && !isComplete && timer > 0 && timerEnabled) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            // Time's up - show game over
            setIsTimeUp(true);
            setShowGameOver(true);
            setGameStarted(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isComplete, timer, timerEnabled]);

  // Auto-save game state when it changes
  useEffect(() => {
    if (gameStarted && !isComplete && tiles.length > 0) {
      const gameState = {
        tiles,
        moveCount,
        timer,
        showHints,
        hintsRemaining,
        showGameOver,
        isTimeUp,
        quizAnswered,
        timestamp: Date.now()
      };
      saveCurrentGameState(safeLevel.id, gameState);
    }
  }, [tiles, moveCount, timer, showHints, hintsRemaining, gameStarted, isComplete, showGameOver, isTimeUp, quizAnswered]);

  // Auto-save game state when it changes
  useEffect(() => {
    if (gameStarted && !isComplete && tiles.length > 0) {
      const gameState = {
        tiles,
        moveCount,
        timer,
        showHints,
        hintsRemaining,
        showGameOver,
        isTimeUp,
        quizAnswered,
        timestamp: Date.now()
      };
      saveCurrentGameState(safeLevel.id, gameState);
    }
  }, [tiles, moveCount, timer, showHints, hintsRemaining, gameStarted, isComplete, showGameOver, isTimeUp, quizAnswered]);

const initializeGame = async (isContinue = false) => {
    setQuizAnswered(false); // Reset quiz answered state
    if (isContinue) {
      // Try to load saved game state
      const savedState = await loadCurrentGameState(safeLevel.id);
      if (savedState) {
        // Load current attempts for dynamic settings
        const attempts = await getAttemptCount(safeLevel.id);
        setTotalAttempts(attempts);
        
        // Apply dynamic difficulty rules
        let newTimerEnabled = true;
        let newMoveLimit = safeLevel.moves || 50;
        
        if (attempts >= 3) {
          newTimerEnabled = false;
        }
        
        if (attempts >= 5) {
          newMoveLimit = 80 + (attempts - 5) * 8;
        }
        
        setTimerEnabled(newTimerEnabled);
        setDynamicMoveLimit(newMoveLimit);
        
        // Check if saved game was over and quiz wasn't answered
        if (savedState.showGameOver && !savedState.quizAnswered) {
          // Game was over and quiz not answered - show game over modal
          setShowGameOver(true);
          setIsTimeUp(savedState.isTimeUp || false);
          setGameStarted(false);
          setQuizAnswered(false);
          // Still restore the game state for display
          setTiles(savedState.tiles);
          setMoveCount(savedState.moveCount);
          setTimer(savedState.timer || (newTimerEnabled ? 240 : 999999));
          setIsComplete(false);
          setShowHints(savedState.showHints || false);
          setHintsRemaining(savedState.hintsRemaining !== undefined ? savedState.hintsRemaining : 2);
        } else {
          // Normal continue - restore saved state
          setTiles(savedState.tiles);
          setMoveCount(savedState.moveCount);
          setTimer(savedState.timer || (newTimerEnabled ? 240 : 999999));
          setGameStarted(true);
          setIsComplete(false);
          setShowHints(savedState.showHints || false);
          setHintsRemaining(savedState.hintsRemaining !== undefined ? savedState.hintsRemaining : 2);
          setQuizAnswered(savedState.quizAnswered || false);
        }
        
        // Load and play level sound when continuing game (non-blocking)
        if (safeLevel.sound) {
          loadLevelSound(safeLevel.sound).then(() => {
            playLevelSound(safeLevel.sound).catch(error => {
              console.log('Sound playback failed on continue, game continues:', error);
            });
          }).catch(error => {
            console.log('Sound loading failed on continue, game continues:', error);
          });
        }
      } else {
        // No saved state, start fresh
        startFreshGame();
      }
    } else {
      // Start fresh game
      startFreshGame();
    }
  };

  const startFreshGame = async () => {
    setQuizAnswered(false); // Reset quiz answered state
    // Load total attempts and increment for this new game
    const attempts = await incrementAttemptCount(safeLevel.id);
    setTotalAttempts(attempts);
    
    // Apply dynamic difficulty rules
    let newTimerEnabled = true;
    let newMoveLimit = safeLevel.moves || 50;
    
    // After 3 attempts, disable timer (increased from 2)
    if (attempts >= 3) {
      newTimerEnabled = false;
    }
    
    // After 5 attempts, increase move limit to 80+ (reduced from 6, lower base)
    if (attempts >= 5) {
      newMoveLimit = 80 + (attempts - 5) * 8; // 80, 88, 96, etc.
    }
    
    setTimerEnabled(newTimerEnabled);
    setDynamicMoveLimit(newMoveLimit);
    
    const newTiles = generatePuzzleTiles(safeLevel.gridSize, restartCount, safeLevel.id, attempts);
    setTiles(newTiles);
    setMoveCount(0);
    setTimer(newTimerEnabled ? 240 : 999999); // Disable timer by setting very high value (reduced from 300)
    setGameStarted(true); // Set to true so puzzle shows
    setIsComplete(false);
    setShowHints(false);
    setHintsRemaining(2);
    
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
    // Check if game is over and quiz hasn't been answered
    if (showGameOver && !quizAnswered) {
      return;
    }
    
    if (!isValidMove(index1, index2, safeLevel.gridSize, tiles)) {
      return;
    }

    const newTiles = swapTiles(tiles, index1, index2);
    const newMoveCount = moveCount + 1;
    setTiles(newTiles);
    setMoveCount(newMoveCount);

    if (isPuzzleSolved(newTiles)) {
      completeLevel(newMoveCount);
    } else if (newMoveCount >= dynamicMoveLimit) {
      setIsTimeUp(false);
      setShowGameOver(true);
      setGameStarted(false);
      setQuizAnswered(false); // Reset quiz answered state when game over
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

  const handleBackToLevels = async () => {
    setShowGameOver(false);
    // Clear saved game state when player chooses to go back
    await clearCurrentGameState(safeLevel.id);
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
    setIsTimeUp(false);
    setRestartCount(restartCount + 1);
    setQuizAnswered(true); // Mark quiz as answered
    initializeGame();
  };

  const handleSkipQuiz = () => {
    setShowGameOver(false);
    setIsTimeUp(false);
    setRestartCount(restartCount + 1);
    setQuizAnswered(true); // Mark quiz as answered
    initializeGame();
  };

  const handleHint = () => {
    if (hintsRemaining > 0) {
      setShowHints(true);
      setHintsRemaining(hintsRemaining - 1);
      
      // Hide hints after 2 seconds (reduced from 3)
      setTimeout(() => {
        setShowHints(false);
      }, 2000);
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
              <Text style={styles.backButton}>{t('game.back')}</Text>
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
{timerEnabled && (
              <View style={[styles.timerBox, timer <= 60 && styles.timerBoxWarning]}>
                <Text style={[styles.timerText, timer <= 60 && styles.timerTextWarning]}>
                  {formatTime(timer)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Bible Verse - Gamified with golden theme and animated glow */}
          <Animated.View
            style={[
              styles.verseContainer,
              {
                shadowOpacity: verseGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 0.9],
                }),
                borderColor: verseGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [COLORS.gold + 'CC', COLORS.gold],
                }),
              },
            ]}
          >
            {/* Top decorative corners */}
            <View style={styles.verseDecorTop}>
              <Animated.Text
                style={[
                  styles.verseDecorIcon,
                  {
                    transform: [
                      {
                        rotate: verseIconRotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '20deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                ✨
              </Animated.Text>
              <View style={styles.verseDecorLine} />
              <Text style={styles.verseDecorIcon}>📖</Text>
              <View style={styles.verseDecorLine} />
              <Animated.Text
                style={[
                  styles.verseDecorIcon,
                  {
                    transform: [
                      {
                        rotate: verseIconRotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '-20deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                ✨
              </Animated.Text>
            </View>

            {/* Verse text with icon */}
            <View style={styles.verseContent}>
              <Text style={styles.verseQuoteLeft}>"</Text>
              <Text style={styles.verseText}>{safeLevel.verse}</Text>
              <Text style={styles.verseQuoteRight}>"</Text>
            </View>

            {/* Bottom decorative corners */}
            <View style={styles.verseDecorBottom}>
              <View style={styles.verseDecorDiamond} />
              <View style={styles.verseDecorDiamond} />
              <View style={styles.verseDecorDiamond} />
            </View>
          </Animated.View>

          {/* Puzzle Grid */}
          {gameStarted && tiles.length > 0 && (
            <PuzzleGrid
              tiles={tiles}
              gridSize={safeLevel.gridSize}
              imageUrl={safeLevel.image}
              onTilePress={handleTilePress}
              moveCount={moveCount}
              maxMoves={dynamicMoveLimit}
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
              <Text style={styles.buttonText}>{t('game.restart')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.hintButtonStyle]}
              onPress={handleHint}
              disabled={hintsRemaining === 0}
              activeOpacity={0.7}
            >
              <Text style={[styles.hintButtonText, hintsRemaining === 0 && styles.disabledButtonText]}>
                {t('game.hint')} ({hintsRemaining})
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
        onClose={async () => {
          setShowGameOver(false);
          // Clear saved game state when player closes modal
          await clearCurrentGameState(safeLevel.id);
        }}
        onRetry={handleRetryFromQuiz}
        onSkipQuiz={handleSkipQuiz}
        onBackToLevels={handleBackToLevels}
        levelTitle={safeLevel.title}
        restartCount={restartCount}
        maxMoves={dynamicMoveLimit}
        timeTaken={isTimeUp ? 240 - timer : moveCount} // Show elapsed time or moves used
        isTimeUp={isTimeUp}
      />
      </SafeAreaView>
    </LinearGradient>
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
  timerBoxWarning: {
    backgroundColor: '#EF4444', // Red color for warning
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darker,
  },
  timerTextWarning: {
    color: COLORS.white,
  },
  verseContainer: {
    backgroundColor: COLORS.darker,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  verseDecorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  verseDecorIcon: {
    fontSize: 18,
    color: COLORS.gold,
  },
  verseDecorLine: {
    height: 2,
    width: 30,
    backgroundColor: COLORS.gold + '50',
    marginHorizontal: 8,
  },
  verseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  verseQuoteLeft: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginRight: 4,
    marginTop: -8,
    fontFamily: 'serif',
  },
  verseQuoteRight: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginLeft: 4,
    alignSelf: 'flex-end',
    marginBottom: -8,
    fontFamily: 'serif',
  },
  verseText: {
    flex: 1,
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  verseDecorBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 12,
  },
  verseDecorDiamond: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.gold,
    transform: [{ rotate: '45deg' }],
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
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
