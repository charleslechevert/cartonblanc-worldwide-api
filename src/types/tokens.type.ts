export type Tokens = {
  access_token: string;
  refresh_token: string;
  isAdmin: boolean;
};

export type SignupResponse = Tokens & {
  team_id: number;
};
