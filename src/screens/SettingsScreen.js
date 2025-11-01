import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { getAllStats, getProgress } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export const SettingsScreen = ({ navigation }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [totalGames, setTotalGames] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const [bestMoves, setBestMoves] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadSettings();
    loadAchievements();
  }, []);

  // Refresh achievements when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadAchievements();
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
      '🧩 Bible Puzzle Quest\n\n' +
      'We are a group of multidisciplinary individuals dedicated to creating a fun Christian puzzle game that encourages kids to explore Bible verses and captivating stories. Our mission is to make learning about the Bible an unforgettable adventure, combining interactive puzzles with uplifting gospel music.\n\n' +
      '',
      [{ text: 'OK', style: 'default' }]
    );
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
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Sound Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔊 Audio</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Puzzle Sounds</Text>
                <Text style={styles.settingDescription}>
                  Enable background sounds for puzzles
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
            <Text style={styles.sectionTitle}>🏆 Achievements</Text>
            <View style={styles.achievementCard}>
              <View style={styles.achievementRow}>
                <Text style={styles.achievementLabel}>Stories Completed</Text>
                <Text style={styles.achievementValue}>{completedCount}/6</Text>
              </View>
              <View style={styles.achievementDivider} />
              <View style={styles.achievementRow}>
                <Text style={styles.achievementLabel}>Games Won</Text>
                <Text style={styles.achievementValue}>{totalGames}</Text>
              </View>
              <View style={styles.achievementDivider} />
              <View style={styles.achievementRow}>
                <Text style={styles.achievementLabel}>Best Time</Text>
                <Text style={styles.achievementValue}>
                  {bestTime !== null ? formatTime(bestTime) : '--:--'}
                </Text>
              </View>
              <View style={styles.achievementDivider} />
              <View style={styles.achievementRow}>
                <Text style={styles.achievementLabel}>Best Moves</Text>
                <Text style={styles.achievementValue}>
                  {bestMoves !== null ? bestMoves : '--'}
                </Text>
              </View>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ About</Text>
            <TouchableOpacity style={styles.menuItem} onPress={handleAboutUs}>
              <Text style={styles.menuItemText}>📖 About Us</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.menuItem}>
              <Text style={styles.menuItemText}>📱 App Version</Text>
              <Text style={styles.versionText}>1.0.0</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bible Puzzle Quest
            </Text>
            <Text style={styles.footerSubtext}>
              Made with faith and love
            </Text>
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
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
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
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
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
});