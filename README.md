# http server events full stack demo 
This repo demos a full stack app that uses http server side events and consumes them in react.

The mono repo structure is inspired by [this tutorial](https://remult.dev/tutorials/react/)

## To run this code
```
npm run dev
```

## Live sample
see [Live sample on heroku]()

## How to use:
1. Install `@microsoft/fetch-event-source`
   ```
   npm i @microsoft/fetch-event-source
   ```
2. Copy the [server-events.ts](https://github.com/noam-honig/http-server-events/blob/master/src/server/server-events.ts) file - that is used on the server to register the listeners and to send messages to the listeners 
3. In the server's `index.ts`, allow users to register:
   ```ts
   const serverEvents = new ServerEventsController();
   app.get('/api/stream', (req, res) => {
       serverEvents.subscribe(req, res,
           (message, type) => true //return true to send the message - use this arrow function to filter the messages based on the user or other rules
       );
   });
   ```
   * It's important to call this code before the call to `compression`, since `compression` breaks server side events
   * It's important to call this code after the call to `expressjwt` to get the `user`/`auth` info.

4. To send events on the server, add to the `index.ts`:
   ```ts
   app.post('/api/send', (req, res) => {
      serverEvents.SendMessage(req.body.newMessage);
      res.sendStatus(200);
   });
   ```
5. To consume events in the `front-end` copy the [listen-to-server-events](https://github.com/noam-honig/http-server-events/blob/7a15781dde06727279b8053bf61785895bad14c0/src/listen-to-server-events.ts) file that is used to listen to the server events 
:
6. In your code, register to events using the following code:
   ```ts
   useEffect(() => listenToServerEvents((process.env['NODE_ENV'] !== "production" ? 'http://localhost:3002' : '') + '/api/stream', {
    onMessage: message => setMessages(m => [...m, message])
   }), [])
   ```
   * You can send the `jwtToken` to it, to authenticate the user.
   * the `listenToServerEvents` returns an unsubscribe method that can be called to unsubscribe from the server events.


## Important Note
Http server side events do not work well with the create react app built in proxy, so this demo uses `cors` for dev on the server.