import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Animated,
  Modal,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

export const PuzzleGrid = ({
  gridSize,
  tiles,
  onTilePress,
  moveCount,
  maxMoves,
  showHints,
  restartCount,
  imageUrl,
}) => {
  const { t } = useLanguage();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const gridWidth = width * 0.9;
  const tileSize = gridWidth / gridSize;

  const handleTilePress = (index) => {
    const tile = tiles[index];
    
    // Don't allow clicking on empty tile
    if (tile.isEmpty) return;
    
    // Find empty tile
    const emptyIndex = tiles.findIndex(t => t.isEmpty);
    
    // If no empty tile found, return
    if (emptyIndex === -1) return;
    
    // Try to move the clicked tile to empty space
    onTilePress(index, emptyIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t('puzzle.try')}</Text>
          <Text style={styles.statValue}>{restartCount}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t('puzzle.limit')}</Text>
          <Text style={styles.statValue}>{maxMoves}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t('puzzle.remaining')}</Text>
          <Text style={[
            styles.statValue,
            { color: moveCount > maxMoves ? COLORS.error : COLORS.success }
          ]}>
            {Math.max(0, maxMoves - moveCount)}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.previewButton} 
          onPress={() => setShowPreviewModal(true)} 
          activeOpacity={0.8}
        >
          <Text style={styles.previewIcon}>👁️</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.grid,
          {
            width: gridWidth,
            height: gridWidth,
          },
        ]}
      >
        {tiles.map((tile, index) => (
          <PuzzleTile
            key={tile.id}
            tile={tile}
            index={index}
            tileSize={tileSize}
            imageUrl={imageUrl}
            gridSize={gridSize}
            isSelected={selectedIndex === index}
            showHints={showHints}
            onPress={() => handleTilePress(index)}
          />
        ))}
      </View>

      {/* Fullscreen Preview Modal */}
      <Modal
        visible={showPreviewModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            activeOpacity={1}
            onPress={() => setShowPreviewModal(false)}
          >
            <View style={styles.modalContent}>
<Image
            source={imageUrl}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPreviewModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>✕ {t('puzzle.close')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const PuzzleTile = ({
  tile,
  index,
  tileSize,
  imageUrl,
  gridSize,
  isSelected,
  showHints,
  onPress,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isSelected) {
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  const row = Math.floor(tile.position / gridSize);
  const col = tile.position % gridSize;

  // Don't render empty tile
  if (tile.isEmpty) {
    return (
      <View
        style={[
          styles.emptyTile,
          {
            width: tileSize,
            height: tileSize,
            left: col * tileSize,
            top: row * tileSize,
          },
        ]}
      />
    );
  }

return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: tileSize,
          height: tileSize,
          left: col * tileSize,
          top: row * tileSize,
          borderWidth: isSelected ? 4 : 2,
          borderColor: isSelected ? COLORS.gold : COLORS.accent,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, width: '100%' }}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.tileImageContainer,
            {
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            },
          ]}
        >
          <Image
            source={imageUrl}
            style={[
              styles.tileImage,
              {
                width: gridSize * tileSize,
                height: gridSize * tileSize,
                // Position image to show the correct portion
                left: -((tile.correctPosition % gridSize) * tileSize),
                top: -(Math.floor(tile.correctPosition / gridSize) * tileSize),
              },
            ]}

          />
        </View>
        
        {/* Hint Number Overlay */}
        {showHints && !tile.isEmpty && (
          <View style={styles.hintOverlay}>
            <Text style={styles.hintNumber}>
              {tile.correctPosition + 1}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: COLORS.white + '20',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  statLabel: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  grid: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.darker,
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  tile: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileImageContainer: {
    position: 'relative',
  },
  tileImage: {
    position: 'absolute',
    resizeMode: 'cover',
  },
  emptyTile: {
    position: 'absolute',
    backgroundColor: COLORS.darker,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderStyle: 'dashed',
  },
  previewButton: {
    alignItems: 'center',
    backgroundColor: COLORS.white + '20',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.gold + '40',
  },
  previewIcon: {
    fontSize: 20,
    color: COLORS.gold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 12,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: COLORS.darker,
    fontSize: 16,
    fontWeight: '700',
  },
  hintOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  hintNumber: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
