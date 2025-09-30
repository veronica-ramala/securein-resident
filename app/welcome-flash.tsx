// app/welcome-flash.tsx
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
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    Animated.timing(progressAnim, { toValue: 1, duration: 2000, useNativeDriver: false }).start();

    const rotationAnimation = Animated.loop(
      Animated.timing(dotRotation, { toValue: 1, duration: 2000, useNativeDriver: true })
    );
    rotationAnimation.start();

    const timer = setTimeout(() => {
      // ✅ Enter the Drawer (it opens Tabs by default)
      router.replace('/(drawer)');
    }, 2500);

    return () => {
      clearTimeout(timer);
      rotationAnimation.stop();
    };
  }, [router, fadeAnim, scaleAnim, slideAnim, progressAnim, dotRotation]);

  const spin = dotRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#2196F3" />
      <LinearGradient colors={['#2196F3', '#1E88E5', '#2196F3']} style={styles.gradient}>
        {/* ... your existing splash UI ... */}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  /* keep your existing styles */
});
