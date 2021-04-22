import { IUser } from './IUser';

export interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
  author: IUser;
}
