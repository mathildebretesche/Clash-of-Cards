import { Card } from '../../types/Card';

export interface GameState {
  turn: number;
  player_hp: number;
  ai_hp: number;
  player_hand: Card[];
  ai_hand: Card[]; // In a real scenario, we might hide this, but for practice/AI analysis we might send it
  player_board: Card[];
  ai_board: Card[];
  mana_player: number;
  mana_ai: number;
  history: GameAction[];
}

export interface GameAction {
  action_type: 'play_card' | 'attack' | 'end_turn';
  card_id?: string;
  target_id?: string;
  confidence?: number;
  explanation?: string;
}

export class NimbusService {
  private static API_URL = 'https://api.nimbus.ai/agents'; // Placeholder
  private static API_KEY = 'PLACEHOLDER_KEY'; // Placeholder
  private static AGENT_ID = 'training-agent-v1';

  static async getAgentAction(gameState: GameState, difficulty: string, style: string): Promise<GameAction> {
    console.log(`[NimbusService] Requesting action for Difficulty: ${difficulty}, Style: ${style}`);
    
    // MOCK RESPONSE FOR DEVELOPMENT (Remove when real API key is available)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockAIStrategy(gameState, difficulty, style));
      }, 1500); // Simulate network delay
    });

    /* REAL IMPLEMENTATION
    try {
      const response = await fetch(`${this.API_URL}/${this.AGENT_ID}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          state: gameState,
          difficulty: difficulty,
          style: style
        })
      });

      if (!response.ok) {
        throw new Error(`Nimbus API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.action;
    } catch (error) {
      console.error('[NimbusService] Error:', error);
      // Fallback to basic logic if API fails
      return this.mockAIStrategy(gameState, difficulty, style);
    }
    */
  }

  private static mockAIStrategy(state: GameState, difficulty: string, style: string): GameAction {
    // Simple heuristic for mock AI
    const playableCards = state.ai_hand.filter(c => parseInt(c.points) <= state.mana_ai);
    
    if (playableCards.length > 0) {
      // Pick best card based on points
      const bestCard = playableCards.sort((a, b) => parseInt(b.points) - parseInt(a.points))[0];
      return {
        action_type: 'play_card',
        card_id: bestCard.name, // Assuming name is ID for now
        confidence: 0.85,
        explanation: `I am playing ${bestCard.label} because it offers the best value for my mana in this ${style} strategy.`
      };
    }

    return {
      action_type: 'end_turn',
      confidence: 0.9,
      explanation: "I have no playable cards, so I will end my turn and save mana."
    };
  }
}
