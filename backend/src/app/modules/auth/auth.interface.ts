export interface TRegisterUser {
  firstName: string;
  lastName: string;
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
  firstName: string;
  lastName: string;
  provider: "google" | "facebook";
  providerId: string;
}

export interface TForgotPassword {
  email: string;
}

export interface TResetPassword {
  token: string;
  password: string;
}
