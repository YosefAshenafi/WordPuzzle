import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, GRADIENTS } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

export const StoryModal = ({ visible, levelData, onClose, onContinue }) => {
  const { t } = useLanguage();
  const [opacity] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(0.5));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!levelData) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
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
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>✨ {t('story.youveUnlocked')} ✨</Text>
                <Text style={styles.storyTitle}>{levelData.title}</Text>
                <Text style={styles.ref}>{levelData.bibleRef}</Text>
              </View>

              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.storyText}>{levelData.story}</Text>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.buttonText}>{t('story.close')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={onContinue}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.gold ? [COLORS.gold, '#D97706'] : [COLORS.primary, COLORS.secondary]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.continueText}>{t('story.continue')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
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
  container: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.darker,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  gradient: {
    flex: 1,
    padding: 24,
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
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gold,
    marginBottom: 10,
    letterSpacing: 1,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  ref: {
    fontSize: 14,
    color: COLORS.light,
    fontStyle: 'italic',
  },
  scrollView: {
    marginVertical: 16,
    maxHeight: 300,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.white,
    textAlign: 'justify',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  closeButton: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white + '20',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.white + '40',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButton: {
    flex: 1,
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
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darker,
  },
});
