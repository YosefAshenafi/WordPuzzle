const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for Reanimated
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-reanimated': 'react-native-reanimated',
};

// Add support for audio files
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'mp3',
  'MP3',
  'wav',
  'm4a',
  'aac',
  'ogg',
  'flac'
];

// Ensure Reanimated is properly transformed
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;