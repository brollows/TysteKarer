import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Text, Image, ScrollView, View, StatusBar, Animated } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AddPlayerInput from '../../components/AddPlayerInput';
import { usePlayers } from '../../components/PlayersContext';
import { drinkingCards, formatDrinkingTask, getDrinkingCard } from '../../components/DrinkingCards';
import { useSettings } from '@/components/SettingsContext';
import HorseRace from '@/components/HorseRace';

const screenWidth = Dimensions.get('window').width;
const imageAspectRatio = 290 / 178;
const cardMargin = 20;


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
  const { brorenMinBoolean, fuckYouBoolean, horseRaceBoolean } = useSettings();

  const shuffleArrayWithZeroSeparation = (array: any[]): any[] => {
    const zeros = array.filter((item) => item === 0);
    const nonZeros = array.filter((item) => item !== 0);
    const shuffledNonZeros = nonZeros.sort(() => Math.random() - 0.5);
    const result: any[] = [];
    let zeroIndex = 0;
    let addHorseRace = false;

    for (let i = 0; i < shuffledNonZeros.length; i++) {
      if (zeroIndex < zeros.length && result.length >= 3 * (zeroIndex + 1) && Math.random() < 0.5) {
        result.push(0);
        zeroIndex++;
      }

      if (horseRaceBoolean && !addHorseRace && Math.random() < 0.1) { // 10% chance to insert -1
        result.push(-1);
        addHorseRace = true;
      }

      result.push(shuffledNonZeros[i]);
    }
    if (horseRaceBoolean && !addHorseRace) {
      result.push(-1)
    }

    return result;
  };

  const generateRandomOrder = (): number[] => {
    const cardNumbers = drinkingCards
      .filter((card) => card.cardNumber !== 0)
      .map((card) => card.cardNumber);

    const shuffledCardNumbers = shuffleArrayWithZeroSeparation(cardNumbers);

    if (brorenMinBoolean) {
      const maxZeros = Math.floor(cardNumbers.length / 4);
      const numberOfZeros = Math.max(1, Math.floor(Math.random() * maxZeros) + 1);

      for (let i = 0; i < numberOfZeros; i++) {
        shuffledCardNumbers.push(0);
      }
      let tempShuffleArrayWithZeroSeparation = shuffleArrayWithZeroSeparation(shuffledCardNumbers);
      console.log(tempShuffleArrayWithZeroSeparation)
      return tempShuffleArrayWithZeroSeparation;
    }

    return shuffledCardNumbers;
  };

  const generatePlayerOrder = (length: number): string[] => {
    return Array.from({ length }, () =>
      players.length > 0 ? players[Math.floor(Math.random() * players.length)] : 'No Players'
    );
  };

  const generateApplyOnCard = (length: number): boolean[] => {
    return Array.from({ length }, () => Math.random() > 0.5);
  };

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

  const startGameHorseRaceOnly = () => {
    const newCardOrder = [-1];
    const newPlayerOrder = generatePlayerOrder(newCardOrder.length);
    const newApplyOnCard = generateApplyOnCard(newCardOrder.length);
    setCardOrder(newCardOrder);
    setPlayerOrder(newPlayerOrder);
    setApplyOnCard(newApplyOnCard);
    setCurrentIndex(0);
    setIsEndScreen(false);
    setIsPlaying(true);
  };

  const card = getDrinkingCard(cardOrder[currentIndex]);
  const playerName = playerOrder[currentIndex];
  const shouldApplyFuckYou = fuckYouBoolean && applyOnCard[currentIndex];
  let currentCardText = '';

  function fixedDrinkingAmount(drinkingAmount: number) {
    if (shouldApplyFuckYou) {
      drinkingAmount = drinkingAmount * 3;
    }
    return drinkingAmount;
  }

  if (card) {
    currentCardText = formatDrinkingTask(card, playerName, fixedDrinkingAmount(card.drinkingAmount)) || '';
  }

  const goToPreviousCard = () => {
    if (isEndScreen) {
      setIsEndScreen(false);
    } else {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const goToNextCard = () => {
    if (currentIndex < cardOrder.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsEndScreen(true);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setCardOrder([]);
    setPlayerOrder([]);
    setApplyOnCard([]);
    setCurrentIndex(0);
  };

  const handleCardPress = (event: any) => {
    const touchX = event.nativeEvent.locationX;
    if (touchX < screenWidth / 2) {
      goToPreviousCard();
    } else {
      goToNextCard();
    }
  };

  return (
    <>
      <StatusBar hidden={true} />
      {isPlaying ? (
        //HorseRace when currentIndex == 1
        cardOrder[currentIndex] === -1 ? (
        
          <View style={styles.gameScreen}>
          <Text style={styles.cardCounter}>
            {cardOrder.length > 0 ? `${currentIndex + 1} / ${cardOrder.length}` : ''}
          </Text>
          
          <HorseRace />
          
          <TouchableOpacity onPress={endGame} style={styles.topRightButton}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        </View>        
        ) :
        isEndScreen ? (
          <View style={styles.gameScreen}>
            <Text style={styles.gameText}>Spillet er slutt, men har du hvilepuls?</Text>
            <TouchableOpacity onPress={endGame} style={styles.endGameButton}>
              <Text style={styles.buttonText}>Avslutt spill</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gameScreen}>
            <Text style={styles.cardCounter}>
              {cardOrder.length > 0 ? `${currentIndex + 1} / ${cardOrder.length}` : ''}
            </Text>
            <TouchableOpacity style={styles.cardTouchableArea} onPress={handleCardPress}>
              <View style={styles.cardContainer}>
                <Text style={styles.cardHeader}>{card?.header || 'No Header'}</Text>
                <View style={styles.cardDivider} />
                <Text style={styles.cardText}>{currentCardText}</Text>
              </View>
            </TouchableOpacity>
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
          <TouchableOpacity onPress={startGameHorseRaceOnly} style={styles.horceRaceButton}>
            <Text style={styles.buttonText}>Horse Race</Text>
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
  horceRaceButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'lightblue',
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
    zIndex: 99,
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
  cardCounter: {
    position: 'absolute',
    top: 15,
    left: 25,
    color: '#d3d3d3', // Light grey color
    fontSize: 18,
    fontWeight: 'bold',
    zIndex: 99,
  },
  endGameButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'red',
    alignItems: 'center',
    marginTop: 20,
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
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#004d40',
  },
  gameScreen: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5',
  },
  cardTouchableArea: {
    width: screenWidth - 2 * cardMargin,
    marginHorizontal: cardMargin,
  },
  cardContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#e0f7fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: screenWidth - 2 * cardMargin,
    alignSelf: 'center', 
  },
  horseRaceScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  horseRaceText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  horseContainer: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  horseName: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
    width: 100,
  },
  horse: {
    width: 20,
    height: 20,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    position: 'absolute',
    left: 120,
  },
  startButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'green',
  },
  winnerText: {
    fontSize: 24,
    color: 'yellow',
    fontWeight: 'bold',
    marginTop: 20,
  },
});
