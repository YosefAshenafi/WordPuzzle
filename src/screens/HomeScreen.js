import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { getRandomVerse, LEVELS } from '../constants/levels';
import { getProgress, getAllStats, loadCurrentGameState } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { stopAllLevelSounds } from '../utils/audio';

const { width, height } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [verse, setVerse] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const [bestMoves, setBestMoves] = useState(null);
  const [totalGames, setTotalGames] = useState(0);
  const [currentTime, setCurrentTime] = useState(null);
  const [currentMoves, setCurrentMoves] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProgress();
      // Stop any audio that might be playing when returning to home
      stopAllLevelSounds().catch(error => {
        console.log('Error stopping sounds on home focus:', error);
      });
    }, [])
  );

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinueQuest = async () => {
  try {
    const progress = await getProgress();
    const completed = Object.values(progress).filter(Boolean).length;
    
    if (completed === 0) {
      // No levels completed, go to first level
      navigation.navigate('Game', { level: LEVELS[0], isContinue: false });
    } else {
      // Find the current incomplete level (could be in progress)
      const currentLevelId = Math.min(completed + 1, LEVELS.length);
      const currentLevel = LEVELS[currentLevelId - 1];
      
      // Check if there's a saved game state for this level
      const savedState = await loadCurrentGameState(currentLevel.id);
      
      if (savedState) {
        // Has saved state, continue from where left off
        navigation.navigate('Game', { level: currentLevel, isContinue: true });
      } else {
        // No saved state, start fresh
        navigation.navigate('Game', { level: currentLevel, isContinue: false });
      }
    }
  } catch (error) {
    console.error('Error loading progress for continue quest:', error);
    navigation.navigate('Levels');
  }
};

const loadProgress = async () => {
    const progress = await getProgress();
    const completed = Object.values(progress).filter(Boolean).length;
    setCompletedCount(completed);
    
    // Load achievement stats
    const stats = await getAllStats();
    let bestTimeValue = null;
    let bestMovesValue = null;
    let gamesCount = 0;
    let latestCompletedTime = null;
    let latestCompletedMoves = null;
    let latestTimestamp = 0;
    
    Object.entries(stats).forEach(([levelId, stat]) => {
      if (stat.completed) {
        gamesCount++;
        
        // Track best records
        if (stat.time && (bestTimeValue === null || stat.time < bestTimeValue)) {
          bestTimeValue = stat.time;
        }
        if (stat.moves !== undefined && (bestMovesValue === null || stat.moves < bestMovesValue)) {
          bestMovesValue = stat.moves;
        }
        
        // Track most recent completed game
        if (stat.timestamp && stat.timestamp > latestTimestamp) {
          latestTimestamp = stat.timestamp;
          latestCompletedTime = stat.time;
          latestCompletedMoves = stat.moves;
        } else if (!latestTimestamp && stat.completed) {
          // Fallback for games without timestamp (backward compatibility)
          latestTimestamp = Date.now(); // Use current time as fallback
          latestCompletedTime = stat.time;
          latestCompletedMoves = stat.moves;
        }
      }
    });
    
    setBestTime(bestTimeValue);
    setBestMoves(bestMovesValue);
    setTotalGames(gamesCount);
    
    // If there are completed games, show the most recent stats
    if (gamesCount > 0) {
      setCurrentTime(latestCompletedTime);
      setCurrentMoves(latestCompletedMoves);
    } else {
      // No games completed, set to null to avoid showing zeros
      setCurrentTime(null);
      setCurrentMoves(null);
     }
   };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadProgress();
      setVerse(getRandomVerse());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
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

       <SafeAreaView style={styles.safeArea}>
         <ScrollView
           contentContainerStyle={styles.content}
           showsVerticalScrollIndicator={false}
           refreshControl={
             <RefreshControl
               refreshing={refreshing}
               onRefresh={onRefresh}
               tintColor={COLORS.gold}
               colors={[COLORS.gold]}
             />
           }
         >
           {/* Settings Button - Positioned absolutely */}
           <TouchableOpacity
             style={styles.settingsButtonTop}
             onPress={() => navigation.navigate('Settings')}
             activeOpacity={0.7}
             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
           >
             <Text style={styles.settingsIcon}>⚙️</Text>
           </TouchableOpacity>

           {/* Leaderboard Button */}
           <TouchableOpacity
             style={styles.leaderboardButtonTop}
             onPress={() => navigation.navigate('Leaderboard')}
             activeOpacity={0.7}
             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
           >
             <Text style={styles.leaderboardIcon}>🏆</Text>
           </TouchableOpacity>

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

{/* Achievement Records */}
          <Animated.View style={[styles.achievementContainer, { opacity: subtitle2Op }]}>
            <View style={styles.achievementCard}>
              <View style={styles.achievementHeader}>
                <Text style={styles.achievementTitle}>🏆 Personal Records</Text>
              </View>
              
              {totalGames > 0 ? (
                <View>
                  {/* Current Game Stats */}
                  <View style={styles.currentGameSection}>
                    <Text style={styles.currentGameLabel}>Last Game</Text>
                    <View style={styles.currentGameStats}>
                      <View style={styles.currentGameItem}>
                        <Text style={styles.currentGameIcon}>⏱️</Text>
                        <Text style={styles.currentGameValue}>
                          {currentTime !== null ? formatTime(currentTime) : '--:--'}
                        </Text>
                      </View>
                      <View style={styles.currentGameDivider} />
                      <View style={styles.currentGameItem}>
                        <Text style={styles.currentGameValue}>
                          {currentMoves !== null ? `${currentMoves} moves` : '-- moves'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Best Records */}
                  <View style={styles.bestRecordsSection}>
                    <Text style={styles.bestRecordsLabel}>All-Time Best</Text>
                    <View style={styles.bestRecordsStats}>
                      <View style={styles.bestRecordItem}>
                        <Text style={styles.bestRecordIcon}>⚡</Text>
                        <View style={styles.bestRecordInfo}>
                          <Text style={styles.bestRecordLabel}>Time</Text>
                          <Text style={[
                            styles.bestRecordValue,
                            currentTime === bestTime && styles.newRecord
                          ]}>
                            {formatTime(bestTime)}
                            {currentTime === bestTime && ' 🏆'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.bestRecordDivider} />
                      <View style={styles.bestRecordItem}>
                        <View style={styles.bestRecordInfo}>
                          <Text style={styles.bestRecordLabel}>Moves</Text>
                          <Text style={[
                            styles.bestRecordValue,
                            currentMoves === bestMoves && styles.newRecord
                          ]}>
                            {bestMoves}
                            {currentMoves === bestMoves && ' 🏆'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.noGamesContainer}>
                  <Text style={styles.noGamesText}>Complete puzzles to see your records!</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Enhanced Buttons */}
          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: button1Scale }] }]}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinueQuest}
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

           {/* User Info and Sign Out */}
           {user && (
             <View style={styles.userInfoContainer}>
               <View style={styles.userInfoCard}>
                 <Text style={styles.userInfoText}>
                   👤 {user.displayName || 'Anonymous'}
                 </Text>
                 <TouchableOpacity
                   style={styles.signOutButton}
                   onPress={signOut}
                   activeOpacity={0.7}
                 >
                   <Text style={styles.signOutText}>Sign Out</Text>
                 </TouchableOpacity>
               </View>
             </View>
           )}

          {/* Enhanced Footer message */}
          <View style={styles.footer}>
            <View style={styles.footerCard}>
              <Text style={styles.footerText}>
                Complete puzzles to discover Bible stories
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
  settingsButtonTop: {
    position: 'absolute',
    top: 20,
    right: 20,
    elevation: 4,
    zIndex: 10,
  },
  settingsIcon: {
    fontSize: 20,
  },
  leaderboardButtonTop: {
    position: 'absolute',
    top: 20,
    right: 60,
    elevation: 4,
    zIndex: 10,
  },
  leaderboardIcon: {
    fontSize: 20,
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
  achievementContainer: {
    marginBottom: 30,
  },
  achievementCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  achievementHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 16,
    color: COLORS.gold,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  achievementInfo: {
    alignItems: 'center',
  },
  achievementLabel: {
    fontSize: 10,
    color: COLORS.light,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  achievementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  achievementDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.white + '30',
    marginHorizontal: 12,
  },
  currentGameSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white + '20',
  },
  currentGameLabel: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  currentGameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  currentGameItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentGameIcon: {
    fontSize: 16,
    marginRight: 6,
    color: COLORS.light,
  },
  currentGameValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  currentGameDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.white + '20',
  },
  bestRecordsSection: {
    // No additional styles needed
  },
  bestRecordsLabel: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bestRecordsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestRecordItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestRecordIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  bestRecordInfo: {
    alignItems: 'center',
  },
  bestRecordLabel: {
    fontSize: 10,
    color: COLORS.light,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bestRecordValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  newRecord: {
    color: COLORS.gold,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  bestRecordDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.white + '30',
    marginHorizontal: 8,
  },
  noGamesContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noGamesText: {
    fontSize: 14,
    color: COLORS.light,
    fontStyle: 'italic',
    textAlign: 'center',
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
  userInfoContainer: {
    marginBottom: 20,
  },
  userInfoCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  userInfoText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    flex: 1,
  },
  signOutButton: {
    backgroundColor: COLORS.white + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.white + '40',
  },
  signOutText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
});
