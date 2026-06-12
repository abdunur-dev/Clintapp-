import React, { useRef, useEffect } from 'react';
import { Animated, View, Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FadeInView({ children, delay = 0, duration = 400, style }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

export function ScaleInView({ children, delay = 0, style }) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
}

export function SlideUpView({ children, delay = 0, duration = 350, style }) {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: duration * 0.7, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

export function ScaleButton({ children, onPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, tension: 150, friction: 5 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 150, friction: 5 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <AnimatedPressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {children}
      </AnimatedPressable>
    </Animated.View>
  );
}