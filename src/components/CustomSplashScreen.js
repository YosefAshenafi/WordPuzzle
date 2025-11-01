import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export const CustomSplashScreen = ({ onAnimationComplete }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const titleY = new Animated.Value(50);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Hold for 2 seconds, then fade out
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete();
      });
    }, 2500);
  }, []);

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

      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: titleY }]
          }
        ]}
      >
        {/* Puzzle Icon */}
        <Text style={styles.puzzleIcon}>🧩</Text>
        
        {/* Bizzle Title */}
        <Text style={styles.title}>Bizzle</Text>
        
        {/* Underline */}
        <View style={styles.titleUnderline} />
        
        {/* Tagline */}
        <Text style={styles.tagline}>✨ Unlock Sacred Stories ✨</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  puzzleIcon: {
    fontSize: 60,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 64,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 16,
  },
  titleUnderline: {
    width: 120,
    height: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.light,
    fontStyle: 'italic',
    letterSpacing: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
});