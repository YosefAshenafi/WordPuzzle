import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export const PuzzleFlipCard = ({ visible, levelData, onClose }) => {
  const [flipAnimation] = useState(new Animated.Value(0));
  const [contentOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Start flip animation
      Animated.sequence([
        Animated.timing(flipAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      flipAnimation.setValue(0);
      contentOpacity.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.sequence([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const flipInterpolate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  if (!levelData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.cardContainer,
              {
                transform: [{ rotateY: flipInterpolate }],
                opacity: contentOpacity,
              },
            ]}
          >
            {/* Front of card - Puzzle Image */}
            <Animated.View style={[styles.cardFace, { opacity: frontOpacity }]}>
              <LinearGradient
                colors={GRADIENTS.secondary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                {/* Background decorative circles */}
                <View style={styles.backgroundDecor}>
                  <View style={[styles.decorCircle, styles.circle1]} />
                  <View style={[styles.decorCircle, styles.circle2]} />
                  <View style={[styles.decorCircle, styles.circle3]} />
                </View>
                <View style={styles.imageContainer}>
                  <Image
                    source={typeof levelData.image === 'string' ? { uri: levelData.image } : levelData.image}
                    style={styles.puzzleImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <Text style={styles.congratulationsText}>🎉 Puzzle Completed! 🎉</Text>
                    <Text style={styles.flipHint}>Tap to reveal the story</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Back of card - Bible Story */}
            <Animated.View style={[styles.cardFace, styles.cardBack, { opacity: backOpacity }]}>
              <LinearGradient
                colors={GRADIENTS.secondary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                {/* Background decorative circles */}
                <View style={styles.backgroundDecor}>
                  <View style={[styles.decorCircle, styles.circle1]} />
                  <View style={[styles.decorCircle, styles.circle2]} />
                  <View style={[styles.decorCircle, styles.circle3]} />
                </View>
                <View style={styles.storyContainer}>
                  <View style={styles.storyHeader}>
                    <Text style={styles.storyTitle}>{levelData.title}</Text>
                    <Text style={styles.storyRef}>{levelData.bibleRef}</Text>
                  </View>

                  <ScrollView
                    style={styles.storyScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.storyText}>{levelData.story}</Text>
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={COLORS.gold ? [COLORS.gold, '#D97706'] : [COLORS.primary, COLORS.secondary]}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </Animated.View>

          {/* Tap area for flipping */}
          <TouchableOpacity
            style={styles.tapArea}
            onPress={handleClose}
            activeOpacity={1}
          />
        </View>
      </View>
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
  container: {
    width: width * 0.9,
    height: height * 0.7,
    maxWidth: 400,
    maxHeight: 600,
  },
  cardContainer: {
    flex: 1,
    backfaceVisibility: 'hidden',
  },
  cardFace: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  puzzleImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  flipHint: {
    fontSize: 16,
    color: COLORS.gold,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  storyContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  storyHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  storyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 8,
    textAlign: 'center',
  },
  storyRef: {
    fontSize: 16,
    color: COLORS.light,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  storyScroll: {
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.white,
    textAlign: 'justify',
  },
  closeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darker,
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});