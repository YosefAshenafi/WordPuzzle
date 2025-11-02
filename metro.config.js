const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for Reanimated
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-reanimated': 'react-native-reanimated',
};

// Remove audio extensions from sourceExts so they're treated as assets
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => !['mp3', 'MP3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].includes(ext));

// Add audio formats to assetExts
config.resolver.assetExts.push(
  // Audio formats
  'mp3',
  'MP3',
  'wav',
  'm4a',
  'aac',
  'ogg',
  'flac'
);

// Ensure Reanimated is properly transformed
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;