import { Exclude } from "class-transformer";

export class SanitizedResponse {
  @Exclude()
  APIKey: string;
  @Exclude()
  CID: string;
  @Exclude()
  DatabaseID: string;
  @Exclude()
  Message: string;
  @Exclude()
  Name: string;
  @Exclude()
  Status: string;
  @Exclude()
  UserID: string;
  @Exclude()
  UserKey: string;

  constructor(partial: Partial<SanitizedResponse>) {
    Object.assign(this, partial);
  }

}