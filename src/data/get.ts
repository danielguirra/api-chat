import { ObjectId } from 'mongodb';

import { Message } from '../interfaces/message';
import { DataBaseClient } from './client';

export class DataBaseGet extends DataBaseClient {
  constructor() {
    super();
  }

  getMessageInChat = async (chatId: string) => {
    try {
      if (typeof this.db != 'string') throw new Error(`DB EQUALS UNDEFINED : ${this.db}', `)
      if (typeof this.collectionUsers != 'string') throw new Error(`collectionUsers EQUALS UNDEFINED : ${this.collectionUsers}', `)

      await this.connect();
      const cursor = this.client
        .db(this.db)
        .collection(chatId).find()

      const messages: any = await cursor.toArray();

      if (messages.length <= 0) {
        return false
      } else {
        let messageOk: Message[] = messages
        return messageOk
      }


    } catch (error) {
      console.log(error);
    } finally {
      this.disconnect();
    }
  };

  getUser = async (email: string) => {
    try {
      if (typeof this.db != 'string') throw new Error(`DB EQUALS UNDEFINED : ${this.db}', `)
      if (typeof this.collectionUsers != 'string') throw new Error(`collectionUsers EQUALS UNDEFINED : ${this.collectionUsers}', `)
      await this.connect();
      const cursor = this.client
        .db(this.db)
        .collection(this.collectionUsers)
        .find({ email: email });

      return await cursor.toArray();
    } catch (error) {
      console.log(error);
    } finally {
      this.disconnect();
    }
  };

  getUserbyId = async (id: string) => {
    try {
      if (typeof this.db != 'string') throw new Error(`DB EQUALS UNDEFINED : ${this.db}', `)
      if (typeof this.collectionUsers != 'string') throw new Error(`collectionUsers EQUALS UNDEFINED : ${this.collectionUsers}', `)
      await this.connect();
      const cursor = this.client
        .db(this.db)
        .collection(this.collectionUsers)
        .find({ _id: new ObjectId(id) });

      return await cursor.toArray();
    } catch (error) {
      console.log(error);
    } finally {
      this.disconnect();
    }
  };

  getAllUsers = async () => {
    try {
      if (typeof this.db != 'string') throw new Error(`DB EQUALS UNDEFINED : ${this.db}', `)
      if (typeof this.collectionUsers != 'string') throw new Error(`collectionUsers EQUALS UNDEFINED : ${this.collectionUsers}', `)
      await this.connect();
      const cursor = this.client.db(this.db).collection(this.collectionUsers).find();
      return await cursor.toArray();
    } catch (error) {
      console.log(error);
    } finally {
      this.disconnect();
    }
  };
}

