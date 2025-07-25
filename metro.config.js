const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Add support for resolving node modules
config.resolver.nodeModulesPaths = [
  './node_modules',
];

// Enable symlinks
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;