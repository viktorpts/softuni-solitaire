import { faces, suits, colors, Card, Deck, Stock, Waste, Foundation, Pile } from './cards.js';


export function createDeck() {
    const deck = new Deck();

    for (let suit of Object.values(suits)) {
        for (let face of Object.values(faces)) {
            deck.cards.push(new Card(suit, face));
        }
    }

    return deck;
}


/**
 * @param {Deck} deck 
 */
export function shuffleDeck(deck) {
    const stock = [];

    while (deck.size > 0) {
        const card = deck.cards.splice(Math.random() * deck.size | 0, 1)[0];
        stock.push(card);
    }

    deck.cards.push(...stock);
}

/**
 * 
 * @param {Deck} deck 
 * @returns {GameState}
 */
export function dealDeck(deck) {

    const index = [
        new Stock(),
        new Waste(),
        new Foundation([], suits.Clubs),
        new Foundation([], suits.Diamonds),
        new Foundation([], suits.Hearts),
        new Foundation([], suits.Spades),
        new Pile(),
        new Pile(),
        new Pile(),
        new Pile(),
        new Pile(),
        new Pile(),
        new Pile(),
    ];

    const state = {
        stock: index[0],
        waste: index[1],
        foundations: {
            [suits.Clubs]: index[2],
            [suits.Diamonds]: index[3],
            [suits.Hearts]: index[4],
            [suits.Spades]: index[5],
        },
        piles: [
            index[6],
            index[7],
            index[8],
            index[9],
            index[10],
            index[11],
            index[12],
        ]
    };

    // Uncomment for easy debug victory
    /*
    let count = 0;
    for (let suit of Object.values(suits)) {
        for (let face of Object.values(faces)) {
            count++;
            if (count == 52) {
                break;
            }
            state.foundations[suit].cards.push(deck.cards.shift());
            state.foundations[suit].top.faceUp = true;
        }
    }
    */

    for (let i = 0; i < 7; i++) {
        const pile = state.piles[i];

        for (let j = 0; j <= i; j++) {
            pile.cards.push(deck.cards.pop());
        }

        pile.top.faceUp = true;
    }

    state.stock.cards.push(...deck.cards);

    return [ index, state ];
}

/**
 * @typedef {Object} GameState
 * @property {Stock} stock
 * @property {Waste} waste
 * @property {Object} foundations
 * @property {Foundation} foundations.clubs
 * @property {Foundation} foundations.diamonds
 * @property {Foundation} foundations.hearts
 * @property {Foundation} foundations.spades
 * @property {[Pile, Pile, Pile, Pile, Pile, Pile, Pile]} piles
 */