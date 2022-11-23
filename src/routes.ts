import * as bcrypt from 'bcrypt';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { DataBaseGet } from './data/get';
import { DatabasePost } from './data/post';
import { Message } from './interfaces/message';
import { validateEmail } from './validateEmail';

const saltRounds = 10;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/message", async (req, res) => {
  const chatName = req.query.idUser;
  if (!chatName || typeof chatName != 'string') return res.status(400).send({
    erro: 400,
    message: "Query chatName it's not a string"
  })
  const read = await new DataBaseGet().getMessageInChat(chatName);
  if (!read) return res.status(400).send({
    erro: 400,
    message: 'Verify chatName'
  })
  let aux: Message[] = [];
  for (let index = 0; index < read.length; index++) {
    const element = read[index];
    aux.push(element);
  }

  return res.send(aux);

});

app.post("/message", async (req, res) => {
  const message = req.query.message;
  const chat = req.query.chat;
  const userCreatorId = req.query.userId;
  if (typeof chat != 'string' || typeof message != 'string' || typeof userCreatorId != 'string')
    return res.status(400).send({
      erro: 400,
      message: "Message undefined or userCreator",
    });
  const messageBuilder: Message = {
    id: uuidv4(),
    content: message,
    authorId: userCreatorId,
    timestamp: new Date().toISOString(),
  };
  const post = await new DatabasePost().postNewMessageInChatByUser(
    messageBuilder,
    chat
  );
  if (post) return res.send(messageBuilder);
  else res.status(400).send("fon");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.query;
  if (typeof email != 'string' || typeof password != 'string') return (res.statusCode = 404);
  if (!validateEmail(email)) return (res.statusCode = 404);

  const findUserByEmail = await new DataBaseGet().getUser(email);
  if (findUserByEmail)
    if (bcrypt.compareSync(password, findUserByEmail[0].password))
      return res.send({
        id: findUserByEmail[0]._id,
        userName: findUserByEmail[0].userName,
      });
    else {
      return res.status(200).send({
        erro: 400,
        message: "email or password",
      });
    }
});

app.post("/create", async (req, res) => {
  let { email, password, userName } = req.query;
  if (typeof email != 'string' || typeof password != 'string' || typeof userName != 'string') return (res.statusCode = 404);
  if (!validateEmail(email)) return (res.statusCode = 404);

  const hash = bcrypt.hashSync(password, saltRounds);
  password = hash;
  let userBuilder: any = {
    email,
    userName,
    timestamp: new Date().toISOString(),
    password,
    chats: [],
  };

  const data = await new DatabasePost().postNewUser(userBuilder);
  if (data) {
    console.log('NEW USER ADD IN DATABASE :', userBuilder._id)
    return res.send(userBuilder)
  };
  return res.status(200).send({
    erro: 400,
    message: "Email in use",
  });
});

app.get("/listuser", async (req, res) => {
  const idUser = req.query.idUser;
  if (typeof idUser != 'string') return res.status(404).send("query idUser equal as null");
  const data = await new DataBaseGet().getUserbyId(idUser);
  if (data) {
    const datasend = await new DataBaseGet().getAllUsers();
    if (datasend) {
      return res.send(datasend);
    } else return res.status(500).send("internal server erro");
  } else {
    return res.status(400).send("not find");
  }
});

app.post("/chat/user-to-user", async (req, res) => {
  const { idUser1, idUser2 } = req.query;
  if (typeof idUser1 != 'string' || typeof idUser2 != 'string')
    return res.status(404).send("query idUser equal as null");

  const data = await new DatabasePost().postNewChatUserToUser(idUser1, idUser2);

  if (data) {
    return res.send(data);
  } else {
    return res.status(400).send("chat exits");
  }
});

app.post("/chat/group", async (req, res) => {
  const groupName = req.query.groupName;
  const userIds = req.body;
  if (typeof groupName != 'string' || !userIds) return res.status(404).send("query Name equal as null");

  const data = await new DatabasePost().postNewChatGroup(groupName, userIds);

  if (data) {
    return res.send(data);
  } else {
    return res.json(req.body);
  }
});
export default app




