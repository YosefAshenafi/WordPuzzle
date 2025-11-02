import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardService } from '../services/leaderboardService';
import { COLORS, GRADIENTS } from '../constants/colors';
import { stopAllLevelSounds } from '../utils/audio';

const { width, height } = Dimensions.get('window');

export const LeaderboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('totalScore');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const categories = [
    { key: 'totalScore', label: 'Total Score' },
    { key: 'bestScore', label: 'Best Score' },
    { key: 'averageScore', label: 'Average Score' },
    { key: 'levelsCompleted', label: 'Levels Completed' },
  ];

  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await LeaderboardService.getLeaderboardByCategory(category, 50);
      setLeaderboard(data);
      
      if (user) {
        const rank = await LeaderboardService.getPlayerRank(user.uid);
        setUserRank(rank);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [category, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await LeaderboardService.searchPlayers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    // Stop any audio that might be playing when entering leaderboard
    stopAllLevelSounds().catch(error => {
      console.log('Error stopping sounds on leaderboard focus:', error);
    });
  }, [loadLeaderboard]);

  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return <Text style={styles.rankBadge}>🥇</Text>;
    } else if (rank === 2) {
      return <Text style={styles.rankBadge}>🥈</Text>;
    } else if (rank === 3) {
      return <Text style={styles.rankBadge}>🥉</Text>;
    }
    return <Text style={styles.rankNumber}>#{rank}</Text>;
  };

  const renderPlayerItem = ({ item, index }) => {
    const isCurrentUser = user && item.uid === user.uid;
    
    return (
      <View style={[styles.playerItem, isCurrentUser && styles.currentUserItem]}>
        <View style={styles.rankContainer}>
          {renderRankBadge(index + 1)}
        </View>
        
        {item.photoURL ? (
          <Image source={{ uri: item.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.avatarText}>
              {item.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, isCurrentUser && styles.currentUserName]}>
            {item.displayName}
            {isCurrentUser && ' (You)'}
          </Text>
          <Text style={styles.playerStats}>
            {item.gamesPlayed} games • Level {item.levelsCompleted}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>
            {category === 'totalScore' && item.totalScore.toLocaleString()}
            {category === 'bestScore' && item.bestScore.toLocaleString()}
            {category === 'averageScore' && Math.round(item.averageScore).toLocaleString()}
            {category === 'levelsCompleted' && item.levelsCompleted}
          </Text>
          <Text style={styles.scoreLabel}>
            {category === 'totalScore' && 'points'}
            {category === 'bestScore' && 'best'}
            {category === 'averageScore' && 'avg'}
            {category === 'levelsCompleted' && 'levels'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={GRADIENTS.secondary} style={styles.container}>
        <View style={styles.backgroundDecor}>
          <View style={[styles.decorCircle, styles.circle1]} />
          <View style={[styles.decorCircle, styles.circle2]} />
          <View style={[styles.decorCircle, styles.circle3]} />
        </View>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.gold} />
            <Text style={styles.loadingText}>Loading Leaderboard...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={GRADIENTS.secondary} style={styles.container}>
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
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
 {/* Navigation Buttons */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Settings Button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>🏆</Text>
            <Text style={styles.titleHighlight}>Leaderboard</Text>
            <View style={styles.titleUnderline} />
          </View>

          {/* User Rank Display */}
          {userRank && (
            <View style={styles.userRankContainer}>
              <View style={styles.userRankCard}>
                <Text style={styles.userRankTitle}>Your Rank</Text>
                <Text style={styles.userRankNumber}>#{userRank.rank}</Text>
                <Text style={styles.userRankTotal}>of {userRank.totalPlayers} players</Text>
              </View>
            </View>
          )}

          {/* Category Selection */}
          <View style={styles.categoryContainer}>
            <View style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>📊 Categories</Text>
              <View style={styles.categoryButtons}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryButton,
                      category === cat.key && styles.activeCategory,
                    ]}
                    onPress={() => setCategory(cat.key)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        category === cat.key && styles.activeCategoryText,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <View style={styles.searchCard}>
              <TextInput
                style={styles.searchInput}
                placeholder="🔍 Search players..."
                placeholderTextColor={COLORS.light}
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
          </View>

          {/* Leaderboard List */}
          <View style={styles.listContainer}>
            <FlatList
              data={searchQuery ? searchResults : leaderboard}
              renderItem={renderPlayerItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyIcon}>🎮</Text>
                    <Text style={styles.emptyText}>
                      {searchQuery ? 'No players found' : 'No players on leaderboard yet'}
                    </Text>
                  </View>
                </View>
              }
            />
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: COLORS.white + '20',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: COLORS.white + '20',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  settingsIcon: {
    fontSize: 20,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.gold,
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
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
  userRankContainer: {
    marginBottom: 20,
  },
  userRankCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.gold + '40',
  },
  userRankTitle: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  userRankNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userRankTotal: {
    fontSize: 12,
    color: COLORS.light,
    fontWeight: '600',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryTitle: {
    fontSize: 16,
    color: COLORS.gold,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    backgroundColor: COLORS.white + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.white + '20',
  },
  activeCategory: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  categoryText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: COLORS.darker,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchInput: {
    backgroundColor: COLORS.white + '10',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: COLORS.white,
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '15',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  currentUserItem: {
    backgroundColor: COLORS.gold + '20',
    borderWidth: 2,
    borderColor: COLORS.gold + '60',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankBadge: {
    fontSize: 28,
  },
  rankNumber: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentUserName: {
    color: COLORS.gold,
  },
  playerStats: {
    color: COLORS.light,
    fontSize: 12,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: COLORS.light,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyCard: {
    backgroundColor: COLORS.white + '15',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    color: COLORS.light,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});