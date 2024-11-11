import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TouchableOpacity, Text, Dimensions } from 'react-native';

import React, { useState } from 'react'; // Import useState hook

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const screenWidth = Dimensions.get('window').width;
const imageAspectRatio = 290 / 178; 

export default function TabTwoScreen() {
  const [brorenMinBoolean, setBrorenMinBoolean] = useState(false);
  const [fuckYouBoolean, setFuckYouBoolean] = useState(false);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Image
        source={require('@/assets/images/skibbedi_ole.png')}
        style={styles.skibbediOle}
      />}>
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
          onPress={() => setBrorenMinBoolean(!brorenMinBoolean)} 
          style={[
            styles.button,
            brorenMinBoolean ? styles.buttonActive : styles.buttonInactive,
          ]}
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
          er aktivert, så er det en sjangs at straffeslurkene dobbler seg!
        </ThemedText>
        <TouchableOpacity
          onPress={() => setFuckYouBoolean(!fuckYouBoolean)}
          style={[
            styles.button,
            fuckYouBoolean ? styles.buttonActive : styles.buttonInactive,
          ]}
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
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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
