export interface DrinkingCard {
    cardNumber: number;
    header: string;
    drinkingTask: string;
    drinkingAmount: number;
  }
  
  export const drinkingCards: DrinkingCard[] = [
    { cardNumber: 0, header: 'BROREN MIN!', drinkingTask: 'Til ære for alle brødre, ta en skål!!!', drinkingAmount: 1 },
    { cardNumber: 1, header: 'Den var lei!', drinkingTask: '{playerName} må ta {drinkingAmount} slurker', drinkingAmount: 3 },
    { cardNumber: 2, header: 'Vis at du bryr deg!', drinkingTask: '{playerName} kan dele ut {drinkingAmount} slurker til valgfri person', drinkingAmount: 2 },
    { cardNumber: 3, header: 'Straff!', drinkingTask: 'Hvis {playerName} klarer å stå på henda kan personen dele ut {drinkingAmount} slurker.', drinkingAmount: 6 },
    { cardNumber: 4, header: 'Straffer seg å være gay!', drinkingTask: '{playerName} er gay og må ta {drinkingAmount} slurker med personen i rommet {playerName} mener er nesten like gay!', drinkingAmount: 3 },
    { cardNumber: 5, header: 'Straff!', drinkingTask: '{playerName}, den var lei... ta {drinkingAmount} slurker', drinkingAmount: 4 },
    { cardNumber: 6, header: 'Gjelder å være høy!', drinkingTask: 'Høyeste personen kan dele ut {drinkingAmount} slurker til den laveste personen i rommet. Husk å le høyt og ta gjerne en slurk for å vise sympati', drinkingAmount: 2 },
    { cardNumber: 7, header: 'Dumt å være lavest men..!', drinkingTask: 'Siden det alltid er laveste eller høyeste som må drikke, hva om denne gangen så skal den nest laveste og den nest høyeste personen drikke {drinkingAmount} slurker!', drinkingAmount: 2 },
    { cardNumber: 8, header: 'Drikke i høyden!', drinkingTask: 'Alle tar det siste tallet i høyden sin. For eksempel 168cm høy gir tallet 8. Det tallet er antall slurker som skal deles ut. FYR LØS! (tallet 0 gir 0 selvølgelig)', drinkingAmount: 1 },
    { cardNumber: 9, header: 'Fy faen du er gæren!', drinkingTask: '{playerName}, gjør deg klar til å bli drita, skrrrt! Alle utenom {playerName} skal helle litt av drikken sin i ett glass. {playerName} må deretter drikke det. (sikt på 2-3 slurker når man heller oppi)', drinkingAmount: 1 },
    { cardNumber: 10, header: 'Burger king krone', drinkingTask: 'Utenom personen som leser dette. Førstemann til å si linjen til burger king kongen! {drinkingAmount} slurker til personen som sa det først jævla rasist!', drinkingAmount: 2 },
    { cardNumber: 11, header: 'Kategori', drinkingTask: '{playerName}, du kan velge en kategori. Klarer man ikke så er man ute. Hold på til kun en står igjen. Man drikker 1 slurk for hver person som ikke er ute når man selv ryker. (Er det 6 personer og man ryker først tilsier det 5 slurker)', drinkingAmount: 2 },
    { cardNumber: 12, header: 'Teleportere', drinkingTask: 'Hvis Jon Ryen er med i spillet kan han teleportere {drinkingAmount} slurker til valgfri person. Hvis ikke så kan {playerName} ta slurkene OMGÅENDE.', drinkingAmount: 3 },
    { cardNumber: 13, header: 'Singel stakkar', drinkingTask: 'Er du singel kan du dele ut slurker tilsvarende {drinkingAmount} gange antall ikke single med i spillet', drinkingAmount: 2 },
    { cardNumber: 14, header: 'Jeg har aldri', drinkingTask: 'Ta en runde med jeg har aldri. {playerName} starter også gå med klokka til alle har sagt en ting. 1 slurk om du har gjort det. (HUSK, SI KUN NOE MAN ALDRI HAR GJORT, "jeg har aldri pusta" ER IKKE LOV!!)', drinkingAmount: 2 },
    { cardNumber: 15, header: 'SHOT! SHOT! SHOT!', drinkingTask: 'Bruk en terning. Terning-app er også greit. Si ett tall fra 1 til 6 og kast terningen. Får du tallet du sa så må du ta en shot. {playerName} starter og følg klokka til alle har gjort det. Hvis ingen fikk shot så blir det ny runde! (Nektelse av shot er 10 slurker. Ja 10 slurker din jævla pøssi)', drinkingAmount: 2 },
    { cardNumber: 16, header: 'RoligCam', drinkingTask: 'Ta en rolig runde men kun 1 slurk i potten. {playerName}, du skal ta stein-saks-papir med personen til venstre for deg. Taperen tar en slurk. Så skal personen til venstre for {playerName} fortsette stein-saks-papir med personen til vestre igjen, helt til {playerName} har tatt stein-saks-papir med personen til høyre for seg.', drinkingAmount: 2 },
    { cardNumber: 17, header: 'Regel', drinkingTask: '{playerName}, lag en regel som skal vare spillet ut. (Må være en regel som kan brytes og som gjelder for alle)', drinkingAmount: 2 },
    { cardNumber: 18, header: 'Regel', drinkingTask: '{playerName}, lag en regel som skal vare spillet ut. (Må være en regel som kan brytes og som gjelder for alle)', drinkingAmount: 2 },
    { cardNumber: 19, header: 'Drikkepartner', drinkingTask: '{playerName}, velg deg en drikkepartner. Hver gang du drikker så må vedkommende ta 1 slurk (uavhengig av hvor mange du selv drikker). Men det samme gjelder deg hvis din drikkepartner drikker, da må du også ta en slurk', drinkingAmount: 2 },
    { cardNumber: 20, header: 'Drikkepartner', drinkingTask: '{playerName}, velg deg en drikkepartner. Hver gang du drikker så må vedkommende ta 1 slurk (uavhengig av hvor mange du selv drikker). Men det samme gjelder deg hvis din drikkepartner drikker, da må du også ta en slurk', drinkingAmount: 2 },
    { cardNumber: 21, header: 'Kategori', drinkingTask: '{drinkingAmount} slurker i potten. Kategorien er fornavn til foreldrene til alle som spiller. (sine egene foreldre er ikke lov å si)', drinkingAmount: 2 },
    { cardNumber: 22, header: 'Gambling bonanza', drinkingTask: '{playerName} velger seg en gambling addict. Dere to skal gamble slurker. Bli enig om hva dere skal gjøre og hvor mange slurker dere vil gamble. (Eksempel kan være å kaste terning der laveste må drikke)', drinkingAmount: 2 },
    { cardNumber: 23, header: 'Battle royale', drinkingTask: 'Her er det meningen å være igjen til slutt. {playerName} starter og skal skyte en annen spiller. Den spilleren er da ute, og kan da skyte en ny spiller. Spilleren som sitter igjen til slutt kan dele ut {drinkingAmount} slurker. Merk: det er ikke lov å skyte tilbake på personen som skøyt deg.', drinkingAmount: 4 },
    { cardNumber: 24, header: 'Forræder', drinkingTask: 'Bruk en kortstokk eller lignende. Bruk like mange kort som det er spillere. For hver 4. spiller så skal en av kortene være "ess | A". Stokk kortene og del ut ett kort til hver spiller. Sett på en timer på 2 minutter. Da skal man prøve å finne forræderen(e) (personen som har ess). Når timeren er ferdig er det ikke lov å diskutere mere. Tell ned fra 3 også peker alle på hvem de tror det er. Er personen en forræder så skal forræderen(e) drikke {drinkingAmount} slurker. Hvis ikke skal alle lojale drikke halvparten av det igjen.', drinkingAmount: 4 },
    { cardNumber: 25, header: 'Bezzerwizzer', drinkingTask: 'Første personen som dunker i boret å forklarer kjennetegnet på biler i Notodden deler ut {drinkingAmount} slurker.', drinkingAmount: 3 },
    { cardNumber: 26, header: 'Buddha', drinkingTask: 'Personen som klarer å holde en O-lyd lengst knipser aLekS på øret eller så må du drikke {drinkingAmount} slurker', drinkingAmount: 1 },
    { cardNumber: 27, header: 'Dobbeldekker', drinkingTask: '{playerName}, Lad opp snusleppa med 2 snii og drikk {drinkingAmount} slurker', drinkingAmount: 2 },
    { cardNumber: 28, header: 'Heksejakt', drinkingTask: '{playerName} skal DISSE neste person som blir nevnt i spillet. Opprettholder du dissingen i 2 runder kan du dele ut {drinkingAmount} slurker ', drinkingAmount: 4 },
    { cardNumber: 29, header: 'Fuck, Marry, Kill', drinkingTask: '{playerName}, du skal ha fuck-marry-kill på tre personer de andre spillerne bestemmer. Ta en slurk for hvert svar!', drinkingAmount: 2 },
    { cardNumber: 30, header: 'Hidden passive!', drinkingTask: 'Fra og med nå og ut spille kan du skrike “GUD VÆRE MED DEG” når noen banner. Da må personen som bannet drikke {drinkingAmount} slurker', drinkingAmount: 1 },
    { cardNumber: 31, header: 'Sangfügel', drinkingTask: '{playerName} må synge en valgfri sang med sterke følelser. Hvis ikke dette er din stil må du drikke {drinkingAmount} slurker', drinkingAmount: 5 },
    { cardNumber: 32, header: 'Sikkerhet på arbeidsplassen', drinkingTask: ' {playerName} holder en sikkerhetsbrief med personen til venstre, over hvordan man skal drikke ølen sin riktig, hva er farene og hva kan skje dersom man gjør det feil. Server et glass vann til {playerName}', drinkingAmount: 2 },
    { cardNumber: 33, header: 'Butcher', drinkingTask: 'Kim tar en oversikt over gutta og velger 2 personer som må fyres opp litt. Sammen med Kim skal de skåle og ta {drinkingAmount} slurker. Er ikke Kim med i spillet tar alle og skåler med 1 slurk.', drinkingAmount: 3 },

  ];
  
  export const getDrinkingCard = (cardNumber: number): DrinkingCard | undefined => {
    return drinkingCards.find(card => card.cardNumber === cardNumber);
  };  

  export const formatDrinkingTask = (card: DrinkingCard, player: string, drinkingAmount: number): string => {
    return card.drinkingTask
      .replace(/{playerName}/g, player) // Replaces all instances of {playerName} with the player's name
      .replace(/{drinkingAmount}/g, drinkingAmount.toString()); // Replaces all instances of {drinkingAmount}
  };
  
  