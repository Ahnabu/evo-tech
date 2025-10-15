import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { email: string; role: string; _id: string },
  secret: Secret,
  expiresIn: string
): string => {

  // @ts-ignore
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
