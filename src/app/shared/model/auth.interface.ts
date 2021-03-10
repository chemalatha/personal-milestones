export interface AuthState {
  auth: boolean;
  user?: {
    email: string,
    firstname: string,
    lastname?: string
  };
  token?: string;
}
