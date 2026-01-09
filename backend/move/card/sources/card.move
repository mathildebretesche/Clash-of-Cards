module card::card;

use std::string::{utf8, String};
use sui::event::emit;
use sui::package;
use sui::display;

// === Structs ===

public struct Card has key, store {
    id: UID,
    game: String,
    name: String,
    img: String,
    label: String,
    points: u64,
}

public struct CARD has drop {}

public struct CardInfo has copy, drop, store {
    game: String,
    name: String,
    img: String,
    label: String,
    points: u64,
}

// === Events ===

public struct EventCardCreated has copy, drop {
    card_id: ID,
}

// === Init ===

fun init(otw: CARD, ctx: &mut TxContext) {
    let keys = vector[
        utf8(b"name"),
        utf8(b"image_url"),
        utf8(b"description"),
        utf8(b"label"),
        utf8(b"points"),
    ];

    let values = vector[
        utf8(b"{name}"),
        utf8(b"{img}"),
        utf8(b"Card {name} with {points} points"),
        utf8(b"{label}"),
        utf8(b"{points}"),
    ];

    let publisher = package::claim(otw, ctx);

    let mut display = display::new_with_fields<Card>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display::update_version(&mut display);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}

// === Public Functions ===

#[allow(lint(self_transfer))]
public fun create(
    name: String,
    img: String,
    label: String,
    points: u64,
    ctx: &mut TxContext
) {
    let card = Card {
        id: object::new(ctx),
        game: utf8(b"Game Card"),
        name,
        img,
        label,
        points,
    };

    emit(EventCardCreated {
        card_id: object::id(&card),
    });

    transfer::transfer(card, ctx.sender());
}

public(package) fun mint(
    name: String,
    img: String,
    label: String,
    points: u64,
    ctx: &mut TxContext
): Card {
    Card {
        id: object::new(ctx),
        game: utf8(b"Game Card"),
        name,
        img,
        label,
        points,
    }
}

// === Public-View Functions ===

public fun game(card: &Card): String {
    card.game
}

public fun name(card: &Card): String {
    card.name
}

public fun img(card: &Card): String {
    card.img
}

public fun label(card: &Card): String {
    card.label
}

public fun points(card: &Card): u64 {
    card.points
}

public fun card_info(card: &Card): CardInfo {
    CardInfo {
        game: card.game,
        name: card.name,
        img: card.img,
        label: card.label,
        points: card.points,
    }
}
