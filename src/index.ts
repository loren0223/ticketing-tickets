import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';

const startApp = async () => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY must be defined');
  }
  console.log(`JWT_SECRET_KEY = ${process.env.JWT_SECRET_KEY}`);

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  console.log(`MONGO_URI = ${process.env.MONGO_URI}`);

  try {
    await natsWrapper.connect('ticketing', 'asdfkj', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to MongoDb');

    app.listen(3000, () => {
      console.log('@@@ Listening on port 3000 @@@');
    });
  } catch (err) {
    console.error(err);
  }
};

startApp();
