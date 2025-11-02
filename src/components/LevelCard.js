import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';

export const LevelCard = ({
  level,
  isUnlocked,
  isCompleted,
  onPress,
}) => {
  const { t } = useLanguage();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [opacityAnim] = useState(new Animated.Value(isUnlocked ? 1 : 0.6));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    if (isUnlocked) {
      setTimeout(() => onPress(), 50);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
      <TouchableOpacity
        disabled={!isUnlocked}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={level.image}
          style={styles.card}
          imageStyle={styles.imageStyle}
        >
          <LinearGradient
            colors={
              isUnlocked 
                ? [COLORS.darker + '99', COLORS.darker + '66']
                : [COLORS.darker + 'DD', COLORS.darker + 'BB']
            }
            style={styles.overlay}
          >
            <View style={styles.content}>
              <Text style={styles.levelNumber}>{t('levelCard.level')} {level.id}</Text>
              <Text style={styles.title}>{level.title}</Text>
              <Text style={styles.ref}>{level.bibleRef}</Text>

              {!isUnlocked && (
                <View style={styles.lockContainer}>
                  <Text style={styles.lockIcon}>🔒</Text>
                  <Text style={styles.lockText}>{t('levelCard.locked')}</Text>
                </View>
              )}

              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>{t('levelCard.completed')}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 10,
    backgroundColor: COLORS.gray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
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
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  completedText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
