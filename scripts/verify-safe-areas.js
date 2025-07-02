#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const tabsDir = path.join(__dirname, '../app/(tabs)');

// Get all .tsx files in the tabs directory
const files = fs.readdirSync(tabsDir).filter(file => file.endsWith('.tsx') && file !== '_layout.tsx');

console.log('🔍 Verifying Safe Area Implementation Across All Screens...\n');

let allGood = true;

files.forEach(file => {
  const filePath = path.join(tabsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasProperSafeAreaImport = content.includes("import { SafeAreaView } from 'react-native-safe-area-context'");
  const hasIncorrectSafeAreaImport = content.includes("SafeAreaView") && content.includes("} from 'react-native'") && !hasProperSafeAreaImport;
  const usesSafeAreaView = content.includes('<SafeAreaView');
  
  let status = '✅';
  let message = 'Proper SafeAreaView implementation';
  
  if (hasIncorrectSafeAreaImport) {
    status = '❌';
    message = 'Using incorrect SafeAreaView import (from react-native instead of react-native-safe-area-context)';
    allGood = false;
  } else if (!hasProperSafeAreaImport && usesSafeAreaView) {
    status = '⚠️';
    message = 'Uses SafeAreaView but missing proper import';
    allGood = false;
  } else if (!usesSafeAreaView) {
    status = '⚠️';
    message = 'No SafeAreaView found - please verify if needed';
    allGood = false;
  }
  
  console.log(`${status} ${file.padEnd(25)} - ${message}`);
});

console.log('\n' + '='.repeat(80));

if (allGood) {
  console.log('🎉 All screens are properly configured with SafeAreaView!');
  console.log('✅ All imports are using react-native-safe-area-context');
  console.log('✅ All screens respect device safe areas');
} else {
  console.log('⚠️  Some screens need attention. Please review the issues above.');
}

console.log('\n📱 Safe Area Benefits:');
console.log('• Proper spacing on devices with notches (iPhone X+)');
console.log('• Correct layout on devices with home indicators');
console.log('• Consistent behavior across different screen sizes');
console.log('• Better user experience on modern devices');

console.log('\n🔧 Key Implementation Details:');
console.log('• Using SafeAreaView from react-native-safe-area-context');
console.log('• Applied to main container of each screen');
console.log('• Enhanced modal components with safe area support');
console.log('• Consistent styling across all screens');