// player.dto.ts
export class CreatePlayerDto {
  readonly name: string;
  readonly team_id: number;
}

export class UpdatePlayerDto {
  readonly name: string;
  readonly id: number;
}
