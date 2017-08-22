(function () {
    class Card {
        constructor(suit, number) {
            this.suit = suit;
            this.number = number;
        }
        get Number() {
            return this.number;
        }
        get Suit() {
            let suitName = '';
            switch (this.suit) {
                case 1:
                    suitName = "hearts";
                    break;
                case 2:
                    suitName = "clubs";
                    break;
                case 3:
                    suitName = "spades";
                    break;
                case 4:
                    suitName = "diamonds";
                    break;
            }
            return suitName;
        }
        get Symbol() {
            let suitName = '';
            switch (this.suit) {
                case 1:
                    suitName = "&hearts;";
                    break;
                case 2:
                    suitName = "&clubs;";
                    break;
                case 3:
                    suitName = "&spades;";
                    break;
                case 4:
                    suitName = "&diams;";
                    break;
            }
            return suitName;
        }
        get Value() {
            let value = this.number;
            if (this.number >= 10) {
                value = 10;
            }
            if (this.number === 1) {
                value = 11;
            }
            return value;
        }
        get Name() {
            let cardName = '';
            switch (this.number) {
                case 1:
                    cardName = "A";
                    break;
                case 13:
                    cardName = "K";
                    break;
                case 12:
                    cardName = "Q";
                    break;
                case 11:
                    cardName = "J";
                    break;
                default:
                    cardName = this.number;
                    break;
            }
            return cardName + this.Symbol;
        }
    }
    class Deck {
        constructor() {
            this.cards = [];
            this.newCards();
        }
        newCards() {
            for (let i = 0; i < 52; i++) {
                let suit = i % 4 + 1;
                let number = i % 13 + 1;
                this.cards.push(new Card(suit, number));
            }
        }
        shuffle() {
            let ctr = this.cards.length
            let temp;
            let index;

            while (ctr > 0) {
                index = Math.floor(Math.random() * ctr);
                ctr--;
                temp = this.cards[ctr];
                this.cards[ctr] = this.cards[index];
                this.cards[index] = temp;
            }

            return this.cards;
        }
        deal() {
            if (!this.cards.length) {
                this.newCards();
                this.shuffle();
            }
            return this.cards.pop();
        }
    }
    class Hand {
        constructor(deck, type) {
            this.deck = deck;
            this.cards = [];
            if (type === 1) {
                this.cards.push(deck.deal(), deck.deal());
            } else if (type === 2) {
                this.cards.push(deck.deal());
            }

        }

        get hand() {
            return this.cards;
        }
        score() {
            let i;
            let score = 0;
            let aces = 0;
            let cardValue = 0;

            this.cards.map((card) => {
                cardValue = card.Value;
                if (cardValue == 11) {
                    aces += 1;
                }
                score += cardValue;
            });

            while (score > 21 && aces > 0) {
                score -= 10;
                aces -= 1;
            }
            return score;
        }
        hit() {
            if (this.cards.length <= 5) {
                this.cards.push(this.deck.deal());
            }
        }
        handtoHtml() {
            let output = '';
            this.cards.map((card) => {
                return output = output + ` <div class="col-xs-12 col-sm-12 col-md-2 ${card.Suit} "><div class="card"><div class="suit"> ${card.Name} </div><div class="suit"> ${card.Name} </div></div></div>`;
            });
            return output;
        }
    }
    class Game {
        constructor() {
            this.deck = new Deck();
            this.ui = UI;
            this.wins = 0;
            this.losses = 0;
            this.listeneners();
            this.deck.shuffle();
        }
        listeneners() {
            let yourScore = document.getElementById('yourScore');
            let yourHand = document.getElementById('yourHand');
            let dealersHand = document.getElementById('dealersHand');

            document.getElementById('deal').addEventListener('click', () => {
                this.yourHand = new Hand(this.deck, 1);
                const getYourHandToHtml = this.yourHand.handtoHtml();
                const score = this.yourHand.score();
                this.dealerHand = this.dealersFirstHand();
                const getDealerHandToHtml = this.dealerHand.handtoHtml();
                this.ui.update(getYourHandToHtml, getDealerHandToHtml, score, this.wins, this.losses);
                this.ui.showInGame();
            });
            document.getElementById('hit').addEventListener('click', () => {
                this.yourHand.hit();
                if (this.yourHand.hand.length >= 5 || this.yourHand.score() > 21) {
                    const e = document.createEvent('HTMLEvents');
                    e.initEvent('click', true, false);
                    document.getElementById('stick').dispatchEvent(e);
                    document.getElementById('hit').style.display = 'none';
                }
                const getHandToHtml = this.yourHand.handtoHtml();
                const score = this.yourHand.score();
                this.ui.update(getHandToHtml, undefined, score, this.wins, this.losses);


            });
            document.getElementById('stick').addEventListener('click', () => {
                this.dealersHand(this.dealerHand);
                const getDealerHandToHtml = this.dealerHand.handtoHtml();
                this.ui.update(undefined, getDealerHandToHtml, undefined, this.wins, this.losses);
                const getWinner = this.winnerToHtml();

                document.getElementById('result').style.display = 'block';
                document.getElementById('result').innerHTML = getWinner;
                this.ui.showDeal();
            });
        }
        winnerToHtml() {
            let output = '';
            let clss = '';

            const yourScore = this.yourHand.score();
            const dealerScore = this.dealerHand.score();

            if (yourScore > 21 || dealerScore === 21) {
                output = 'Sorry! You lose!';
                clss = 'danger';
                this.losses++;
            } else if (dealerScore > 21 || yourScore === 21) {
                output = 'You win!';
                clss = 'success';
                this.wins++;
            } else {
                 /*TODO BETA Improvement that looks at the amount of cards the player has*/
                const yourCardCount = this.yourHand.hand.length;
                const dealerCardCount = this.dealerHand.hand.length;
                if (yourCardCount === dealerCardCount) {

                    if (dealerScore > yourScore) {
                        output = 'Sorry! You lose!';
                        clss = 'danger';
                        this.losses++;
                    } else if (dealerScore === yourScore) {
                        output = 'Tie!';
                        clss = 'warning';
                    }
                    else if (dealerScore < yourScore) {
                        output = 'You win!';
                        clss = 'success';
                        this.wins++;
                    }
                }
                else {

                    if (dealerScore > yourScore && dealerCardCount > yourCardCount) {
                        output = 'Sorry! You lose!';
                        clss = 'danger';
                        this.losses++;
                    } else if (dealerScore < yourScore && dealerCardCount < yourCardCount) {
                        output = 'You win!';
                        clss = 'success';
                        this.wins++;
                    }
                }
                /*TODO BETA Improvement that looks at the amount of cards the player has*/

            }
            return ` <div class="alert alert-${clss} "> ${output}  Dealer: ${dealerScore} You: ${yourScore} </div>`;
        }
        dealersFirstHand() {
            const hand = new Hand(this.deck, 2);
            return hand;
        }
        dealersHand(hand) {

            while (hand.score() < 17) {
                hand.hit();
            }
            return hand;
        }

    }
    class UI {
        static update(yourHtml, dealerHtml, score, wins, losses) {

            if (yourHtml) {
                document.getElementById('yourHand').innerHTML = yourHtml;
            }
            if (dealerHtml) {
                document.getElementById('dealerHand').innerHTML = dealerHtml;
            }
            if (score) {
                document.getElementById('yourScore').querySelector('.scoreBoard').innerHTML = score;
            }


            document.getElementById('wins').innerHTML = wins;
            document.getElementById('losses').innerHTML = losses;
        }
        static showDeal() {

            document.getElementById('hit').style.display = 'none';
            document.getElementById('stick').style.display = 'none';
            document.getElementById('deal').style.display = 'block';
        }
        static showInGame() {
            document.getElementById('result').style.display = 'none';
            document.getElementById('hit').style.display = 'block';
            document.getElementById('stick').style.display = 'block';
            document.getElementById('deal').style.display = 'none';
        }
    }
    const Play = new Game();
})();