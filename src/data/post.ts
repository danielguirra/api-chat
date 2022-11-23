import { MongoClient, ObjectId } from 'mongodb';

import { Message } from '../interfaces/message';
import { UserToCreate } from '../interfaces/user';
import { DataBaseClient } from './client';
import { DataBaseGet } from './get';

export class DatabasePost extends DataBaseClient {
  constructor() {
    super();
  }
  postNewChatGroup = async (name: string, idUsers: string[]) => {
    try {
      if (typeof this.db != 'string') throw new Error(`DB EQUALS UNDEFINED : ${this.db}', `)
      if (typeof this.collectionUsers != 'string') throw new Error(`collectionUsers EQUALS UNDEFINED : ${this.collectionUsers}', `)

      await this.connect();
      let chat = `${name}_group`;

      for (let index = 0; index < idUsers.length; index++) {
        const userId = idUsers[index];
        const chatx = await userverificator(userId, this.client, this.db, this.collectionUsers);
        if (chatx) {
          if (chatx.chats) {
            let chatsx = chatx.chats;
            chatsx.push(chat);
            let userUpdate = this.client
              .db(this.db)
              .collection(this.collectionUsers)
              .updateOne(
                { _id: new ObjectId(userId) },
                { $set: { chats: chatsx } }
              );
            await userUpdate;
          } else {
            let userUpdate = this.client
              .db(this.db)
              .collection(this.collectionUsers)
              .updateOne(
                { _id: new ObjectId(userId) },
                { $set: { chats: [chat] } }
              );
            await userUpdate;
          }
        }
      }

      const cursor = this.client.db(this.db).createCollection(chat);
      await cursor;
      return chat;
    } catch (error) {
      console.log(error);
    } finally {
      await this.disconnect();
    }
  };
  postNewChatUserToUser = async (userId1: string, userId2: string) => {
    try {

      if (typeof this.db != 'string') throw new Error(`DB EQUALS UNDEFINED : ${this.db}', `)
      if (typeof this.collectionUsers != 'string') throw new Error(`collectionUsers EQUALS UNDEFINED : ${this.collectionUsers}', `)

      await this.connect();

      let chat = `${userId1}_${userId2}`;
      let users = [userId1, userId2];
      for (let index = 0; index < users.length; index++) {
        const userId = users[index];
        const chatx = await userverificator(userId, this.client, this.db, this.collectionUsers);
        if (chatx) {
          if (chatx.chats) {
            let chatsx = chatx.chats;
            chatsx.push(chat);
            let userUpdate = this.client
              .db(this.db)
              .collection(this.collectionUsers)
              .updateOne(
                { _id: new ObjectId(userId) },
                { $set: { chats: chatsx } }
              );
            await userUpdate;
          } else {
            let userUpdate = this.client
              .db(this.db)
              .collection(this.collectionUsers)
              .updateOne(
                { _id: new ObjectId(userId) },
                { $set: { chats: [chat] } }
              );
            await userUpdate;
          }
        }
      }

      const cursor = this.client.db(this.db).createCollection(chat);

      await cursor;
      return chat;
    } catch (error) {
      console.log(error);
    } finally {
      await this.disconnect();
    }
  };
  /**
   *
   * @param {string} message
   * @param {string} chat
   * @returns
   */
  postNewMessageInChatByUser = async (message: Message, chatName: string) => {
    try {
      await this.connect();
      const cursor = this.client
        .db(this.db)
        .collection(chatName)
        .insertOne(message);

      await cursor;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      this.disconnect();
    }
  };
  postNewUser = async (user: UserToCreate) => {
    try {
      if (typeof this.db != 'string') throw new Error(`DB EQUALS UNDEFINED : ${this.db}', `)
      if (typeof this.collectionUsers != 'string') throw new Error(`collectionUsers EQUALS UNDEFINED : ${this.collectionUsers}', `)
      const findUserExits = await new DataBaseGet().getUser(user.email);
      if (!findUserExits) return false;
      await this.connect();
      const cursor = this.client
        .db(this.db)
        .collection(this.collectionUsers)
        .insertOne(user);

      await cursor;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      this.disconnect();
    }
  };
}

async function userverificator(userId: string, client: MongoClient, db: string, collectionUsers: string) {

  let userChatVerificator = client
    .db(db)
    .collection(collectionUsers)
    .findOne({ _id: new ObjectId(userId) });

  const chatx = await userChatVerificator;
  return chatx;
}
