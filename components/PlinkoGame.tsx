import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Animated } from 'react-native';

interface BallPosition {
  x: number | null;
  y: Animated.Value;
}

const bucketColors = [
  '#e64747', // 10x
  '#e09c3b', // 8x
  '#e09c3b', // 6x
  '#e6e22e', // 4x
  '#e6e22e', // 2x
  '#e6e22e', // 1x
  '#8fb935', // 0x
  '#8fb935', // 0x
  '#e6e22e', // 1x
  '#e6e22e', // 2x
  '#e6e22e', // 4x
  '#e09c3b', // 6x
  '#e09c3b', // 8x
  '#e64747', // 10x
];

const PlinkoGame: React.FC = () => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const boardWidth = screenWidth;
    const boardHeight = screenHeight * 0.6; // Use 60% of the screen height
    const bucketDrinks = [10, 8, 6, 4, 2, 1, 0, 0, 1, 2, 4, 6, 8, 10]; // Drink values
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

    const [bucketStats, setBuckets] = useState<number[]>([]);
    const addToBucketStats = (value: number) => {
      setBuckets((prevBuckets) => [...prevBuckets, value]); // Add the new value
    };

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
      return biased * 12;
    }
  
    const dropBall = async () => {
      setBallDropping(true);
      const randomFactorValue: number = randomFactor() + 3;
      const randomAngle = Math.random() * 2 - 1;
      const startX = (boardWidth / 2 - pegSize / 4) + randomFactorValue; // Start at the center of the screen horizontally
      const startY = 0; // Start from the top of the screen
    
      setBallPosition({
        x: startX,
        y: new Animated.Value(startY),
      });
    
      let ballX = startX;
      const ballY = new Animated.Value(startY);
    
      // Ball movement variables
      let velocityX = randomAngle; // Horizontal velocity
      let velocityY = Math.random() * 2 + 10; // Vertical velocity
      const gravity = 0.7; // Gravity that affects the downward acceleration
      let bounceFactor = -0.5; // Reduces bounce intensity (negative for upward velocity)
      const horizontalBounce = pegSize / 10; // Adjust horizontal bounce strength
      const maxVelocity = pegSize / 2; // Cap maximum velocity (to avoid flying off)
    
      const interval = 17; // 60 FPS
      let currentY = startY;
    
      // Helper function to handle animation frame
      const updatePosition = () =>
        new Promise<void>((resolve) => {
          const movement = setInterval(() => {
            // Apply gravity to vertical velocity
            velocityY += gravity * 0.9;
            velocityY += 0.005;
    
            // Clamp velocities to avoid excessive speeds
            velocityX = Math.max(Math.min(velocityX, maxVelocity), -maxVelocity);
            velocityY = Math.max(Math.min(velocityY, maxVelocity), -maxVelocity);
    
            velocityX *= 0.9;
    
            // Update positions
            currentY += velocityY;
            ballX += velocityX;
    
            // Check for collision with pegs
            for (const peg of pegs) {
              const distance = Math.sqrt(
                Math.pow(ballX - peg.x, 2) + Math.pow(currentY - peg.y, 2)
              );
    
              // If the ball hits a peg
              if (distance < pegSize / 2.7) {
                // Bounce vertically upward with reduced velocity
                velocityY *= bounceFactor;
                bounceFactor += 0.05;
    
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
              let landedBucket: number = Math.floor((ballX / boardWidth) * numColumns);
              if (landedBucket < 0) {
                landedBucket = 0; // Far left bucket
              } else if (landedBucket >= bucketDrinks.length) {
                landedBucket = bucketDrinks.length - 1; // Far right bucket
              }
    
              setSelectedBucket(landedBucket);
              setBallDropping(false);
              addToBucketStats(landedBucket);
      
    
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
    
              resolve();
            }
    
            // Update ball position
            ballY.setValue(currentY);
            setBallPosition({
              x: ballX,
              y: ballY,
            });
          }, interval);
        });
    
      // Wait for animation to complete
      await updatePosition();
    };
    
    async function simulateDrop() {
      for(let i = 0; i < 1000; i++) {
        await dropBall();
      }
    }
      
    useEffect(() => {
      console.log(bucketStats);
    }, [bucketStats]);
  

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
              <View key={index} style={{ alignItems: 'center' }}>
                {/* Display text for the bucket */}
                <Text style={styles.bucketText}>
                  {drink === 0 ? '∞' : drink}
                </Text>

                {/* Animated bucket */}
                <Animated.View
                  style={[
                    styles.bucket,
                    {
                      width: boardWidth / numColumns,
                      height: bucketHeight,
                      backgroundColor: bucketColors[index],
                      transform: [{ scale: bucketScales[index] }], // Scale animation
                    },
                  ]}
                />
              </View>
            ))}
          </View>


        </View>
  
        {/* Display result */}
        {selectedBucket !== null && (
          <View style={styles.resultContainer}>
            {!ballDropping && bucketDrinks[selectedBucket] !== 0 ? (
              <Text style={styles.resultText}>
                Drikk {bucketDrinks[selectedBucket]} slurker!
              </Text>
            ) : (
              <Text style={styles.resultText}>--</Text>
            )}
          </View>
        )}
  
        {/* Drop ball button */}
        <TouchableOpacity
          style={[
            styles.dropButton,
            ballDropping && styles.dropButtonDisabled, // Apply disabled style if ballDropping is true
          ]}
          onPress={dropBall}
          disabled={ballDropping} // Disable button when ballDropping is true
        >
          <Text style={styles.dropButtonText}>Slipp ball</Text>
        </TouchableOpacity>

         {/* Drop ball button */}
         <TouchableOpacity
          style={[
            styles.dropButton,
            ballDropping && styles.dropButtonDisabled, // Apply disabled style if ballDropping is true
          ]}
          onPress={simulateDrop}
          disabled={ballDropping} // Disable button when ballDropping is true
        >
          <Text style={styles.dropButtonText}>Simuler 1000 slipp</Text>
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
    position: 'absolute',
    zIndex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
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
  dropButtonDisabled: {
    backgroundColor: '#c19658', // Light gray to indicate disabled state
  },
});

export default PlinkoGame;
