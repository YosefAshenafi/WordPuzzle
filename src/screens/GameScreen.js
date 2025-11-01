import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PuzzleGrid } from '../components/PuzzleGrid';
import { StoryModal } from '../components/StoryModal';
import { PuzzleFlipCard } from '../components/PuzzleFlipCard';
import { GameOverModal } from '../components/GameOverModal';
import {
  generatePuzzleTiles,
  isPuzzleSolved,
  swapTiles,
  isValidMove,
  debugShuffle,
} from '../utils/puzzleLogic';
import { saveProgress, saveLevelStats } from '../utils/storage';
import { playVictorySound, loadLevelSound, playLevelSound, stopLevelSound, isSoundEnabled } from '../utils/audio';

export const GameScreen = ({ route, navigation }) => {
  const { level } = route.params;
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

  const victoryScale = new Animated.Value(0);

  useEffect(() => {
    setRestartCount(0);
    initializeGame();
    
    // Load sound setting
    isSoundEnabled().then(setSoundEnabled);
    
    return () => {
      // Stop level sound when leaving - cleanup will be handled by stopLevelSound
      if (level.sound) {
        stopLevelSound(level.sound).catch(error => {
          console.log('Error stopping sound:', error);
        });
      }
    };
  }, [level]);

  useEffect(() => {
    let interval;
    if (gameStarted && !isComplete) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isComplete]);

const initializeGame = () => {
    const newTiles = generatePuzzleTiles(level.gridSize, restartCount);
    setTiles(newTiles);
    setMoveCount(0);
    setTimer(0);
    setGameStarted(true); // Set to true so the puzzle shows
    setIsComplete(false);
    setShowHints(false);
    setHintsRemaining(3);
    
    // Load and play level sound when game starts (non-blocking)
    if (level.sound) {
      loadLevelSound(level.sound).then(() => {
        playLevelSound(level.sound).catch(error => {
          console.log('Sound playback failed, game continues:', error);
        });
      }).catch(error => {
        console.log('Sound loading failed, game continues:', error);
      });
    }
  };

  const handleTilePress = (index1, index2) => {
    if (!isValidMove(index1, index2, level.gridSize, tiles)) {
      return;
    }

    const newTiles = swapTiles(tiles, index1, index2);
    setTiles(newTiles);
    setMoveCount(moveCount + 1);

    if (isPuzzleSolved(newTiles)) {
      completeLevel();
    } else if (moveCount + 1 >= level.moves) {
      setShowGameOver(true);
      setGameStarted(false);
    }
  };

  const completeLevel = async () => {
    setIsComplete(true);
    setGameStarted(false);
    setRestartCount(0); // Reset restart count on completion

    Animated.timing(victoryScale, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    await saveProgress(level.id, true);
    await saveLevelStats(level.id, {
      moves: moveCount,
      time: timer,
      completed: true,
    });

    await playVictorySound();
    setTimeout(() => {
      setShowFlipCard(true);
    }, 500);
  };

  

  const handleRestartLevel = () => {
    setRestartCount(restartCount + 1);
    initializeGame(); // This will handle the sound restart
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
    if (level.sound) {
      if (newSoundState) {
        playLevelSound(level.sound);
      } else {
        stopLevelSound(level.sound);
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
            <Text style={styles.levelTitle}>{level.title}</Text>
            <Text style={styles.levelRef}>{level.bibleRef}</Text>
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

        {/* Victory Badge */}
        <Animated.View style={[styles.victoryBadge, { transform: [{ scale: victoryScale }] }]}>
          <Text style={styles.victoryEmoji}>✨</Text>
          <Text style={styles.victoryText}>SOLVED!</Text>
          <Text style={styles.victoryEmoji}>✨</Text>
        </Animated.View>

        {/* Puzzle Grid */}
        {gameStarted && tiles.length > 0 && (
          <PuzzleGrid
            tiles={tiles}
            gridSize={level.gridSize}
            imageUrl={level.image}
            onTilePress={handleTilePress}
            moveCount={moveCount}
            maxMoves={level.moves}
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
      </SafeAreaView>

      {/* Story Modal */}
      <StoryModal
        visible={showStory}
        levelData={level}
        onClose={() => setShowStory(false)}
        onContinue={handleContinueFromStory}
      />

      {/* Flip Card Modal */}
      <PuzzleFlipCard
        visible={showFlipCard}
        levelData={level}
        onClose={handleCloseFlipCard}
      />

      {/* Game Over Modal */}
      <GameOverModal
        visible={showGameOver}
        onClose={() => setShowGameOver(false)}
        onRetry={handleRetryFromQuiz}
        onBackToLevels={handleBackToLevels}
        levelTitle={level.title}
        restartCount={restartCount}
        maxMoves={level.moves}
        timeTaken={timer}
      />
    </LinearGradient>
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
