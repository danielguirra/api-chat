import { ObjectId } from 'mongodb';

export interface User {
   _id: ObjectId | string;
   userName: string;
   email: string;
   password: string;
   timestamp: string;
   chats: string[] | undefined;
}

export interface UserToCreate {
   userName: string;
   email: string;
   password: string;
   timestamp: string;
   chats: string[] | undefined;
}