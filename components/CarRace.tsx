import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';

const CarRace: React.FC = () => {
  const [isRacing, setIsRacing] = useState(false);
  const carAnimations = useRef<Animated.Value[]>([]).current;
  const backgroundOffset = useRef({ x: new Animated.Value(0), y: new Animated.Value(0) }).current;

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const trackWidth = 800;
  const trackHeight = 534;

  const raceLine = [
    { x: 327, y: 451 },
    { x: 413, y: 439 },
    { x: 462, y: 424 },
    { x: 514, y: 361 },
    { x: 567, y: 296 },
    { x: 609, y: 274 },
    { x: 650, y: 251 },
    { x: 682, y: 232 },
    { x: 694, y: 202 },
    { x: 697, y: 170 },
    { x: 687, y: 130 },
    { x: 663, y: 105 },
    { x: 622, y: 93 },
    { x: 553, y: 90 },
    { x: 478, y: 93 },
    { x: 444, y: 106 },
    { x: 428, y: 128 },
    { x: 357, y: 198 },
    { x: 292, y: 221 },
    { x: 160, y: 256 },
    { x: 124, y: 280 },
    { x: 110, y: 307 },
    { x: 104, y: 339 },
    { x: 106, y: 372 },
    { x: 117, y: 398 },
    { x: 151, y: 430 },
    { x: 327, y: 451 },
  ];

  const carImages = [
    require('../assets/images/car-red.png'),
    require('../assets/images/car-blue.png'),
    require('../assets/images/car-orange.png'),
    require('../assets/images/car-green.png'),
  ];

  useEffect(() => {
    carAnimations.length = 4;
    for (let i = 0; i < 4; i++) {
      carAnimations[i] = carAnimations[i] || new Animated.Value(0);
    }

    return () => {
      carAnimations.forEach((animValue) => animValue?.removeAllListeners());
      carAnimations.forEach((animValue) => animValue?.stopAnimation());
    };
  }, []);

  const resetAnimations = () => {
    carAnimations.forEach((animValue) => animValue.setValue(0));
  };

  const startRace = () => {
    resetAnimations();
    carAnimations.forEach((animValue, carIndex) => {
      Animated.timing(animValue, {
        toValue: raceLine.length - 1,
        duration: 10000 + carIndex * 500,
        useNativeDriver: false,
      }).start();
    });

    followLeadingCar();
  };

  const followLeadingCar = () => {
    const leadingCar = carAnimations[0];

    leadingCar.addListener(({ value }) => {
      const carX = interpolateValue(value, raceLine, 'x');
      const carY = interpolateValue(value, raceLine, 'y');

      backgroundOffset.x.setValue(screenWidth / 2 - carX);
      backgroundOffset.y.setValue(screenHeight / 2 - carY);
    });
  };

  const interpolateValue = (value: number, line: { x: number; y: number }[], axis: 'x' | 'y') => {
    const startIndex = Math.floor(value);
    const endIndex = Math.ceil(value);
    const progress = value - startIndex;

    const startValue = line[startIndex][axis];
    const endValue = line[endIndex][axis];

    return startValue + (endValue - startValue) * progress;
  };

  const calculateAngle = (current: { x: number; y: number }, next: { x: number; y: number }) => {
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    return Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
  };

  const renderRaceScreen = () => {
    return (
      <Animated.View
        style={[
          styles.trackContainer,
          {
            transform: [
              { translateX: backgroundOffset.x },
              { translateY: backgroundOffset.y },
            ],
          },
        ]}
      >
        <ImageBackground
          source={require('../assets/images/car-track.png')}
          style={{
            width: trackWidth,
            height: trackHeight,
          }}
        >
          {raceLine.map((point, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.redDot,
                {
                  left: point.x - 5,
                  top: point.y - 5,
                },
              ]}
            />
          ))}

          {carImages.map((carImage, index) => {
            const carAnimationX = carAnimations[index]?.interpolate({
              inputRange: raceLine.map((_, i) => i),
              outputRange: raceLine.map((point) => point.x - 12.5),
            });

            const carAnimationY = carAnimations[index]?.interpolate({
              inputRange: raceLine.map((_, i) => i),
              outputRange: raceLine.map((point) => point.y - 12.5),
            });

            const carRotation = carAnimations[index]?.interpolate({
              inputRange: raceLine.map((_, i) => i),
              outputRange: raceLine.map((_, i) => {
                if (i === raceLine.length - 1) return 0; // No rotation at the last point
                const current = raceLine[i];
                const next = raceLine[i + 1];
                return calculateAngle(current, next);
              }),
            });

            return (
              <Animated.View
                key={`car-${index}`}
                style={[
                  styles.carContainer,
                  {
                    transform: [
                      { translateX: carAnimationX || 0 },
                      { translateY: carAnimationY || 0 },
                      { rotate: carRotation?.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) || '0deg' },
                    ],
                  },
                ]}
              >
                <Image source={carImage} style={styles.carImage} />
              </Animated.View>
            );
          })}
        </ImageBackground>
      </Animated.View>
    );
  };

  return isRacing ? (
    <View style={styles.container}>
      {renderRaceScreen()}
      <Button title="Go Back" onPress={() => setIsRacing(false)} />
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Car Race</Text>
      <Button title="Start Løp" onPress={() => { setIsRacing(true); startRace(); }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AECD48',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  trackContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  carContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  redDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    zIndex: -1,
  },
});

export default CarRace;
