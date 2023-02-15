import { colors, Foundation, Pile, Stock, Waste } from './cards.js';

const suits = {
    clubs: '&clubs;',
    diamonds: '&diams;',
    hearts: '&hearts;',
    spades: '&spades;'
};

const faces = {
    1: 'A',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K',
};

/**
 * 
 * @param {GameDeck} deck 
 */
export function createDeckElement(deck, index) {
    const element = document.createElement('article');
    element.className = 'deck';

    let activeCards = false;

    if (deck.moves.flip || deck.moves.place || deck.moves.take.length > 0) {

        if (deck.size == 0 || deck.moves.place) {
            element.classList.add('active');
        }
        
        if (deck.moves.place) {
            element.dataset.action = 'place';
        } else if (deck.moves.flip) {
            element.dataset.action = 'flip';
            activeCards = true;
        } else if (deck.moves.take.length > 0) {
            element.dataset.action = 'take';
            activeCards = true;
        }
    }

    if (deck instanceof Stock) {
        element.dataset.type = 'stock';
    } else if (deck instanceof Waste) {
        element.dataset.type = 'waste';
    } else if (deck instanceof Foundation) {
        element.dataset.type = 'foundations';
        element.dataset.suit = deck.suit;
    } else if (deck instanceof Pile) {
        element.dataset.type = 'piles';
        element.dataset.index = index;
    }

    let cards = deck.cards;

    // TODO
    /*
    if (deck.size > 1 && (deck instanceof Stock || deck instanceof Waste || deck instanceof Foundation)) {
        const visibleCount = Math.ceil((deck.size - 1) / 5);
        cards = new Array(visibleCount);
        cards.fill({ faceUp: false });
        cards.push(deck.top);
    }
    */

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const top = i == cards.length - 1;
        const active = activeCards && ((top && deck.canFlip()) || deck.canTake(i));
        element.appendChild(createCard(card, top, i, active));
    }

    return element;
}

/**
 * 
 * @param {import('./cards.js').Card} card 
 * @param {boolean} top 
 */
function createCard(card, top, index, active) {
    const element = document.createElement('div');
    element.classList.add('card');
    if (active) {
        element.classList.add('active');
    }
    element.dataset.index = index;

    let content = '';

    if (card.faceUp) {
        element.classList.add(colors[card.suit]);
        content = `${suits[card.suit]}${faces[card.face]}`;
    } else {
        content = `<span class="back${top ? ' top' : ''}"></span>`;
    }

    if (top) {
        element.classList.add('top');
    }

    element.innerHTML = content;

    return element;
}

/** @typedef {import('./cards.js').Deck & {moves: {flip: boolean, take: number[], place: boolean}}} GameDeck */