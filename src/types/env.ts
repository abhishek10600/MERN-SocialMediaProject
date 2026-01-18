export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
export const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY!;

if (!accessTokenSecret || !accessTokenExpiry) {
  throw new Error("Missing Access Token Secret or Missing Access Token Expiry");
}
