#!/usr/bin/env node

/**
 * Script to find files that use responsive utilities
 * This helps identify which files need to be migrated to the new responsive system
 */

const fs = require('fs');
const path = require('path');

// Directories to search
const searchDirs = ['app', 'components', 'src'];

// Patterns to look for
const patterns = [
  /wp\(/g,                    // wp() function calls
  /hp\(/g,                    // hp() function calls
  /fontSize\./g,              // fontSize object usage
  /spacing\./g,               // spacing object usage
  /isSmallDevice/g,           // device type checks
  /isLargeDevice/g,
  /getResponsiveText/g,       // responsive text functions
  /Dimensions\.get/g,         // Direct Dimensions usage
  /SCREEN_WIDTH/g,            // Screen width constants
  /SCREEN_HEIGHT/g,           // Screen height constants
];

// Results storage
const results = {
  files: [],
  summary: {
    totalFiles: 0,
    filesWithResponsive: 0,
    patternCounts: {}
  }
};

// Initialize pattern counts
patterns.forEach((pattern, index) => {
  results.summary.patternCounts[pattern.source] = 0;
});

function searchInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileResult = {
      path: filePath,
      matches: [],
      totalMatches: 0
    };

    patterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        fileResult.matches.push({
          pattern: pattern.source,
          count: matches.length,
          lines: getLineNumbers(content, pattern)
        });
        fileResult.totalMatches += matches.length;
        results.summary.patternCounts[pattern.source] += matches.length;
      }
    });

    if (fileResult.totalMatches > 0) {
      results.files.push(fileResult);
      results.summary.filesWithResponsive++;
    }

    results.summary.totalFiles++;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }
}

function getLineNumbers(content, pattern) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1);
    }
  });
  
  return lineNumbers;
}

function searchDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping...`);
    return;
  }

  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other common directories
      if (!['node_modules', '.git', '.expo', 'dist', 'build'].includes(item)) {
        searchDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      // Only search TypeScript and JavaScript files
      if (/\.(ts|tsx|js|jsx)$/.test(item)) {
        searchInFile(fullPath);
      }
    }
  });
}

function generateReport() {
  console.log('\n=== RESPONSIVE UTILITIES USAGE REPORT ===\n');
  
  console.log(`📊 Summary:`);
  console.log(`   Total files scanned: ${results.summary.totalFiles}`);
  console.log(`   Files with responsive code: ${results.summary.filesWithResponsive}`);
  console.log(`   Coverage: ${((results.summary.filesWithResponsive / results.summary.totalFiles) * 100).toFixed(1)}%\n`);
  
  console.log(`📈 Pattern Usage:`);
  Object.entries(results.summary.patternCounts).forEach(([pattern, count]) => {
    if (count > 0) {
      console.log(`   ${pattern}: ${count} occurrences`);
    }
  });
  
  console.log(`\n📁 Files to migrate (sorted by usage):`);
  
  // Sort files by total matches (most used first)
  const sortedFiles = results.files.sort((a, b) => b.totalMatches - a.totalMatches);
  
  sortedFiles.forEach((file, index) => {
    console.log(`\n${index + 1}. ${file.path} (${file.totalMatches} matches)`);
    
    file.matches.forEach(match => {
      console.log(`   - ${match.pattern}: ${match.count} times (lines: ${match.lines.join(', ')})`);
    });
  });
  
  console.log(`\n🚀 Migration Priority:`);
  console.log(`   High Priority (>10 matches):`);
  sortedFiles.filter(f => f.totalMatches > 10).forEach(f => {
    console.log(`   - ${f.path} (${f.totalMatches} matches)`);
  });
  
  console.log(`   Medium Priority (5-10 matches):`);
  sortedFiles.filter(f => f.totalMatches >= 5 && f.totalMatches <= 10).forEach(f => {
    console.log(`   - ${f.path} (${f.totalMatches} matches)`);
  });
  
  console.log(`   Low Priority (<5 matches):`);
  sortedFiles.filter(f => f.totalMatches < 5).forEach(f => {
    console.log(`   - ${f.path} (${f.totalMatches} matches)`);
  });
  
  console.log(`\n💡 Next Steps:`);
  console.log(`   1. Start with high-priority files`);
  console.log(`   2. Use the ResponsiveWrapper component`);
  console.log(`   3. Replace Text with ResponsiveText`);
  console.log(`   4. Use useResponsive() hook for dynamic sizing`);
  console.log(`   5. Test on different screen sizes`);
  
  console.log(`\n📖 See RESPONSIVE_IMPLEMENTATION_GUIDE.md for detailed instructions`);
}

// Main execution
console.log('🔍 Searching for responsive utilities usage...\n');

searchDirs.forEach(dir => {
  console.log(`Searching in ${dir}/...`);
  searchDirectory(dir);
});

generateReport();

// Save detailed report to file
const reportPath = 'responsive-usage-report.json';
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n💾 Detailed report saved to: ${reportPath}`);