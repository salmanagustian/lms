export interface ILoginPayload {
  userId: number;
  email: string
}

export interface ILoggedUser {
  userId: number;
  memberId?: number;
  email: string;
}