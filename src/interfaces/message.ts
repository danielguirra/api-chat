import { Embed } from './embed';

export interface Message {
   id: string;
   authorId: string;
   timestamp: string;
   content?: string;
   embed?: Embed;

}