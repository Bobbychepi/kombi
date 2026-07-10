import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

const G = {
  splash: "#FAFAF7",
  charcoal: "#171A18",
  gold: "#F6AE16",
  muted: "#737A78",
  border: "#D9E2DE",
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function SplashScreen() {
  const lineProgress = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const dotOne = useRef(new Animated.Value(0.3)).current;
  const dotTwo = useRef(new Animated.Value(0.3)).current;
  const dotThree = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.timing(lineProgress, {
      toValue: 1,
      duration: 2200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    const pulseDot = (dot: Animated.Value, delay: number) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 450,
            useNativeDriver: true,
          }),
        ])
      );

      loop.start();
      return loop;
    };

    const dotLoops = [
      pulseDot(dotOne, 0),
      pulseDot(dotTwo, 150),
      pulseDot(dotThree, 300),
    ];

    const fadeTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2600);

    const navigateTimer = setTimeout(() => {
      router.replace("/homescreen");
    }, 3100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
      dotLoops.forEach((loop) => loop.stop());
    };
  }, [dotOne, dotThree, dotTwo, lineProgress, logoScale, screenOpacity]);

  const strokeDashoffset = lineProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [220, 0],
  });

  return (
    <Animated.View style={[styles.splashScreen, { opacity: screenOpacity }]}>
      <View style={styles.splashRoute}>
        <Svg width={200} height={40} viewBox="0 0 200 40">
          <Path
            d="M10 20 Q60 5 100 20 Q140 35 190 20"
            stroke={G.border}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />

          <AnimatedPath
            d="M10 20 Q60 5 100 20 Q140 35 190 20"
            stroke={G.gold}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={220}
            strokeDashoffset={strokeDashoffset}
          />

          <Circle cx={10} cy={20} r={4} fill={G.gold} />
          <Circle cx={100} cy={20} r={5} fill={G.gold} />
          <Circle cx={190} cy={20} r={4} fill={G.gold} />
        </Svg>
      </View>

      <Animated.View
        style={[styles.logoBlock, { transform: [{ scale: logoScale }] }]}
      >
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>kombi</Text>
          <View style={styles.logoDot} />
        </View>

        <Text style={styles.tagline}>Routes · Ranks · Rides</Text>
      </Animated.View>

      <View style={styles.loadingDots}>
        <Animated.View
          style={[
            styles.loadingDotSmall,
            { opacity: dotOne, transform: [{ scale: dotOne }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingDotLarge,
            { opacity: dotTwo, transform: [{ scale: dotTwo }] },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingDotSmall,
            { opacity: dotThree, transform: [{ scale: dotThree }] },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashScreen: {
    flex: 1,
    backgroundColor: G.splash,
    alignItems: "center",
    justifyContent: "center",
  },
  splashRoute: {
    width: 200,
    height: 40,
    marginBottom: 40,
  },
  logoBlock: {
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  logoText: {
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 48,
    letterSpacing: -2,
    color: G.charcoal,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: G.gold,
    marginLeft: 3,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 12,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: G.muted,
  },
  loadingDots: {
    marginTop: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: G.border,
  },
  loadingDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: G.gold,
  },
});