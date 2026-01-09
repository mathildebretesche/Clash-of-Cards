import { Card } from '../../types/Card';
import { NimbusService, GameState, GameAction } from './NimbusService';

export class GameEngine {
  private state: GameState;
  private difficulty: string;
  private style: string;
  private playerDeck: Card[];
  private aiDeck: Card[];

  constructor(playerDeck: Card[], aiDeck: Card[], difficulty: string, style: string) {
    this.playerDeck = [...playerDeck];
    this.aiDeck = [...aiDeck];
    this.difficulty = difficulty;
    this.style = style;
    this.state = this.initializeState();
  }

  private initializeState(): GameState {
    // Shuffle decks
    const shuffledPlayerDeck = [...this.playerDeck].sort(() => Math.random() - 0.5);
    const shuffledAiDeck = [...this.aiDeck].sort(() => Math.random() - 0.5);
    
    // Deal initial hands
    const playerHand = shuffledPlayerDeck.slice(0, 3);
    const aiHand = shuffledAiDeck.slice(0, 3);

    return {
      turn: 1,
      player_hp: 20,
      ai_hp: 20,
      player_hand: playerHand,
      ai_hand: aiHand,
      player_board: [],
      ai_board: [],
      mana_player: 1,
      mana_ai: 1,
      history: []
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public async playTurn(playerAction: GameAction): Promise<{ newState: GameState, aiAction?: GameAction }> {
    // 1. Apply Player Action
    this.applyAction(playerAction, 'player');

    // Check win condition
    if (this.checkGameOver()) return { newState: this.state };

    // 2. AI Turn
    // Simulate AI thinking time handled in UI or Service
    const aiAction = await NimbusService.getAgentAction(this.state, this.difficulty, this.style);
    this.applyAction(aiAction, 'ai');

    // 3. End of Round / Upkeep
    this.state.turn++;
    this.state.mana_player = Math.min(10, this.state.turn);
    this.state.mana_ai = Math.min(10, this.state.turn);
    
    // Draw cards (mock)
    // In a real engine we'd pop from a deck state
    
    return { newState: this.state, aiAction };
  }

  private applyAction(action: GameAction, actor: 'player' | 'ai') {
    this.state.history.push(action);

    if (action.action_type === 'play_card' && action.card_id) {
      if (actor === 'player') {
        const cardIndex = this.state.player_hand.findIndex(c => c.name === action.card_id);
        if (cardIndex !== -1) {
          const card = this.state.player_hand.splice(cardIndex, 1)[0];
          this.state.player_board.push(card);
          // Simple rule: playing a card deals damage equal to points immediately (Arcade style)
          const damage = parseInt(card.points) || 0;
          this.state.ai_hp -= damage;
        }
      } else {
        const cardIndex = this.state.ai_hand.findIndex(c => c.name === action.card_id);
        if (cardIndex !== -1) {
          const card = this.state.ai_hand.splice(cardIndex, 1)[0];
          this.state.ai_board.push(card);
          const damage = parseInt(card.points) || 0;
          this.state.player_hp -= damage;
        }
      }
    }
    // Handle other actions like 'attack' if we had board persistence
  }

  public checkGameOver(): 'player' | 'ai' | null {
    if (this.state.ai_hp <= 0) return 'player';
    if (this.state.player_hp <= 0) return 'ai';
    return null;
  }
}
