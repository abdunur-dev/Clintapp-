import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Ionicons name="book-outline" size={72} color="#C9A84C" />
          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.subtitle}>
            The page you're looking for doesn't exist.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0C1A',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'CrimsonPro_700Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#7878A0',
    textAlign: 'center',
    fontFamily: 'CrimsonPro_400Regular',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#C9A84C',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 16,
  },
  buttonText: {
    color: '#0B0C1A',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'CrimsonPro_700Bold',
  },
});