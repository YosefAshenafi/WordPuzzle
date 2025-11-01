import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { getRandomVerse } from '../constants/levels';
import { getProgress } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const [verse, setVerse] = useState('');
  const [completedCount, setCompletedCount] = useState(0);

  const titleY = new Animated.Value(0);
  const subtitle1Op = new Animated.Value(1);
  const subtitle2Op = new Animated.Value(1);
  const button1Scale = new Animated.Value(1);
  const button2Scale = new Animated.Value(1);

  useEffect(() => {
    setVerse(getRandomVerse());
    loadProgress();

    // Set initial values immediately
    titleY.setValue(0);
    subtitle1Op.setValue(1);
    subtitle2Op.setValue(1);
    button1Scale.setValue(1);
    button2Scale.setValue(1);
  }, []);

  const loadProgress = async () => {
    const progress = await getProgress();
    const completed = Object.values(progress).filter(Boolean).length;
    setCompletedCount(completed);
  };

  return (
    <LinearGradient
      colors={GRADIENTS.secondary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Background decorative circles */}
      <View style={styles.backgroundDecor}>
        <View style={[styles.decorCircle, styles.circle1]} />
        <View style={[styles.decorCircle, styles.circle2]} />
        <View style={[styles.decorCircle, styles.circle3]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Title with enhanced styling */}
          <Animated.View style={[styles.titleContainer, { transform: [{ translateY: titleY }] }]}>
            <Text style={styles.title}>🧩</Text>
            <Text style={styles.titleHighlight}>Bizzle</Text>
            <View style={styles.titleUnderline} />
          </Animated.View>

          {/* Enhanced decorative elements */}
          <Animated.View style={[styles.decorContainer, { opacity: subtitle1Op }]}>
            <View style={styles.decorBox}>
              <Text style={styles.decorText}>✨ Unlock Sacred Stories ✨</Text>
            </View>
          </Animated.View>

          {/* Verse of the Day with enhanced styling */}
          <Animated.View style={[styles.verseContainer, { opacity: subtitle1Op }]}>
            <View style={styles.verseHeader}>
              <Text style={styles.verseLabel}>💫 Verse of the Day</Text>
            </View>
            <View style={styles.verseContent}>
              <Text style={styles.verseText}>{verse}</Text>
            </View>
          </Animated.View>

          {/* Enhanced Progress Display */}
          <Animated.View style={[styles.progressContainer, { opacity: subtitle2Op }]}>
            <View style={styles.progressCard}>
              <View style={styles.progressBox}>
                <Text style={styles.progressNumber}>{completedCount}</Text>
                <Text style={styles.progressLabel}>Stories Unlocked</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressBox}>
                <Text style={styles.progressNumber}>6</Text>
                <Text style={styles.progressLabel}>Total Stories</Text>
              </View>
            </View>
          </Animated.View>

          {/* Enhanced Buttons */}
          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: button1Scale }] }]}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Levels')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={COLORS.gold ? [COLORS.gold, '#D97706'] : [COLORS.primary, COLORS.secondary]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.primaryButtonText}>
                  {completedCount > 0 ? '▶ Continue Quest' : '▶ Start Quest'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: button2Scale }] }]}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Levels')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>🎮 Select Level</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Enhanced Footer message */}
          <View style={styles.footer}>
            <View style={styles.footerCard}>
              <Text style={styles.footerText}>
                🙏 Complete puzzles to discover Bible stories
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darker,
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
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: height,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    flex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  titleHighlight: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: 100,
    height: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginTop: 8,
  },
  decorContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  decorBox: {
    backgroundColor: COLORS.white + '10',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  decorText: {
    fontSize: 16,
    color: COLORS.light,
    fontStyle: 'italic',
    letterSpacing: 2,
    fontWeight: '500',
  },
  verseContainer: {
    marginBottom: 25,
  },
  verseHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  verseLabel: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  verseContent: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.white,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  progressBox: {
    flex: 1,
    alignItems: 'center',
  },
  progressDivider: {
    width: 1,
    backgroundColor: COLORS.white + '30',
    marginHorizontal: 20,
  },
  progressNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.light,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darker,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: COLORS.white + '20',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white + '40',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerCard: {
    backgroundColor: COLORS.white + '10',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.light,
    textAlign: 'center',
    fontWeight: '500',
  },
});
