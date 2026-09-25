const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Disable package.json "exports" field resolution so Metro uses
// classic "main" field fallback — fixes broken lucide-react-native exports
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
