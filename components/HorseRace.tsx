import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


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

  const startRace = () => {
    setHorsePositions({ Clover: 0, Heart: 0, Spades: 0, Diamonds: 0 });
    setWinner(null);
    setIsRacing(true);
  };

  useEffect(() => {
    if (!isRacing || winner) return;

    const raceInterval = setInterval(() => {
      setHorsePositions((prevPositions) => {
        const updatedPositions: Record<HorseName, number> = { ...prevPositions };

        (Object.keys(updatedPositions) as HorseName[]).forEach((horseName) => {
          const increment = Math.floor(Math.random() * 10);
          updatedPositions[horseName] += increment;

          if (updatedPositions[horseName] >= 100 && !winner) {
            setWinner(horseName);
            setIsRacing(false);
          }
        });

        return updatedPositions;
      });
    }, 100);

    return () => clearInterval(raceInterval);
  }, [isRacing, winner]);

  return (
    <View style={styles.horseRaceScreen}>
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
          {(Object.keys(horsePositions) as HorseName[]).map((horseName) => (
            <View key={horseName} style={styles.horseWrapper}>
              <Text style={styles.horseName}>{horseName}</Text>
              
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  horseRaceScreen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  horseRaceText: {
    fontSize: 32,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  horsesContainer: {
    flexDirection: 'column',
    width: '80%',
    marginTop: 20,
  },
  horseWrapper: {
    marginBottom: 20,
  },
  horseName: {
    color: '#333',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  horseSlider: {
    width: '100%',
    height: 40,
  },
  startButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -20 }],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'green',
    zIndex: 1,
    alignItems: 'center',
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
