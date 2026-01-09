#[allow(lint(public_random))]
module card::game;

use card::card::{Card, points};
use sui::event::emit;
use sui::random::{Random, new_generator};

// === Structs ===

public struct Game has key {
    id: UID,
    player1: address,
    player2: address,
    deck1: vector<Card>,
    deck2: vector<Card>,
    hand1: vector<Card>,
    hand2: vector<Card>,
    turn: u64,
    p1_swapped: bool,
    p2_swapped: bool,
    p1_revealed: vector<bool>, // Track which cards player1 has revealed
    p2_revealed: vector<bool>, // Track which cards player2 has revealed
    is_finished: bool,
}

public struct MatchRequest has key {
    id: UID,
    challenger: address,
    opponent: address,
    challenger_cards: vector<Card>,
    created_at_epoch: u64,
}

// === Events ===

public struct MatchCreated has copy, drop {
    request_id: ID,
    challenger: address,
    opponent: address,
}

public struct MatchAccepted has copy, drop {
    game_id: ID,
    request_id: ID,
    player1: address,
    player2: address,
}

public struct MatchRejected has copy, drop {
    request_id: ID,
    challenger: address,
    opponent: address,
}

public struct MatchCancelled has copy, drop {
    request_id: ID,
    challenger: address,
}

public struct CardRevealed has copy, drop {
    game_id: ID,
    player: address,
    card_index: u64,
}

public struct CardSwapped has copy, drop {
    game_id: ID,
    player: address,
    round: u64,
}

public struct GameResolved has copy, drop {
    game_id: ID,
    winner: address,
    score1: u64,
    score2: u64,
}

// === Public Functions ===

/// Create a match request to challenge another player
public fun create_match_request(opponent: address, cards: vector<Card>, ctx: &mut TxContext) {
    let sender = ctx.sender();
    assert!(sender != opponent, 100); // Cannot challenge yourself
    assert!(cards.length() >= 7, 101); // Need at least 7 cards (3 for hand + 4 for deck)

    let request = MatchRequest {
        id: object::new(ctx),
        challenger: sender,
        opponent,
        challenger_cards: cards,
        created_at_epoch: ctx.epoch(),
    };

    let request_id = object::id(&request);

    emit(MatchCreated {
        request_id,
        challenger: sender,
        opponent,
    });

    transfer::share_object(request);
}

/// Accept a match request and start the game
public fun accept_match_request(
    request: MatchRequest,
    mut opponent_cards: vector<Card>,
    r: &Random,
    ctx: &mut TxContext,
) {
    let sender = ctx.sender();
    assert!(sender == request.opponent, 102); // Only the challenged player can accept
    assert!(opponent_cards.length() >= 7, 101); // Need at least 7 cards

    let MatchRequest {
        id,
        challenger,
        opponent: _,
        mut challenger_cards,
        created_at_epoch: _,
    } = request;

    let request_id = object::uid_to_inner(&id);
    object::delete(id);

    let mut generator = new_generator(r, ctx);

    // Shuffle both decks
    let len1 = challenger_cards.length();
    let mut i = 0;
    while (i < len1) {
        let j = generator.generate_u64_in_range(i, len1);
        challenger_cards.swap(i, j);
        i = i + 1;
    };

    let len2 = opponent_cards.length();
    let mut k = 0;
    while (k < len2) {
        let l = generator.generate_u64_in_range(k, len2);
        opponent_cards.swap(k, l);
        k = k + 1;
    };

    // Deal 3 cards to each player
    let mut hand1 = vector::empty<Card>();
    let mut hand2 = vector::empty<Card>();

    let mut m = 0;
    while (m < 3) {
        hand1.push_back(challenger_cards.pop_back());
        hand2.push_back(opponent_cards.pop_back());
        m = m + 1;
    };

    // Initialize revealed tracking
    let mut p1_revealed = vector::empty<bool>();
    let mut p2_revealed = vector::empty<bool>();
    let mut n = 0;
    while (n < 3) {
        p1_revealed.push_back(false);
        p2_revealed.push_back(false);
        n = n + 1;
    };

    let game = Game {
        id: object::new(ctx),
        player1: challenger,
        player2: sender,
        deck1: challenger_cards,
        deck2: opponent_cards,
        hand1,
        hand2,
        turn: 0,
        p1_swapped: false,
        p2_swapped: false,
        p1_revealed,
        p2_revealed,
        is_finished: false,
    };

    let game_id = object::id(&game);

    emit(MatchAccepted {
        game_id,
        request_id,
        player1: challenger,
        player2: sender,
    });

    transfer::share_object(game);
}

/// Reject a match request
public fun reject_match_request(request: MatchRequest, ctx: &mut TxContext) {
    let sender = ctx.sender();
    assert!(sender == request.opponent, 102); // Only the challenged player can reject

    let MatchRequest {
        id,
        challenger,
        opponent,
        mut challenger_cards,
        created_at_epoch: _,
    } = request;

    emit(MatchRejected {
        request_id: object::uid_to_inner(&id),
        challenger,
        opponent,
    });

    // Return cards to challenger
    while (!challenger_cards.is_empty()) {
        let card = challenger_cards.pop_back();
        transfer::public_transfer(card, challenger);
    };

    object::delete(id);
}

/// Cancel a match request (only challenger can cancel)
public fun cancel_match_request(request: MatchRequest, ctx: &mut TxContext) {
    let sender = ctx.sender();
    assert!(sender == request.challenger, 103); // Only challenger can cancel

    let MatchRequest {
        id,
        challenger,
        opponent: _,
        mut challenger_cards,
        created_at_epoch: _,
    } = request;

    emit(MatchCancelled {
        request_id: object::uid_to_inner(&id),
        challenger,
    });

    // Return cards to challenger
    while (!challenger_cards.is_empty()) {
        let card = challenger_cards.pop_back();
        transfer::public_transfer(card, challenger);
    };

    object::delete(id);
}

/// Reveal card and optionally swap it
public fun play_turn_and_swap(game: &mut Game, should_swap: bool, r: &Random, ctx: &mut TxContext) {
    assert!(!game.is_finished, 0);
    assert!(game.turn < 3, 1);

    let sender = ctx.sender();
    let card_idx = game.turn;

    // Player reveals their card
    if (sender == game.player1) {
        assert!(!game.p1_revealed[card_idx], 104); // Card already revealed
        *game.p1_revealed.borrow_mut(card_idx) = true;

        emit(CardRevealed {
            game_id: object::id(game),
            player: sender,
            card_index: card_idx,
        });

        // Handle swap if requested
        if (should_swap && !game.p1_swapped && !game.deck1.is_empty()) {
            game.p1_swapped = true;

            let mut generator = new_generator(r, ctx);
            let deck_idx = generator.generate_u64_in_range(0, game.deck1.length());

            let hand_card = game.hand1.swap_remove(card_idx);
            let deck_card = game.deck1.swap_remove(deck_idx);

            game.hand1.push_back(deck_card);
            let last_idx = game.hand1.length() - 1;
            game.hand1.swap(card_idx, last_idx);

            game.deck1.push_back(hand_card);

            emit(CardSwapped {
                game_id: object::id(game),
                player: sender,
                round: game.turn,
            });
        };
    } else if (sender == game.player2) {
        assert!(!game.p2_revealed[card_idx], 104); // Card already revealed
        *game.p2_revealed.borrow_mut(card_idx) = true;

        emit(CardRevealed {
            game_id: object::id(game),
            player: sender,
            card_index: card_idx,
        });

        // Handle swap if requested
        if (should_swap && !game.p2_swapped && !game.deck2.is_empty()) {
            game.p2_swapped = true;

            let mut generator = new_generator(r, ctx);
            let deck_idx = generator.generate_u64_in_range(0, game.deck2.length());

            let hand_card = game.hand2.swap_remove(card_idx);
            let deck_card = game.deck2.swap_remove(deck_idx);

            game.hand2.push_back(deck_card);
            let last_idx = game.hand2.length() - 1;
            game.hand2.swap(card_idx, last_idx);

            game.deck2.push_back(hand_card);

            emit(CardSwapped {
                game_id: object::id(game),
                player: sender,
                round: game.turn,
            });
        };
    } else {
        abort 3 // Not a player in this game
    };

    // Advance turn if both players have revealed
    if (game.p1_revealed[card_idx] && game.p2_revealed[card_idx]) {
        game.turn = game.turn + 1;
    };
}

/// Resolve the game and determine winner
public fun resolve_game(game: &mut Game, r: &Random, ctx: &mut TxContext) {
    assert!(game.turn == 3, 4); // Must complete all 3 rounds
    assert!(!game.is_finished, 0);

    game.is_finished = true;

    // Calculate scores
    let mut score1 = 0;
    let mut i = 0;
    while (i < 3) {
        score1 = score1 + points(&game.hand1[i]);
        i = i + 1;
    };

    let mut score2 = 0;
    let mut j = 0;
    while (j < 3) {
        score2 = score2 + points(&game.hand2[j]);
        j = j + 1;
    };

    let winner = if (score1 >= score2) game.player1 else game.player2;

    emit(GameResolved {
        game_id: object::id(game),
        winner,
        score1,
        score2,
    });

    // Transfer random card from loser to winner
    let mut generator = new_generator(r, ctx);

    if (winner == game.player1) {
        // Take from player 2 (loser)
        if (!game.deck2.is_empty()) {
            let idx = generator.generate_u64_in_range(0, game.deck2.length());
            let card = game.deck2.swap_remove(idx);
            transfer::public_transfer(card, winner);
        } else if (!game.hand2.is_empty()) {
            let idx = generator.generate_u64_in_range(0, game.hand2.length());
            let card = game.hand2.swap_remove(idx);
            transfer::public_transfer(card, winner);
        };
    } else {
        // Take from player 1 (loser)
        if (!game.deck1.is_empty()) {
            let idx = generator.generate_u64_in_range(0, game.deck1.length());
            let card = game.deck1.swap_remove(idx);
            transfer::public_transfer(card, winner);
        } else if (!game.hand1.is_empty()) {
            let idx = generator.generate_u64_in_range(0, game.hand1.length());
            let card = game.hand1.swap_remove(idx);
            transfer::public_transfer(card, winner);
        };
    };
}

// === View Functions ===

public fun get_game_state(game: &Game): (address, address, u64, bool, bool, bool) {
    (game.player1, game.player2, game.turn, game.p1_swapped, game.p2_swapped, game.is_finished)
}

public fun get_scores(game: &Game): (u64, u64) {
    let mut score1 = 0;
    let mut i = 0;
    while (i < 3) {
        score1 = score1 + points(&game.hand1[i]);
        i = i + 1;
    };

    let mut score2 = 0;
    let mut j = 0;
    while (j < 3) {
        score2 = score2 + points(&game.hand2[j]);
        j = j + 1;
    };

    (score1, score2)
}
