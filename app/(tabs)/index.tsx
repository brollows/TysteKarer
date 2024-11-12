import React, { useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Text, Image, ScrollView, View, StatusBar } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AddPlayerInput from '../../components/AddPlayerInput';
import { usePlayers } from '../../components/PlayersContext';
import { drinkingCards, formatDrinkingTask, getDrinkingCard } from '../../components/DrinkingCards';
import { useSettings } from '@/components/SettingsContext';

const screenWidth = Dimensions.get('window').width;
const imageAspectRatio = 290 / 178;

const PlayerList: React.FC = () => {
  const { players } = usePlayers();

  return (
    <ScrollView>
      {players.map((player, index) => (
        <Text key={index} style={styles.playerText}>
          {player || 'Unnamed Player'}
        </Text>
      ))}
    </ScrollView>
  );
};
export default function HomeScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [applyOnCard, setApplyOnCard] = useState<boolean[]>([]);
  const [isEndScreen, setIsEndScreen] = useState(false);
  const { players } = usePlayers();
  const { brorenMinBoolean, fuckYouBoolean } = useSettings();

  // Function to shuffle an array
  const shuffleArray = (array: any[]): any[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Generate a random order of card numbers (excluding cardNumber 0)
  const generateRandomOrder = (): number[] => {
    const cardNumbers = drinkingCards
      .filter((card) => card.cardNumber !== 0)
      .map((card) => card.cardNumber);
  
    // Shuffle the card numbers
    const shuffledCardNumbers = shuffleArray(cardNumbers);
  
    // If brorenMinBoolean is enabled, include a random number of '0's
    if (brorenMinBoolean) {
      const maxZeros = Math.floor(cardNumbers.length / 4);
      const numberOfZeros = Math.max(1, Math.floor(Math.random() * maxZeros) + 1);
  
      // Add '0's to the shuffled card numbers
      for (let i = 0; i < numberOfZeros; i++) {
        shuffledCardNumbers.push(0);
      }
  
      // Shuffle the array again to mix in the '0's
      return shuffleArray(shuffledCardNumbers);
    }
  
    // Return the shuffled card numbers without '0's if brorenMinBoolean is not enabled
    return shuffledCardNumbers;
  };

  // Generate a list of random player names of the same length as cardOrder
  const generatePlayerOrder = (length: number): string[] => {
    return Array.from({ length }, () =>
      players.length > 0 ? players[Math.floor(Math.random() * players.length)] : 'No Players'
    );
  };

  // Generate a list of random boolean values for "Fuck You" rule application
  const generateApplyOnCard = (length: number): boolean[] => {
    return Array.from({ length }, () => Math.random() > 0.5);
  };

  // Function to start the game and generate a new random order
  const startGame = () => {
    const newCardOrder = generateRandomOrder();
    const newPlayerOrder = generatePlayerOrder(newCardOrder.length);
    const newApplyOnCard = generateApplyOnCard(newCardOrder.length);
    setCardOrder(newCardOrder);
    setPlayerOrder(newPlayerOrder);
    setApplyOnCard(newApplyOnCard);
    setCurrentIndex(0);
    setIsEndScreen(false);
    setIsPlaying(true);
  };

  // Get the current card and player based on the current index
  const card = getDrinkingCard(cardOrder[currentIndex]);
  const playerName = playerOrder[currentIndex];
  const shouldApplyFuckYou = fuckYouBoolean && applyOnCard[currentIndex];
  let currentCardText = '';

  // Function to adjust drinking amount based on the "Fuck You" rule
  function fixedDrinkingAmount(drinkingAmount: number) {
    if (shouldApplyFuckYou) {
      drinkingAmount = drinkingAmount * 5; // Increase the drinking amount
    }
    return drinkingAmount;
  }

  if (card) {
    currentCardText = formatDrinkingTask(card, playerName, fixedDrinkingAmount(card.drinkingAmount)) || '';
  }

  // Function to go to the previous card
  const goToPreviousCard = () => {
    if (isEndScreen) {
      setIsEndScreen(false);
    } else {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  // Function to go to the next card
  const goToNextCard = () => {
    if (currentIndex < cardOrder.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsEndScreen(true);
    }
  };

  // Function to end the game
  const endGame = () => {
    setIsPlaying(false);
    setCardOrder([]);
    setPlayerOrder([]);
    setApplyOnCard([]);
    setCurrentIndex(0);
  };

  return (
    <>
      <StatusBar hidden={true} />
      {isPlaying ? (
        isEndScreen ? (
          <View style={styles.gameScreen}>
            <Text style={styles.gameText}>End of the Game!</Text>
            <TouchableOpacity onPress={endGame} style={styles.endGameButton}>
              <Text style={styles.buttonText}>End Game</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowButton} onPress={goToPreviousCard}>
              <Text style={styles.arrowText}>←</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gameScreen}>
            <Text style={styles.cardCounter}>
              {cardOrder.length > 0 ? `${currentIndex + 1} / ${cardOrder.length}` : ''}
            </Text>

            {currentCardText ? (
              <View style={styles.cardNavigationContainer}>
                {currentIndex > 0 && (
                  <TouchableOpacity style={styles.arrowButton} onPress={goToPreviousCard}>
                    <Text style={styles.arrowText}>←</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.cardContainer}>
                  <Text style={styles.cardHeader}>{card?.header || 'No Header'}</Text>
                  <View style={styles.cardDivider} />
                  <Text style={styles.cardText}>{currentCardText}</Text>
                </View>

                {currentIndex < cardOrder.length - 1 && (
                  <TouchableOpacity style={styles.arrowButton} onPress={goToNextCard}>
                    <Text style={styles.arrowText}>→</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.gameText}>Card or player not found.</Text>
            )}
            <TouchableOpacity onPress={endGame} style={styles.topRightButton}>
              <Text style={styles.buttonText}>X</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
          headerImage={
            <Image
              source={require('@/assets/images/man-drinking-water-out-of-a-bottle.png')}
              style={styles.reactLogo}
            />
          }
        >
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Tyste Karer!</ThemedText>
          </ThemedView>
          <AddPlayerInput />
          <PlayerList />
          <TouchableOpacity onPress={startGame} style={styles.button}>
            <Text style={styles.buttonText}>Start spillet</Text>
          </TouchableOpacity>
        </ParallaxScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactLogo: {
    width: screenWidth,
    height: screenWidth / imageAspectRatio + 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  playerText: {
    fontSize: 16,
    paddingVertical: 4,
    color: 'white',
  },
  gameScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  gameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  topRightButton: {
    position: 'absolute',
    top: 10,
    right: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'grey',
    alignItems: 'center',
  },
  cardNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  arrowButton: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 30,
    color: '#00796b',
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#e0f7fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00796b',
    marginBottom: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#00796b',
    marginVertical: 10,
    opacity: 0.6,
  },
  cardText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    color: '#004d40',
    marginVertical: 10,
  },
  cardCounter: {
    position: 'absolute',
    top: 15,
    left: 25,
    color: '#d3d3d3', // Light grey color
    fontSize: 18,
    fontWeight: 'bold',
  },
  endGameButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'red',
    alignItems: 'center',
    marginTop: 20,
  },  
});
