import express from 'express';
import { ServerEventsController } from './server-events';
import cors from 'cors';


const serverEvents = new ServerEventsController();
let app = express();
if (process.env['NODE_ENV'] !== "production")
    app.use(cors({}));

// 1. Register this endpoint, before the call to 'compression' or it'll break
// 2. Register this endpoint, after the call to expressjwt on order to get the auth/user property of the request set based on the current user.
app.get('/api/stream', (req, res) => {
    serverEvents.subscribe(req, res,
        (message, type) => true //return true to send the message - use this arrow function to filter the messages based on the user or other rules
    );
});

app.use(express.json());
app.post('/api/send', (req, res) => {
    serverEvents.SendMessage(req.body.newMessage);
    res.sendStatus(200);
});

app.use(express.static('build'));
app.use('/*', async (req, res) => {
    res.sendFile(process.cwd() + '/build/index.html');
});
app.listen(process.env.PORT || 3002, () => console.log("Server started"));