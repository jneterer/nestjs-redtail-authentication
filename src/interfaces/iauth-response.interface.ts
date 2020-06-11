import { AxiosResponse } from 'axios';

export interface IAuthResponse extends AxiosResponse {
  data: IAuthData;
}

export interface IAuthData {
  APIKey: string;
  CID: number;
  DatabaseID: number;
  Message: string;
  Name: string;
  ReturnURL: string;
  Status: number;
  UserID: number;
  UserKey: string;
}