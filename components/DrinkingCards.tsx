export interface DrinkingCard {
    cardNumber: number;
    header: string;
    drinkingTask: string;
    drinkingAmount: number;
  }
  
  export const drinkingCards: DrinkingCard[] = [
    { cardNumber: 0, header: 'BROREN MIN!', drinkingTask: 'Til ære for alle brødre, ta en skål!!!', drinkingAmount: 1 },
    { cardNumber: 1, header: 'Straff!', drinkingTask: '{playerName} må ta {drinkingAmount} slurker', drinkingAmount: 1 },
    { cardNumber: 2, header: 'Straff!', drinkingTask: '{playerName} kan dele ut {drinkingAmount} slurker til valgfri person', drinkingAmount: 1 },
    { cardNumber: 3, header: 'Straff!', drinkingTask: 'Hvis {playerName} klarer å stå på henda kan personen dele ut {drinkingAmount} slurker', drinkingAmount: 1 },
    { cardNumber: 4, header: 'Straff!', drinkingTask: '{playerName} er gay og må ta {drinkingAmount} slurker', drinkingAmount: 1 },
    { cardNumber: 5, header: 'Straff!', drinkingTask: '{playerName}, den var lei... ta {drinkingAmount} slurker', drinkingAmount: 1 },
  ];
  
  export const getDrinkingCard = (cardNumber: number): DrinkingCard | undefined => {
    return drinkingCards.find(card => card.cardNumber === cardNumber);
  };  

  export const formatDrinkingTask = (card: DrinkingCard, player: string, drinkingAmount: number): string => {
    return card.drinkingTask
      .replace('{playerName}', player)
      .replace('{drinkingAmount}', drinkingAmount.toString());
  };
  