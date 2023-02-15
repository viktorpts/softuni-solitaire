export const faces = {
    Ace: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 11,
    Queen: 12,
    King: 13,
};

export const suits = {
    Clubs: 'clubs',
    Diamonds: 'diamonds',
    Hearts: 'hearts',
    Spades: 'spades'
};

export const colors = {
    clubs: 'black',
    diamonds: 'red',
    hearts: 'red',
    spades: 'black'
};


export class Card {
    /** @type {keyof suits} */
    suit = null;
    /** @type {keyof faces} */
    face = null;
    /** @type {boolean} */
    faceUp = false;

    /**
     * 
     * @param {keyof suits} suit 
     * @param {keyof faces} face 
     * @param {boolean} faceUp
     */
    constructor(suit, face, faceUp = false) {
        this.suit = suit;
        this.face = face;
        this.faceUp = faceUp;
    }
}

export class Deck {
    /** @type {Card[]} */
    cards = [];

    /**
     * @param {Card[]?} cards 
     */
    constructor(cards = []) {
        this.cards = cards;
    }

    get top() {
        return this.cards[this.topIndex];
    }
    get topIndex() {
        return this.size - 1;
    }
    get size() {
        return this.cards.length;
    }

    canFlip() {
        return this.size > 0 && this.top.faceUp == false;
    }

    canTake(index) {
        throw new TypeError('Cannot invoke abstract method');
    }

    /**
     * @param {Card | Card[]} cards 
     */
    canPlace(cards) {
        throw new TypeError('Cannot invoke abstract method');
    }

    flip() {
        if (this.canFlip() == false) {
            throw new Error('Cannot flip card');
        }
        this.top.faceUp = true;
    }

    take(index) {
        if (this.canTake(index) == false) {
            throw new Error('Cannot take card');
        }
        return this.cards.splice(index, this.size - index);
    }

    /**
     * @param {Card | Card[]} cards 
     */
    place(cards) {
        if (this.canPlace(cards) == false) {
            throw new Error('Cannot place cards');
        }

        if (Array.isArray(cards) == false) {
            cards = [cards];
        }

        this.cards.push(...cards);
    }
}

export class Stock extends Deck {
    canFlip() {
        return true;
    }
    
    canTake(index) {
        return false;
    }

    /**
     * @param {Card | Card[]} cards 
     */
    canPlace(cards) {
        return false;
    }
}

export class Waste extends Deck {
    canTake(index) {
        return this.size > 0 && index == this.topIndex;
    }

    /**
     * @param {Card | Card[]} cards 
     */
    canPlace(cards) {
        return false;
    }
}

export class Foundation extends Deck {
    /** @type {keyof suits} */
    suit = null;

    /**
     * 
     * @param {Card[]?} cards 
     * @param {keyof suits} suit 
     */
    constructor(cards, suit) {
        super(cards);
        this.suit = suit;
    }

    canTake(index) {
        return this.size > 0 && index == this.topIndex;
    }

    /**
     * @param {Card | Card[]} cards 
     */
    canPlace(cards) {
        if (!cards || (Array.isArray(cards) && cards.length > 1)) {
            return false;
        }

        const card = Array.isArray(cards) ? cards[0] : cards;

        return (card.suit == this.suit &&
            ((card.face == faces.Ace && this.size == 0)
                || (this.size > 0 && (card.face - 1) == this.top.face)));
    }
}

export class Pile extends Deck {
    canTake(index) {
        return this.size > 0 && this.cards[index].faceUp;
    }

    /**
     * @param {Card | Card[]} cards 
     */
    canPlace(cards) {
        if (!cards) {
            return false;
        }
        if (Array.isArray(cards) == false) {
            cards = [cards];
        }
        /** @type {Card} */
        const bottomCard = cards[0];

        return (bottomCard.face == faces.King && this.size == 0)
            || (this.size > 0 && (bottomCard.face + 1) == this.top.face && colors[bottomCard.suit] != colors[this.top.suit]);
    }
}
