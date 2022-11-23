import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config();


export class DataBaseClient {
  private uri = process.env.DATABASE_URI
  public db = process.env.DB_NAME
  public collectionUsers = process.env.COLLECTION_USERS
  public client: MongoClient;

  connect = async () => {
    if (this.uri) {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
    } else {
      console.log('URI_DATABASE EQUALS UNDEFINED :', this.uri)
    }
  };

  disconnect = async () => {
    if (this.uri) {
      this.client = new MongoClient(this.uri);
      await this.client.close();
    } else {
      console.log('URI_DATABASE EQUALS UNDEFINED :', this.uri)
    }
  };
}


