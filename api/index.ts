// This file must be in the /api folder for Vercel to detect it as a serverless function
import type {Request, Response} from 'express';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as userValidator from '../server/user/middleware';
import * as aliasValidator from '../server/alias/middleware';
import {userRouter} from '../server/user/router';
import {freetRouter} from '../server/freet/router';
import MongoStore from 'connect-mongo';
import {aliasRouter} from '../server/alias/router';
import {proliferateRouter} from '../server/proliferate/router';
import {reactionRouter} from '../server/reaction/router';
import {rejectionRouter} from '../server/rejection/router';
import {followRouter} from '../server/follow/router';
import {subBoxRouter} from '../server/sub_box/router';
import {feedRouter} from '../server/feed/router';


// Load environmental variables
dotenv.config({});

// Connect to mongoDB
const mongoConnectionUrl = process.env.MONGO_SRV;
if (!mongoConnectionUrl) {
  throw new Error('Please add the MongoDB connection SRV as \'MONGO_SRV\'');
}

const client = mongoose
  .connect(mongoConnectionUrl)
  .then(m => {
    console.log('Connected to MongoDB');
    return m.connection.getClient();
  })
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message as string}`);
    throw new Error(err.message);
  });

mongoose.connection.on('error', err => {
  console.error(err);
});

// Initalize an express app
const app = express();

// Set the port
app.set('port', process.env.PORT || 3000);

// Log requests in the terminal
app.use(logger('dev'));

// Parse incoming requests with JSON payloads ('content-type: application/json' in header)
app.use(express.json());

// Parse incoming requests with urlencoded payloads ('content-type: application/x-www-form-urlencoded' in header)
app.use(express.urlencoded({extended: false}));

// Initialize cookie session
// https://www.npmjs.com/package/express-session#options
app.use(session({
  secret: '61040', // Should generate a real secret
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: client,
    dbName: 'sessions',
    autoRemove: 'interval',
    autoRemoveInterval: 10 // Minutes
  })
}));

// This makes sure that if a user is logged in, they still exist in the database
app.use(userValidator.isCurrentSessionUserExists);
app.use(aliasValidator.isCurrentSessionAliasExists)

// Add routers from routes folder
app.use('/api/users', userRouter);
app.use('/api/freets', freetRouter);
app.use('/api/users/alias', aliasRouter);
app.use('/api/proliferate', proliferateRouter);
app.use('/api/reactions', reactionRouter);
app.use('/api/rejections', rejectionRouter);
app.use('/api/follows', followRouter);
app.use('/api/sub_box', subBoxRouter);
app.use('/api/feed', feedRouter);


// Catch all the other routes and display error message
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Page not found'
  });
});

// Create server to listen to request at specified port
const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log(`Express server running at http://localhost:${app.get('port') as number}`);
});
