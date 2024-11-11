// HomeScreen.tsx
import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AddPlayerInput from '../../components/AddPlayerInput'; // Corrected import path
import { PlayersProvider, usePlayers } from '../../components/PlayersContext';

const screenWidth = Dimensions.get('window').width;
const imageAspectRatio = 290 / 178;

const PlayerList: React.FC = () => {
  const { players } = usePlayers();

  return (
    <FlatList
      data={players}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <Text style={styles.playerText}>{item}</Text>}
    />
  );
};

export default function HomeScreen() {
  return (
    <PlayersProvider>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/man-drinking-water-out-of-a-bottle.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Tyste Karer!</ThemedText>
        </ThemedView>
        <AddPlayerInput />
        <PlayerList />
        <TouchableOpacity
          onPress={() => ""} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>{"Start spillet"}</Text>
        </TouchableOpacity>
      </ParallaxScrollView>
    </PlayersProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
  }
});
