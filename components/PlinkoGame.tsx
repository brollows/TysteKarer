import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Animated } from 'react-native';

interface BallPosition {
  x: number | null;
  y: Animated.Value;
}

const bucketColors = [
  '#FF3B30', // 33x
  '#FF9500', // 11x
  '#FFCC00', // 8x
  '#FFDD00', // 4x
  '#FFE500', // 2x
  '#FFE700', // 2x
  '#FFE700', // 1x
  '#FFE700', // 1x
  '#FFE700', // 2x
  '#FFE500', // 2x
  '#FFDD00', // 4x
  '#FFCC00', // 8x
  '#FF9500', // 11x
  '#FF3B30', // 33x
];

const PlinkoGame: React.FC = () => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const boardWidth = screenWidth;
    const boardHeight = screenHeight * 0.6; // Use 60% of the screen height
    const bucketDrinks = [33, 11, 8, 4, 2, 2, 1, 1, 2, 2, 4, 8, 11, 33]; // Drink values
    const numRows = bucketDrinks.length;
    const numColumns = numRows + 1;
  
    const pegSize = boardWidth / numColumns; // Dynamically scale peg size
    const bucketHeight = boardHeight * 0.07; // Bucket height as 7% of the board height
  
    const [ballPosition, setBallPosition] = useState<BallPosition>({
      x: null,
      y: new Animated.Value(0),
    });
    const [selectedBucket, setSelectedBucket] = useState<number | null>(null);
    const [bucketScales] = useState(() =>
      bucketDrinks.map(() => new Animated.Value(1))
    ); // Initial scale of 1 for each bucket
    const [ballDropping, setBallDropping] = useState<boolean>(false); // Track if the ball is dropping
  
    const generatePegs = () => {
      const pegs = [];
      for (let row = 2; row < numRows; row++) {
        // Start from row 2
        const rowWidth = (row + 1) * pegSize; // Total width of the current row based on peg size
        const rowOffset = (boardWidth - rowWidth) / 2; // Center the row within the board width
        for (let col = 0; col <= row; col++) {
          // Number of pegs in the current row
          pegs.push({
            row,
            col,
            x: rowOffset + 12 + col * pegSize, // Calculate horizontal position
            y: row * (boardHeight - bucketHeight) / numRows, // Calculate vertical position
          });
        }
      }
      return pegs;
    };
  
    const pegs = generatePegs();
  
    function randomFactor() {
      const random = Math.random() * 2 - 1; // Generates a number between -1 and 1
      const biased = Math.sign(random) * Math.pow(Math.abs(random), 2); // Bias towards 0
      return biased * 35;
    }
  
    const dropBall = () => {
        setBallDropping(true);
        const randomFactorValue: number = randomFactor();
        const startX = (boardWidth / 2 - pegSize / 4) + randomFactorValue; // Start at the center of the screen horizontally
        const startY = 0; // Start from the top of the screen
      
        setBallPosition({
          x: startX,
          y: new Animated.Value(startY),
        });
      
        let ballX = startX;
        const ballY = new Animated.Value(startY);
      
        // Ball movement variables
        let velocityX = 0; // Horizontal velocity
        let velocityY = 0; // Vertical velocity
        const gravity = 0.5; // Gravity that affects the downward acceleration
        let bounceFactor = -0.3; // Reduces bounce intensity (negative for upward velocity)
        const horizontalBounce = pegSize / 11; // Adjust horizontal bounce strength
        const maxVelocity = pegSize / 2; // Cap maximum velocity (to avoid flying off)
      
        const interval = 16; // 60 FPS
        let currentY = startY;
      
        const movement = setInterval(() => {
          // Apply gravity to vertical velocity
          velocityY += gravity;
          velocityY += 0.005;
      
          // Clamp velocities to avoid excessive speeds
          velocityX = Math.max(Math.min(velocityX, maxVelocity), -maxVelocity);
          velocityY = Math.max(Math.min(velocityY, maxVelocity), -maxVelocity);
      
          velocityX *= 0.96;
      
          // Update positions
          currentY += velocityY;
          ballX += velocityX;
      
          // Check for collision with pegs
          for (const peg of pegs) {
            const distance = Math.sqrt(
              Math.pow(ballX - peg.x, 2) + Math.pow(currentY - peg.y, 2)
            );
      
            // If the ball hits a peg
            if (distance < pegSize / 3) {
              // Bounce vertically upward with reduced velocity
              velocityY *= bounceFactor;
              bounceFactor += 0.03;
      
              // Adjust horizontal velocity based on collision direction
              if (ballX < peg.x) {
                velocityX = -horizontalBounce; // Bounce to the left
              } else {
                velocityX = horizontalBounce; // Bounce to the right
              }
              break; // Exit the loop after handling one collision
            }
          }
      
          // Stop animation when ball reaches the bottom
          if (currentY >= boardHeight - bucketHeight) {
            clearInterval(movement);
      
            // Handle edge cases for far left or far right
            let landedBucket = Math.floor((ballX / boardWidth) * numColumns);
            if (landedBucket < 0) {
              landedBucket = 0; // Far left bucket
            } else if (landedBucket >= bucketDrinks.length) {
              landedBucket = bucketDrinks.length - 1; // Far right bucket
            }
      
            setSelectedBucket(landedBucket);
            setBallDropping(false);
      
            // Animate bucket size
            Animated.sequence([
              Animated.timing(bucketScales[landedBucket], {
                toValue: 1.5, // Grow size
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(bucketScales[landedBucket], {
                toValue: 1, // Shrink back
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
      
            // Reset ball position for next drop
            setBallPosition({
              x: null,
              y: new Animated.Value(0),
            });
          }
      
          // Update ball position
          ballY.setValue(currentY);
          setBallPosition({
            x: ballX,
            y: ballY,
          });
        }, interval);
      };
      
  
    return (
      <View style={styles.container}>
        <View style={[styles.board, { width: boardWidth, height: boardHeight }]}>
          {/* Render pegs */}
          {pegs.map((peg, index) => (
            <View
              key={index}
              style={[
                styles.peg,
                {
                  width: pegSize / 5,
                  height: pegSize / 5,
                  left: peg.x,
                  top: peg.y,
                },
              ]}
            />
          ))}
          {/* Ball */}
          {ballDropping && ballPosition.x !== null && (
            <Animated.View
              style={[
                styles.ball,
                {
                  width: pegSize / 2,
                  height: pegSize / 2,
                  transform: [
                    { translateX: ballPosition.x },
                    { translateY: ballPosition.y },
                  ],
                },
              ]}
            />
          )}
  
          {/* Buckets */}
          <View style={[styles.bucketContainer, { height: bucketHeight }]}>
            {bucketDrinks.map((drink, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.bucket,
                  {
                    width: boardWidth / numColumns,
                    height: bucketHeight,
                    backgroundColor: bucketColors[index],
                    transform: [{ scale: bucketScales[index] }], // Scale animation
                  },
                ]}
              >
                <Text style={styles.bucketText}>{drink}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
  
        {/* Display result */}
        {selectedBucket !== null && (
          <View style={styles.resultContainer}>
            {!ballDropping ? (
              <Text style={styles.resultText}>
                Drikk {bucketDrinks[selectedBucket]} slurker!
              </Text>
            ) : (
              <Text style={styles.resultText}>--</Text>
            )}
          </View>
        )}
  
        {/* Drop ball button */}
        <TouchableOpacity style={styles.dropButton} onPress={dropBall}>
          <Text style={styles.dropButtonText}>Slipp ball</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001f3f',
  },
  board: {
    position: 'relative',
    backgroundColor: '#00274d',
    borderRadius: 10,
    overflow: 'hidden',
  },
  peg: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  ball: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#ff5722',
  },
  bucketContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  bucket: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1, // Small spacing between buckets
    borderRadius: 10, // Rounded edges for the buckets
    paddingVertical: 5,
  },
  bucketText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resultText: {
    fontSize: 18,
    color: '#333',
  },
  dropButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff9500',
    borderRadius: 10,
  },
  dropButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlinkoGame;
