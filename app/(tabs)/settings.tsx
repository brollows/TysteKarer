import { StyleSheet, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import React from 'react';
import { useSettings } from '@/components/SettingsContext';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const screenWidth = Dimensions.get('window').width;
const imageAspectRatio = 290 / 178;

export default function TabTwoScreen() {
  const { brorenMinBoolean, setBrorenMinBoolean, fuckYouBoolean, setFuckYouBoolean } = useSettings();

  // Function to toggle "Broren Min" setting
  const handleToggleBrorenMin = () => {
    setBrorenMinBoolean(!brorenMinBoolean);
  };

  // Function to toggle "Fuck You" setting
  const handleToggleFuckYou = () => {
    setFuckYouBoolean(!fuckYouBoolean);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('../../assets/images/skibbedi_ole.png')}
          style={styles.skibbediOle}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Innstillinger</ThemedText>
      </ThemedView>
      <ThemedText>Her kan du sette drikkenivået og skru av og på morsomme regler.</ThemedText>

      <Collapsible title="BROREN MIN!">
        <ThemedText>
          Hvis{' '}
          <ThemedText type="defaultSemiBold">BROREN MIN</ThemedText>{' '}
          er aktivert, så vil regelmessig en felles skål være påbudt!
        </ThemedText>
        <TouchableOpacity
          onPress={handleToggleBrorenMin}
          style={[styles.button, brorenMinBoolean ? styles.buttonActive : styles.buttonInactive]}
        >
          <Text style={styles.buttonText}>
            {brorenMinBoolean ? "Aktivert" : "Ikke aktivert"}
          </Text>
        </TouchableOpacity>
      </Collapsible>

      <Collapsible title="Fuck you regelen">
        <ThemedText>
          Hvis{' '}
          <ThemedText type="defaultSemiBold">fuck you regelen</ThemedText>{' '}
          er aktivert, så er det en sjans at straffeslurkene dobbler seg!
        </ThemedText>
        <TouchableOpacity
          onPress={handleToggleFuckYou}
          style={[styles.button, fuckYouBoolean ? styles.buttonActive : styles.buttonInactive]}
        >
          <Text style={styles.buttonText}>
            {fuckYouBoolean ? "Aktivert" : "Ikke aktivert"}
          </Text>
        </TouchableOpacity>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonActive: {
    backgroundColor: 'green',
  },
  buttonInactive: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  skibbediOle: {
    width: screenWidth,
    height: screenWidth / imageAspectRatio + 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
