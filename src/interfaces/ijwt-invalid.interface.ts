export interface IJwtInvalid {
  name: string;
  message: string;
  expiredAt?: string;
}