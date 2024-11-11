import { Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const screenWidth = Dimensions.get('window').width;
const imageAspectRatio = 290 / 178; 

export default function HomeScreen() {
  return (
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
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Er gutta klare for å bli drita?</ThemedText>
        <ThemedText>
          Det er kun <ThemedText type="defaultSemiBold">EN</ThemedText> ting man trenger for dette spillet. 
          {'\n'}
          <ThemedText type="defaultSemiBold">DRIKKE!</ThemedText>{' '}
        </ThemedText>
      </ThemedView>
      <TouchableOpacity
          onPress={() => ""} 
          style={[
            styles.button
          ]}
        >
          <Text style={styles.buttonText}>
            {"Start spillet"}
          </Text>
        </TouchableOpacity>
    </ParallaxScrollView>
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
  }
});
