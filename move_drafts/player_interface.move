module hackathon::player_interface;

use std::vector;
use sui::object::{Self, UID};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

// Error codes
const EDeckFull: u64 = 0;
const ECardNotFound: u64 = 1;

// Struct representing a Card or Object in the deck
// TODO: Expand with actual game properties (e.g., power, type, image_url)
struct Card has key, store {
    id: UID,
    name: vector<u8>,
    power: u64,
}

// Struct representing the Player's Deck
struct Deck has key {
    id: UID,
    cards: vector<Card>,
    capacity: u64,
}

// --- Public Functions ---

// Create a new empty deck for a player
public entry fun create_deck(ctx: &mut TxContext) {
    let deck = Deck {
        id: object::new(ctx),
        cards: vector::empty(),
        capacity: 10, // Default capacity
    };
    transfer::transfer(deck, tx_context::sender(ctx));
}

// Add a card to the deck
// This is a placeholder function. In a real game, cards might be minted or earned.
public fun add_card(deck: &mut Deck, name: vector<u8>, power: u64, ctx: &mut TxContext) {
    assert!(vector::length(&deck.cards) < deck.capacity, EDeckFull);

    let card = Card {
        id: object::new(ctx),
        name,
        power,
    };

    vector::push_back(&mut deck.cards, card);
}

// Remove a card from the deck (e.g., when played or traded)
// TODO: Implement logic to find and remove specific card
public fun remove_card(_deck: &mut Deck, _card_id: u64) {}

// Get the number of cards in the deck
public fun deck_size(deck: &Deck): u64 {
    vector::length(&deck.cards)
}

// --- Test Functions (Optional) ---
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    create_deck(ctx);
}
