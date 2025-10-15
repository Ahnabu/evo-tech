export interface TRegisterUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
  newsletterOptIn?: boolean;
}

export interface TLoginUser {
  email: string;
  password: string;
}

export interface TOAuthUser {
  email: string;
  firstname: string;
  lastname: string;
  provider: "google" | "facebook";
  providerId: string;
}
