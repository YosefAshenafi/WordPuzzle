import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, QUIZ_CONFIG } from '../constants/colors';
import { getLevels } from '../constants/levels';
import { LevelCard } from '../components/LevelCard';
import { QuizModal } from '../components/QuizModal';
import { getProgress } from '../utils/storage';
import { stopAllLevelSounds } from '../utils/audio';
import { useLanguage } from '../contexts/LanguageContext';

export const LevelSelectionScreen = ({ navigation }) => {
  const { t, currentLanguage } = useLanguage();
  const LEVELS = getLevels(currentLanguage);
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
      t('levelSelection.wisdomGranted'),
      t('levelSelection.correctAnswerMessage'),
      [
        {
          text: t('levelSelection.beginNewQuest'),
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
            onPress={() => navigation.navigate('Home')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.homeButton}>🏠</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('levelSelection.chooseYourQuest')}</Text>
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

            {/* More Stories Coming Soon Card */}
            <View style={styles.comingSoonCard}>
              <LinearGradient
                colors={[COLORS.darker + 'DD', COLORS.darker + 'BB']}
                style={styles.comingSoonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.lockContainer}>
                  <Text style={styles.lockIcon}>🔒</Text>
                  <Text style={styles.lockText}>{t('levelCard.locked')}</Text>
                </View>
                <View style={styles.content}>
                  <Text style={styles.levelNumber}>{t('levelCard.level')} 7+</Text>
                  <Text style={styles.title}>{t('levelSelection.moreStoriesComingSoon')}</Text>
                  <Text style={styles.ref}>{t('levelSelection.newAdventuresPrepared')}</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

{completedCount === 6 && (
            <View style={styles.completionMessage}>
              <Text style={styles.completionTitle}>{t('levelSelection.questComplete')}</Text>
              <Text style={styles.completionText}>
                {t('levelSelection.unlockedAllStories')}
              </Text>
              <Text style={styles.challengeText}>
                {t('levelSelection.answerBiblicalQuestion')}
              </Text>
              <TouchableOpacity
                style={styles.quizButton}
                onPress={() => setShowQuiz(true)}
              >
                <Text style={styles.quizButtonText}>{t('levelSelection.faceDivineChallenge')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.replayButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.replayButtonText}>{t('levelSelection.returnHome')}</Text>
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
  homeButton: {
    fontSize: 24,
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
  comingSoonCard: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 10,
    marginBottom: 30,
    backgroundColor: COLORS.gray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  comingSoonGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  lockContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darker + 'EE',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.gold + '66',
  },
  lockIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  lockText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  levelNumber: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 4,
    marginBottom: 4,
  },
  ref: {
    fontSize: 12,
    color: COLORS.light,
    fontStyle: 'italic',
  },
});
