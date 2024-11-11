// AddPlayerInput.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { usePlayers } from './PlayersContext';

const AddPlayerInput: React.FC = () => {
  const [newPlayer, setNewPlayer] = useState('');
  const { addPlayer } = usePlayers();

  const handleAddPlayer = () => {
    if (newPlayer.trim()) {
      addPlayer(newPlayer);
      setNewPlayer(''); // Clear input field
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add Player"
        value={newPlayer}
        onChangeText={setNewPlayer}
      />
      <Button title="Add Player" onPress={handleAddPlayer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
});

export default AddPlayerInput;
