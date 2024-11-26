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
  Easing,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CarRace: React.FC = () => {
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [selectedLaps, setSelectedLaps] = useState<number>(1);
  const [countdown, setCountdown] = useState<number | null>(null);
  const carAnimations = useRef<Animated.Value[]>([]).current;
  const backgroundOffset = useRef({ x: new Animated.Value(0), y: new Animated.Value(0) }).current;

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const trackWidth = 800;
  const trackHeight = 534;

  const carSpeed = 0.2; // Speed constant (lower value = slower)

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
  ];

  const finishLine = { x: 330, y: 451 };

  const generateCompleteRaceLine = (laps: number) => {
    const completeLine = [];
    for (let i = 0; i < laps; i++) {
      completeLine.push(...raceLine);
    }
    completeLine.push(finishLine);
    return completeLine;
  };

  const [completeRaceLine, setCompleteRaceLine] = useState(generateCompleteRaceLine(selectedLaps));

  const carImages = [
    require('../assets/images/car-red.png'),
    require('../assets/images/car-blue.png'),
    require('../assets/images/car-orange.png'),
    require('../assets/images/car-green.png'),
  ];

  const carNames = ['Rød', 'Blå', 'Ginger[Mostue]', 'Grønn'];

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

  useEffect(() => {
    setCompleteRaceLine(generateCompleteRaceLine(selectedLaps));
  }, [selectedLaps]);

  const resetAnimations = () => {
    carAnimations.forEach((animValue) => animValue.setValue(0));
    setWinner(null);
  };

  const startCountdown = () => {
    setCountdown(3); // Start countdown at 3
    let currentCount = 3;

    const interval = setInterval(() => {
      currentCount -= 1;
      setCountdown(currentCount);

      if (currentCount === 0) {
        clearInterval(interval);
        setCountdown(null); // Hide countdown
        startRace(); // Start the race after countdown
      }
    }, 1000);
  };

  const calculateDistance = (pointA: { x: number; y: number }, pointB: { x: number; y: number }) => {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateCumulativeDistances = (line: { x: number; y: number }[]) => {
    const distances = [0];
    for (let i = 1; i < line.length; i++) {
      const distance = calculateDistance(line[i - 1], line[i]);
      distances.push(distances[i - 1] + distance);
    }
    return distances;
  };

  let cumulativeDistances: number[] = calculateCumulativeDistances(completeRaceLine);

  useEffect(() => {
    cumulativeDistances = calculateCumulativeDistances(completeRaceLine);
  }, [completeRaceLine]);

  const interpolateRotation = (
    progress: number,
    distances: number[],
    line: { x: number; y: number }[]
  ) => {
    let startIndex = 0;
    while (progress > distances[startIndex + 1] && startIndex < distances.length - 2) {
      startIndex++;
    }

    const startPoint = line[startIndex];
    const endPoint = line[startIndex + 1];

    // Calculate the current angle
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
    if (startIndex > 0) {
      // Calculate the previous angle
      const prevPoint = line[startIndex - 1];
      const prevDx = startPoint.x - prevPoint.x;
      const prevDy = startPoint.y - prevPoint.y;
      const prevAngle = Math.atan2(prevDy, prevDx) * (180 / Math.PI);

      // Calculate the angular difference directly without constraining
      let deltaAngle = angle - prevAngle;

      // Adjust the current angle based on the delta
      angle = prevAngle + deltaAngle;
    }

    return angle; // Return the unconstrained angle
  };

  const startRace = () => {
    resetAnimations();

    const carTotalDurations = [0, 0, 0, 0];

    const animationsBySegment = completeRaceLine.slice(1).map((_, index) => {
      // Recalculate the leading and trailing cars dynamically at each segment
      const minDuration = Math.min(...carTotalDurations);
      const maxDuration = Math.max(...carTotalDurations);

      return carAnimations.map((animValue, carIndex) => {
        const isTrailingCar = carTotalDurations[carIndex] === minDuration;
        const isLeadingCar = carTotalDurations[carIndex] === maxDuration;

        let randomSpeedModifier;
        if (isTrailingCar) {
          randomSpeedModifier = Math.random() * 0.05; // Random value between 0 and 0.05 for the car with the lowest total duration
        } else if (isLeadingCar) {
          randomSpeedModifier = Math.random() * 0.08 - 0.05; // Random value between -0.05 and 0.03 for the leading car
        } else {
          randomSpeedModifier = Math.random() * 0.08 - 0.04; // Random value between -0.04 and 0.04 for other cars
        }

        if (randomSpeedModifier === 0) {
          randomSpeedModifier = carSpeed + Math.random() * 0.08 - 0.04; // Use default speed if the modifier is 0
        }

        const distance = cumulativeDistances[index + 1] - cumulativeDistances[index];
        const duration = distance / (carSpeed + randomSpeedModifier);
        carTotalDurations[carIndex] += duration;

        return Animated.timing(animValue, {
          toValue: cumulativeDistances[index + 1],
          duration,
          easing: Easing.linear,
          useNativeDriver: false,
        });
      });
    });

    carAnimations.forEach((_, carIndex) => {
      const carAnimationsSequence = animationsBySegment.map((segment) => segment[carIndex]);
      Animated.sequence(carAnimationsSequence).start(({ finished }) => {
        if (finished) {
          setWinner((prevWinner) =>
            prevWinner === null ? carNames[carIndex] : prevWinner
          );
        }
      });
    });

    followLeadingCar(carTotalDurations);
  };

  const followLeadingCar = (carTotalDurations: number[]) => {
    let leadingCarIndex = carTotalDurations.indexOf(Math.min(...carTotalDurations));

    carAnimations.forEach((animValue, carIndex) => {
      animValue.addListener(({ value }) => {
        const currentLeadingCarIndex = carTotalDurations.indexOf(Math.min(...carTotalDurations));
        if (currentLeadingCarIndex !== leadingCarIndex) {
          leadingCarIndex = currentLeadingCarIndex;
        }

        if (carIndex === leadingCarIndex) {
          const interpolatedPosition = interpolatePosition(value, cumulativeDistances, completeRaceLine);
          backgroundOffset.x.setValue(screenWidth / 2 - interpolatedPosition.x);
          backgroundOffset.y.setValue(screenHeight / 2 - interpolatedPosition.y);
        }
      });
    });
  };

  const interpolatePosition = (
    progress: number,
    distances: number[],
    line: { x: number; y: number }[]
  ) => {
    let startIndex = 0;
    while (progress > distances[startIndex + 1] && startIndex < distances.length - 2) {
      startIndex++;
    }

    const startPoint = line[startIndex];
    const endPoint = line[startIndex + 1];
    const segmentProgress =
      (progress - distances[startIndex]) /
      (distances[startIndex + 1] - distances[startIndex]);

    return {
      x: startPoint.x + (endPoint.x - startPoint.x) * segmentProgress,
      y: startPoint.y + (endPoint.y - startPoint.y) * segmentProgress,
    };
  };

  const renderCountdown = () => {
    if (countdown === null) return null;

    return (
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>{countdown}</Text>
      </View>
    );
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
          {completeRaceLine.map((point, index) => (
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
            const carWidth = 50;
            const carHeight = 50;

            const carAnimationX = carAnimations[index]?.interpolate({
              inputRange: cumulativeDistances,
              outputRange: completeRaceLine.map((point) => point.x - carWidth / 2),
            });

            const carAnimationY = carAnimations[index]?.interpolate({
              inputRange: cumulativeDistances,
              outputRange: completeRaceLine.map((point) => point.y - carHeight / 2),
            });

            const carRotation = carAnimations[index]?.interpolate({
              inputRange: cumulativeDistances,
              outputRange: cumulativeDistances.map((_, i) => {
                if (i === cumulativeDistances.length - 1) return 0; // No rotation at the final point
                return interpolateRotation(
                  cumulativeDistances[i],
                  cumulativeDistances,
                  completeRaceLine
                );
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
                      {
                        rotate: carRotation?.interpolate({
                          inputRange: [-180, 180],
                          outputRange: ['-180deg', '180deg'],
                        }) || '0deg',
                      },
                    ],
                  },
                ]}
              >
                <Image
                  source={carImage}
                  style={[styles.carImage, { width: carWidth, height: carHeight, transform: [{rotate: '-90deg'}]}]}
                />
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
      {renderCountdown()}
      {winner && (
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>{winner} vant!</Text>
        </View>
      )}
      <View style={styles.backButtonContainer}>
        <Button title="Tilbake" onPress={() => setIsRacing(false)} />
      </View>
    </View>
  ) : (
    <ImageBackground
      source={require('../assets/images/background-car-race.png')}
      style={[styles.container, { height: screenHeight }]}
    >
      <Picker
        selectedValue={selectedLaps}
        onValueChange={(itemValue: number) => setSelectedLaps(itemValue)}
        style={styles.lapPicker}
      >
        <Picker.Item label="1 Lap" value={1} />
        <Picker.Item label="5 Laps" value={5} />
        <Picker.Item label="10 Laps" value={10} />
      </Picker>
      <View style={styles.backButtonContainer}>
        <Button title="Start Løp" onPress={() => { setIsRacing(true); startCountdown(); setWinner(null); }} />
      </View>
    </ImageBackground>
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
    visibility: 'hidden',
  },
  countdownContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
 
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '80%',
  },
  winnerContainer: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  winnerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  lapPicker: {
    position: 'absolute',
    top: 50,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default CarRace;

