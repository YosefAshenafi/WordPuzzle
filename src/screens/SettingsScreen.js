import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
  Alert,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { getAllStats, getProgress, getBadges } from '../utils/storage';
import { BADGES, BADGE_RARITY_COLORS } from '../constants/badges';
import { stopAllLevelSounds } from '../utils/audio';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

export const SettingsScreen = ({ navigation }) => {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalGames, setTotalGames] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const [bestMoves, setBestMoves] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [userBadges, setUserBadges] = useState([]);
  
  // Animated gear rotation
  const gearRotation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Continuous gear rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(gearRotation, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    
    return () => rotateAnimation.stop();
  }, []);

  useEffect(() => {
    loadSettings();
    loadAchievements();
    loadBadges();
  }, []);

  // Refresh achievements when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadAchievements();
      loadBadges();
      // Stop any audio that might be playing when entering settings
      stopAllLevelSounds().catch(error => {
        console.log('Error stopping sounds on settings focus:', error);
      });
    }, [])
  );

  const loadSettings = async () => {
    // Load sound preference from storage
    try {
      const soundPref = await AsyncStorage.getItem('@biblepuzzlequest_sound_enabled');
      setSoundEnabled(soundPref === null ? true : soundPref === 'true');
    } catch (error) {
      console.error('Error loading sound setting:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      const progress = await getProgress();
      const completed = Object.values(progress).filter(Boolean).length;
      setCompletedCount(completed);
      
      const stats = await getAllStats();
      let bestTimeValue = null;
      let bestMovesValue = null;
      let gamesCount = 0;
      
      Object.entries(stats).forEach(([levelId, stat]) => {
        if (stat.completed) {
          gamesCount++;
          
          // Track best records (same logic as HomeScreen)
          if (stat.time && (bestTimeValue === null || stat.time < bestTimeValue)) {
            bestTimeValue = stat.time;
          }
          if (stat.moves !== undefined && (bestMovesValue === null || stat.moves < bestMovesValue)) {
            bestMovesValue = stat.moves;
          }
        }
      });
      
      setBestTime(bestTimeValue);
      setBestMoves(bestMovesValue);
      setTotalGames(gamesCount);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadBadges = async () => {
    try {
      const badgeIds = await getBadges();
      const badges = badgeIds.map(id => BADGES[id]).filter(Boolean);
      setUserBadges(badges);
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const toggleSound = async (value) => {
    setSoundEnabled(value);
    try {
      await AsyncStorage.setItem('@biblepuzzlequest_sound_enabled', value.toString());
    } catch (error) {
      console.error('Error saving sound setting:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

const handleAboutUs = () => {
    Alert.alert(
      '',
      t('settings.aboutUsContent'),
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleResetData = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();
      
      // Reset local state
      setTotalGames(0);
      setBestTime(null);
      setBestMoves(null);
      setUserBadges([]);
      
      setShowResetModal(false);
      
      Alert.alert(
        t('settings.success'),
        t('settings.dataResetSuccess'),
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error resetting data:', error);
      Alert.alert(
        t('settings.error'),
        t('settings.dataResetError'),
        [{ text: 'OK', style: 'default' }]
      );
    }
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
             onPress={() => navigation.goBack()}
             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
              <Text style={styles.backButton}>{t('settings.back')}</Text>
            </TouchableOpacity>
              <Text style={styles.title}>{t('settings.title')}</Text>
            <View style={styles.placeholder} />
         </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Language Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('common.language')}</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t('common.language')}</Text>
                <Text style={styles.settingDescription}>
                  {currentLanguage === 'en' ? t('common.english') : t('common.amharic')}
                </Text>
              </View>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    currentLanguage === 'en' && styles.languageButtonActive
                  ]}
                  onPress={() => changeLanguage('en')}
                >
                  <Text style={[
                    styles.languageButtonText,
                    currentLanguage === 'en' && styles.languageButtonTextActive
                  ]}>
                    {t('common.english')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    currentLanguage === 'am' && styles.languageButtonActive
                  ]}
                  onPress={() => changeLanguage('am')}
                >
                  <Text style={[
                    styles.languageButtonText,
                    currentLanguage === 'am' && styles.languageButtonTextActive
                  ]}>
                    {t('common.amharic')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sound Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.audio')}</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t('settings.puzzleSounds')}</Text>
                <Text style={styles.settingDescription}>
                  {t('settings.puzzleSoundsDescription')}
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: COLORS.darker, true: COLORS.gold + '40' }}
                thumbColor={soundEnabled ? COLORS.gold : COLORS.light}
                ios_backgroundColor={COLORS.darker}
              />
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.achievements')}</Text>
            <View style={styles.achievementCard}>
              <View style={styles.achievementRow}>
                <Text style={styles.achievementLabel}>{t('settings.storiesCompleted')}</Text>
                <Text style={styles.achievementValue}>{completedCount}/6</Text>
              </View>
              <View style={styles.achievementDivider} />
              <View style={styles.achievementRow}>
                <Text style={styles.achievementLabel}>{t('settings.gamesWon')}</Text>
                <Text style={styles.achievementValue}>{totalGames}</Text>
              </View>
              <View style={styles.achievementDivider} />
              <View style={styles.achievementRow}>
                <Text style={styles.achievementLabel}>{t('settings.bestTime')}</Text>
                <Text style={styles.achievementValue}>
                  {bestTime !== null ? formatTime(bestTime) : '--:--'}
                </Text>
              </View>
              <View style={styles.achievementDivider} />
              <View style={styles.achievementRow}>
                <Text style={styles.achievementLabel}>{t('settings.bestMoves')}</Text>
                <Text style={styles.achievementValue}>
                  {bestMoves !== null ? bestMoves : '--'}
                </Text>
              </View>
            </View>
          </View>

          {/* Badges */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎖️ Badges</Text>
            <View style={styles.badgesContainer}>
              {userBadges.length > 0 ? (
                <View style={styles.badgesGrid}>
                  {userBadges.map((badge, index) => (
                    <View key={badge.id} style={styles.badgeCard}>
                      <View style={styles.badgeImageContainer}>
                        <Text style={styles.badgeIcon}>{badge.icon}</Text>
                      </View>
                      <Text style={styles.badgeName}>{badge.name}</Text>
                      <View style={[styles.rarityBadge, { backgroundColor: BADGE_RARITY_COLORS[badge.rarity] }]}>
                        <Text style={styles.rarityText}>{badge.rarity.toUpperCase()}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noBadgesText}>No badges earned yet. Keep playing!</Text>
              )}
            </View>
          </View> */}

          {/* App Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
            <TouchableOpacity style={styles.menuItem} onPress={handleAboutUs}>
              <Text style={styles.menuItemText}>{t('settings.aboutUs')}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>{t('settings.appVersion')}</Text>
              <Text style={styles.versionText}>1.0.0</Text>
            </View>
            <TouchableOpacity 
              style={[styles.menuItem, styles.resetMenuItem]} 
              onPress={() => setShowResetModal(true)}
            >
              <Text style={[styles.menuItemText, styles.resetMenuItemText]}>{t('settings.resetAllData')}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bizzle
            </Text>
            <Text style={styles.footerSubtext}>
              {t('settings.madeWithFaith')}
            </Text>
          </View>
        </ScrollView>

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('settings.resetDataTitle')}</Text>
              <Text style={styles.modalMessage}>
                {t('settings.resetDataMessage')}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowResetModal(false)}
                >
                  <Text style={styles.cancelButtonText}>{t('settings.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleResetData}
                >
                  <Text style={styles.confirmButtonText}>{t('settings.reset')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  gearIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  placeholder: {
    width: 50,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 35,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.light,
    lineHeight: 20,
  },
  achievementCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.gold + '30',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  achievementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementLabel: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
  },
  achievementValue: {
    fontSize: 16,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  achievementDivider: {
    height: 1,
    backgroundColor: COLORS.white + '20',
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
  },
  menuItemArrow: {
    fontSize: 20,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: 14,
    color: COLORS.light,
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    color: COLORS.gold,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: COLORS.light,
    fontStyle: 'italic',
  },
  badgesContainer: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: COLORS.white + '20',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.white + '30',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badgeImage: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  badgeIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 10,
    color: COLORS.white,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: COLORS.white,
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  noBadgesText: {
    fontSize: 16,
    color: COLORS.light,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  // Reset button styles
  resetMenuItem: {
    borderColor: COLORS.error + '50',
    backgroundColor: COLORS.error + '10',
  },
  resetMenuItemText: {
    color: COLORS.error,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: COLORS.darker,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    borderWidth: 2,
    borderColor: COLORS.gold + '30',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.light,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.white + '20',
    borderWidth: 1,
    borderColor: COLORS.white + '30',
  },
  confirmButton: {
    backgroundColor: COLORS.error,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Language toggle styles
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.white + '20',
    borderWidth: 1,
    borderColor: COLORS.white + '30',
  },
  languageButtonActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  languageButtonTextActive: {
    color: COLORS.darker,
  },
});