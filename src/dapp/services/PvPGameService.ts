import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

export interface MatchRequest {
  id: string;
  challenger: string;
  opponent: string;
  createdAtEpoch: number;
}

export interface GameState {
  id: string;
  player1: string;
  player2: string;
  turn: number;
  p1Swapped: boolean;
  p2Swapped: boolean;
  isFinished: boolean;
}

export class PvPGameService {
  private packageId: string;
  private randomObjectId: string;

  constructor(packageId: string, randomObjectId: string = '0x8') {
    this.packageId = packageId;
    this.randomObjectId = randomObjectId;
  }

  /**
   * Create a match request to challenge another player
   */
  createMatchRequest(opponentAddress: string, cardIds: string[]): Transaction {
    const tx = new Transaction();
    
    // Transfer cards to the transaction
    const cardObjects = cardIds.map(id => tx.object(id));
    
    tx.moveCall({
      target: `${this.packageId}::game::create_match_request`,
      arguments: [
        tx.pure.address(opponentAddress),
        tx.makeMoveVec({ elements: cardObjects }),
      ],
    });

    return tx;
  }

  /**
   * Accept a match request
   */
  acceptMatchRequest(requestId: string, cardIds: string[]): Transaction {
    const tx = new Transaction();
    
    // Transfer cards to the transaction
    const cardObjects = cardIds.map(id => tx.object(id));
    
    tx.moveCall({
      target: `${this.packageId}::game::accept_match_request`,
      arguments: [
        tx.object(requestId),
        tx.makeMoveVec({ elements: cardObjects }),
        tx.object(this.randomObjectId),
      ],
    });

    return tx;
  }

  /**
   * Reject a match request
   */
  rejectMatchRequest(requestId: string): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::game::reject_match_request`,
      arguments: [tx.object(requestId)],
    });

    return tx;
  }

  /**
   * Cancel a match request (only challenger can cancel)
   */
  cancelMatchRequest(requestId: string): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::game::cancel_match_request`,
      arguments: [tx.object(requestId)],
    });

    return tx;
  }

  /**
   * Play turn and optionally swap card
   */
  playTurnAndSwap(gameId: string, shouldSwap: boolean): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::game::play_turn_and_swap`,
      arguments: [
        tx.object(gameId),
        tx.pure.bool(shouldSwap),
        tx.object(this.randomObjectId),
      ],
    });

    return tx;
  }

  /**
   * Resolve the game and determine winner
   */
  resolveGame(gameId: string): Transaction {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${this.packageId}::game::resolve_game`,
      arguments: [
        tx.object(gameId),
        tx.object(this.randomObjectId),
      ],
    });

    return tx;
  }

  /**
   * Get pending match requests for a user
   */
  async getPendingRequests(
    client: SuiClient,
    userAddress: string
  ): Promise<MatchRequest[]> {
    try {
      // Query for MatchRequest objects where user is challenger or opponent
      const { data } = await client.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: `${this.packageId}::game::MatchRequest`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return data
        .filter((obj) => obj.data?.content?.dataType === 'moveObject')
        .map((obj: any) => {
          const fields = obj.data.content.fields;
          return {
            id: obj.data.objectId,
            challenger: fields.challenger,
            opponent: fields.opponent,
            createdAtEpoch: parseInt(fields.created_at_epoch),
          };
        });
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  }

  /**
   * Get active games for a user
   */
  async getActiveGames(
    client: SuiClient,
    userAddress: string
  ): Promise<GameState[]> {
    try {
      const { data } = await client.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: `${this.packageId}::game::Game`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      return data
        .filter((obj) => obj.data?.content?.dataType === 'moveObject')
        .map((obj: any) => {
          const fields = obj.data.content.fields;
          return {
            id: obj.data.objectId,
            player1: fields.player1,
            player2: fields.player2,
            turn: parseInt(fields.turn),
            p1Swapped: fields.p1_swapped,
            p2Swapped: fields.p2_swapped,
            isFinished: fields.is_finished,
          };
        });
    } catch (error) {
      console.error('Error fetching active games:', error);
      return [];
    }
  }

  /**
   * Subscribe to game events
   */
  async subscribeToEvents(
    client: SuiClient,
    eventType: 'MatchCreated' | 'MatchAccepted' | 'CardRevealed' | 'GameResolved',
    callback: (event: any) => void
  ): Promise<() => void> {
    const unsubscribe = await client.subscribeEvent({
      filter: {
        MoveEventType: `${this.packageId}::game::${eventType}`,
      },
      onMessage: (event) => {
        callback(event.parsedJson);
      },
    });

    return unsubscribe;
  }
}

export default PvPGameService;
