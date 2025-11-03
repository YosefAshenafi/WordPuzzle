import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, QUIZ_CONFIG } from '../constants/colors';
import { getRandomQuestion } from '../constants/levels';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

export const QuizModal = ({ visible, onClose, onCorrectAnswer }) => {
  const { t, currentLanguage } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_CONFIG.TIMEOUT_SECONDS);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerWidthAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      loadNewQuestion();
      setStreak(0);
      setScore(0);
      
      // Entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Animate timer bar
        Animated.timing(timerWidthAnim, {
          toValue: (timeLeft - 1) / QUIZ_CONFIG.TIMEOUT_SECONDS * 100,
          duration: 900,
          useNativeDriver: false,
        }).start();
        
        // Pulse effect when time is running out
        if (timeLeft <= 3) {
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
          ]).start();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout();
    }
  }, [timeLeft, visible, showResult]);

  const loadNewQuestion = () => {
    const question = getRandomQuestion(currentLanguage);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(QUIZ_CONFIG.TIMEOUT_SECONDS);
    setIsTimedOut(false);

    // Reset timer animation
    timerWidthAnim.setValue(100);
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const celebrate = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleTimeout = () => {
    setIsTimedOut(true);
    setShowResult(true);
    shake();
    setTimeout(() => {
      loadNewQuestion();
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + (timeLeft * 10)); // Bonus points for speed
      setStreak(streak + 1);
      celebrate();
      
      setTimeout(() => {
        onCorrectAnswer();
        handleClose();
      }, 2000);
    } else {
      shake();
      setTimeout(() => {
        loadNewQuestion();
      }, 2000);
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!currentQuestion) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
          <ImageBackground
            source={require('../assets/images/creation.png')}
            style={styles.backgroundImage}
            blurRadius={3}
          >
            <LinearGradient
              colors={GRADIENTS.secondary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientOverlay}
            >
              {/* Background decorative circles */}
              <View style={styles.backgroundDecor}>
                <View style={[styles.decorCircle, styles.circle1]} />
                <View style={[styles.decorCircle, styles.circle2]} />
                <View style={[styles.decorCircle, styles.circle3]} />
              </View>

              {/* Header with Score and Streak */}
               <View style={styles.header}>
                 <View style={styles.scoreContainer}>
                   <Text style={styles.scoreLabel}>{t('quiz.score')}</Text>
                   <Text style={styles.scoreValue}>{score}</Text>
                 </View>
                 
                 <View style={styles.titleContainer}>
                   <Text style={styles.title}>📖 {t('quiz.divineWisdom')}</Text>
                   <Text style={styles.subtitle}>{t('quiz.answerToContinue')}</Text>
                 </View>
                 
                 <View style={styles.streakContainer}>
                   <Text style={styles.streakLabel}>{t('quiz.streak')}</Text>
                   <Text style={styles.streakValue}>🔥 {streak}</Text>
                 </View>
               </View>

              {/* Timer Bar */}
              <View style={styles.timerContainer}>
                <View style={styles.timerBackground}>
                  <Animated.View 
                    style={[
                      styles.timerBar, 
                      { 
                        width: timerWidthAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                        backgroundColor: timeLeft <= 3 ? COLORS.error : COLORS.success
                      }
                    ]} 
                  />
                </View>
                <Animated.View style={[styles.timerText, { transform: [{ scale: pulseAnim }] }]}>
                  <Text style={[
                    styles.timerNumber,
                    { color: timeLeft <= 3 ? COLORS.error : COLORS.gold }
                  ]}>
                    {timeLeft}
                  </Text>
                </Animated.View>
              </View>

              {/* Question Card */}
               <View style={styles.questionCard}>
                 <View style={styles.questionHeader}>
                   <Text style={styles.questionNumber}>{t('quiz.question')} {streak + 1}</Text>
                   <Text style={styles.difficulty}>⚡ {t('quiz.divineChallenge')}</Text>
                 </View>
                 
                 <Text style={styles.question}>{currentQuestion.question}</Text>
                 <Text style={styles.reference}>📜 {currentQuestion.reference}</Text>
               </View>

              {/* Answer Options */}
              <View style={styles.answersContainer}>
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const isSelected = index === selectedAnswer;
                  
                  let buttonStyle = styles.answerButton;
                  let textStyle = styles.answerText;
                  let icon = '⭕';
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonStyle = styles.correctAnswer;
                      textStyle = styles.correctAnswerText;
                      icon = '✅';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = styles.wrongAnswer;
                      textStyle = styles.wrongAnswerText;
                      icon = '❌';
                    }
                  }
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[buttonStyle, { transform: [{ translateX: shakeAnim }] }]}
                      onPress={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      activeOpacity={0.8}
                    >
                      <View style={styles.answerContent}>
                        <Text style={styles.answerIcon}>{icon}</Text>
                        <Text style={textStyle}>{option}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Result Message */}
               {showResult && (
                 <Animated.View style={styles.resultContainer}>
                   {isTimedOut ? (
                     <Text style={styles.timeoutText}>⏰ {t('quiz.timesUpTryAgain')}</Text>
                   ) : selectedAnswer === currentQuestion.correctAnswer ? (
                     <Text style={styles.correctText}>🎉 {t('quiz.correctPoints', { points: timeLeft * 10 })}</Text>
                   ) : (
                     <Text style={styles.wrongText}>❌ {t('quiz.notQuiteRightTryAgain')}</Text>
                   )}
                 </Animated.View>
               )}

              {/* Instructions */}
               <View style={styles.instructionContainer}>
                 <Text style={styles.instructionText}>
                   {showResult 
                     ? (selectedAnswer === currentQuestion.correctAnswer 
                         ? t('quiz.wisdomGranted') 
                         : t('quiz.seekAnswerTryAgain'))
                     : t('quiz.chooseWisely')
                   }
                 </Text>
               </View>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.95,
    maxWidth: 420,
    maxHeight: height * 0.9,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    flex: 1,
    padding: 20,
  },
  backgroundDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: width * 0.4,
    opacity: 0.1,
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    right: -width * 0.2,
    backgroundColor: COLORS.white,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: height * 0.3,
    left: -width * 0.1,
    backgroundColor: COLORS.gold,
  },
  circle3: {
    width: width * 0.4,
    height: width * 0.4,
    top: height * 0.4,
    right: width * 0.1,
    backgroundColor: COLORS.accent,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold + '40',
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 18,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.light,
    textAlign: 'center',
    marginTop: 2,
  },
  streakContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
  },
  streakLabel: {
    fontSize: 10,
    color: COLORS.error,
    fontWeight: '700',
    letterSpacing: 1,
  },
  streakValue: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  timerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  timerBackground: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.white + '20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
    borderRadius: 4,
  },
  timerText: {
    marginTop: 8,
  },
  timerNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  questionCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '700',
  },
  difficulty: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  question: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  reference: {
    fontSize: 12,
    color: COLORS.gold,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  answersContainer: {
    gap: 12,
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: COLORS.white + '20',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.white + '40',
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  answerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  answerText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    flex: 1,
  },
  correctAnswer: {
    backgroundColor: COLORS.success + '30',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  correctAnswerText: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: '700',
  },
  wrongAnswer: {
    backgroundColor: COLORS.error + '30',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  wrongAnswerText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '700',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  correctText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
    textAlign: 'center',
  },
  wrongText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.error,
    textAlign: 'center',
  },
  timeoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warning,
    textAlign: 'center',
  },
  instructionContainer: {
    backgroundColor: COLORS.white + '10',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  instructionText: {
    fontSize: 12,
    color: COLORS.light,
    textAlign: 'center',
    fontWeight: '600',
  },
});