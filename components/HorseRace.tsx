import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from 'react-native';

// Screen dimensions
const { width, height } = Dimensions.get('window');

type HorseName = 'Clover' | 'Heart' | 'Spades' | 'Diamonds';

const HorseRace: React.FC = () => {
  const [horsePositions, setHorsePositions] = useState<Record<HorseName, number>>({
    Clover: 0,
    Heart: 0,
    Spades: 0,
    Diamonds: 0,
  });

  const [winner, setWinner] = useState<HorseName | null>(null);
  const [isRacing, setIsRacing] = useState(false);

  const backgroundPosition = useRef(new Animated.Value(0)).current;

  const raceDuration = 25000;

  const startRace = () => {
    setHorsePositions({ Clover: 0, Heart: 0, Spades: 0, Diamonds: 0 });
    setWinner(null);
    setIsRacing(true);

    // Start background scrolling animation
    Animated.timing(backgroundPosition, {
      toValue: -height,
      duration: raceDuration,
      useNativeDriver: true,
    }).start();

    // Stop race after the defined duration
    setTimeout(() => {
      setIsRacing(false);
      determineWinner();
    }, raceDuration);
  };

  const determineWinner = () => {
    const leadingHorse = Object.keys(horsePositions).reduce<HorseName>(
      (prev, curr) =>
        horsePositions[curr as HorseName] > horsePositions[prev] ? (curr as HorseName) : prev,
      'Clover'
    );
    setWinner(leadingHorse);
  };

  useEffect(() => {
    if (!isRacing) return;

    const raceInterval = setInterval(() => {
      setHorsePositions((prevPositions) => {
        const updatedPositions: Record<HorseName, number> = { ...prevPositions };

        (Object.keys(updatedPositions) as HorseName[]).forEach((horseName) => {
          const increment = Math.floor(Math.random() * 5);
          updatedPositions[horseName] += increment;
        });

        return updatedPositions;
      });
    }, 100);

    return () => clearInterval(raceInterval);
  }, [isRacing]);

  return (
    <View style={styles.horseRaceScreen}>
      <Animated.Image
        source={require('@/assets/images/car-track.png')} // Replace with your background image
        style={[
          styles.background,
          {
            transform: [{ translateY: backgroundPosition }],
          },
        ]}
        resizeMode="cover"
      />
      {!isRacing && (
        <TouchableOpacity onPress={startRace} style={styles.startButton}>
          <Text style={styles.buttonText}>Start Race</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.horseRaceText}>Horse Race</Text>
      {winner ? (
        <Text style={styles.winnerText}>{`${winner} wins! 🏆`}</Text>
      ) : (
        <View style={styles.horsesContainer}>
          {(Object.keys(horsePositions) as HorseName[]).map((horseName, index) => (
            <Animated.View
              key={horseName}
              style={[
                styles.horse,
                {
                  left: width / 2 - 50 + index * 60, // Horizontal spacing between horses
                  bottom: horsePositions[horseName], // Update position dynamically
                },
              ]}
            >
              <Image
                source={require('@/assets/images/car-track.png')} // Replace with your horse sprite
                style={styles.horseImage}
              />
              <Text style={styles.horseName}>{horseName}</Text>
            </Animated.View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  horseRaceScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  horseRaceText: {
    fontSize: 32,
    color: '#333',
    fontWeight: 'bold',
    position: 'absolute',
    top: 20,
  },
  background: {
    position: 'absolute',
    width,
    height: height * 2, // Extend the background for continuous scrolling
    top: 0,
  },
  horsesContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  horse: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
  },
  horseImage: {
    width: 40,
    height: 40,
  },
  horseName: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  startButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'green',
    position: 'absolute',
    zIndex: 1,
    bottom: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  winnerText: {
    fontSize: 24,
    color: '#00796b',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default HorseRace;
