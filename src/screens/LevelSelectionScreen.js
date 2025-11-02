import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, QUIZ_CONFIG } from '../constants/colors';
import { LEVELS } from '../constants/levels';
import { LevelCard } from '../components/LevelCard';
import { QuizModal } from '../components/QuizModal';
import { getProgress } from '../utils/storage';
import { stopAllLevelSounds } from '../utils/audio';

export const LevelSelectionScreen = ({ navigation }) => {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    loadProgress();
    const unsubscribe = navigation.addListener('focus', () => {
      loadProgress();
      // Stop any audio that might be playing when entering level selection
      stopAllLevelSounds().catch(error => {
        console.log('Error stopping sounds on levels focus:', error);
      });
    });
    return unsubscribe;
  }, [navigation]);

  

  const loadProgress = async () => {
    const progressData = await getProgress();
    setProgress(progressData);
    setLoading(false);
  };

  

  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true;
    return progress[levelId - 1] === true;
  };

  const isLevelCompleted = (levelId) => {
    return progress[levelId] === true;
  };

  const handleCorrectAnswer = () => {
    setShowQuiz(false);
    Alert.alert(
      '🎉 Wisdom Granted!',
      'You have answered correctly! Your quest continues with a fresh start.',
      [
        {
          text: 'Begin New Quest',
          onPress: () => {
            // Reset progress and start fresh
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          },
        },
      ]
    );
  };

const handleSelectLevel = (level) => {
    const completedCount = Object.values(progress).filter(Boolean).length;
    
    if (completedCount === 6) {
      setShowQuiz(true);
    } else {
      navigation.navigate('Game', { level });
    }
  };

  const completedCount = Object.values(progress).filter(Boolean).length;

  return (
    <LinearGradient
      colors={GRADIENTS.secondary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Quest</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{completedCount}/6</Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View>
            {LEVELS.map((level) => (
              <View key={level.id}>
                <LevelCard
                  level={level}
                  isUnlocked={isLevelUnlocked(level.id)}
                  isCompleted={isLevelCompleted(level.id)}
                  onPress={() => handleSelectLevel(level)}
                />
              </View>
            ))}
          </View>

          {completedCount === 6 && (
            <View style={styles.completionMessage}>
              <Text style={styles.completionTitle}>🎉 Quest Complete! 🎉</Text>
              <Text style={styles.completionText}>
                You've unlocked all the sacred stories!
              </Text>
              <Text style={styles.challengeText}>
                ⚡ Answer the biblical question to continue your journey
              </Text>
              <TouchableOpacity
                style={styles.quizButton}
                onPress={() => setShowQuiz(true)}
              >
                <Text style={styles.quizButtonText}>📖 Face Divine Challenge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.replayButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.replayButtonText}>Return Home</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        
        <QuizModal
          visible={showQuiz}
          onClose={() => setShowQuiz(false)}
          onCorrectAnswer={handleCorrectAnswer}
        />
      </SafeAreaView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  progressBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darker,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  completionMessage: {
    backgroundColor: COLORS.success + '20',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 10,
  },
  completionText: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  replayButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  replayButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  quizButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  quizButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darker,
    textAlign: 'center',
  },
  timeoutContainer: {
    backgroundColor: COLORS.warning + '20',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  timeoutText: {
    fontSize: 14,
    color: COLORS.warning,
    textAlign: 'center',
    fontWeight: '600',
  },
  countdownText: {
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 4,
  },
  challengeText: {
    fontSize: 14,
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
});
