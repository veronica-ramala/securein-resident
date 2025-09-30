// app/flash-screen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserContext } from '../context/UserContext'; // ✅ import auth state

const { width, height } = Dimensions.get('window');

export default function FlashScreen() {
  const router = useRouter();
  const { isLoggedIn } = useUserContext() || {}; // your context should expose this
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [dot1Anim] = useState(new Animated.Value(0.3));
  const [dot2Anim] = useState(new Animated.Value(0.3));
  const [dot3Anim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true })
    ]).start();

    const createDotAnimation = (dotAnim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
          Animated.timing(dotAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        ])
      );

    createDotAnimation(dot1Anim, 0).start();
    createDotAnimation(dot2Anim, 200).start();
    createDotAnimation(dot3Anim, 400).start();

    // Show splash for 3s, then route based on login state
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }).start(() => {
        if (isLoggedIn) {
          router.replace('/(drawer)'); // ✅ logged-in users go straight to app shell
        } else {
          router.replace('/login'); // guests go to login
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, fadeAnim, scaleAnim, dot1Anim, dot2Anim, dot3Anim, isLoggedIn]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#2196F3" />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.appName}>SECUREIN</Text>
          <Text style={styles.tagline}>Community Management</Text>
        </Animated.View>

        <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
          <Text style={styles.welcomeText}>Welcome to your community</Text>
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingDot, { opacity: dot1Anim }]} />
            <Animated.View style={[styles.loadingDot, { opacity: dot2Anim }]} />
            <Animated.View style={[styles.loadingDot, { opacity: dot3Anim }]} />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2196F3' },
  content: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 60 },
  logoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoIcon: {
    width: 120, height: 120, marginBottom: 20, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  appName: {
    fontSize: 32, fontWeight: 'bold', color: '#FFFFFF',
    letterSpacing: 2, marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  tagline: { fontSize: 16, color: '#E3F2FD', fontWeight: '500', letterSpacing: 1 },
  bottomContainer: { alignItems: 'center', marginBottom: 40 },
  welcomeText: { fontSize: 18, color: '#E3F2FD', fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  loadingContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loadingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF', marginHorizontal: 4 },
});
