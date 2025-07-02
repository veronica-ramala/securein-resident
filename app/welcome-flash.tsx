import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, fontSize, spacing, s, vs, ms } from '../utils/responsive';

const { width, height } = Dimensions.get('window');

export default function WelcomeFlashScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));
  const [dotRotation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Continuous rotation for loading indicator
    const rotationAnimation = Animated.loop(
      Animated.timing(dotRotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotationAnimation.start();

    // Show welcome screen for 2.5 seconds then navigate to tabs
    const timer = setTimeout(() => {
      // Exit animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.replace('/(tabs)');
      });
    }, 2500);

    return () => {
      clearTimeout(timer);
      rotationAnimation.stop();
    };
  }, [router, fadeAnim, scaleAnim, slideAnim, progressAnim, dotRotation]);

  const spin = dotRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0077B6" />
      <LinearGradient
        colors={['#0077B6', '#1976D2', '#0077B6']}
        style={styles.gradient}
      >
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}>
          {/* Logo and App Info */}
          <View style={styles.logoSection}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/images/flash screen.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Animated.View style={[
                styles.glowEffect,
                { transform: [{ rotate: spin }] }
              ]} />
            </View>
            
            <Text style={styles.appTitle}>SECUREIN</Text>
            <Text style={styles.appSubtitle}>Community Management System</Text>
          </View>

          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeMessage}>
              Setting up your personalized{'\n'}community experience
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]} 
              />
            </View>
            <Text style={styles.loadingText}>Loading your dashboard...</Text>
          </View>
        </Animated.View>

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <Animated.View style={[styles.circle1, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.circle2, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.circle3, { opacity: fadeAnim }]} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(30),
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: vs(60),
  },
  imageContainer: {
    position: 'relative',
    marginBottom: vs(20),
  },
  logoImage: {
    width: s(120),
    height: s(120),
    borderRadius: s(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: s(35),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appTitle: {
    fontSize: fontSize.xxLarge,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: vs(8),
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  appSubtitle: {
    fontSize: fontSize.medium,
    color: '#E3F2FD',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: vs(50),
  },
  welcomeTitle: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: vs(10),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  welcomeMessage: {
    fontSize: fontSize.regular,
    color: '#E3F2FD',
    textAlign: 'center',
    lineHeight: fontSize.regular * 1.4,
    fontWeight: '400',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressContainer: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: vs(15),
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingText: {
    fontSize: fontSize.small,
    color: '#E3F2FD',
    fontWeight: '500',
    opacity: 0.9,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  circle1: {
    position: 'absolute',
    top: hp(10),
    right: wp(10),
    width: s(60),
    height: s(60),
    borderRadius: s(30),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle2: {
    position: 'absolute',
    bottom: hp(20),
    left: wp(15),
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circle3: {
    position: 'absolute',
    top: hp(25),
    left: wp(5),
    width: s(25),
    height: s(25),
    borderRadius: s(12.5),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});