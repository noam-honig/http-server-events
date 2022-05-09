import { useEffect, useState } from "react";
import { listenToServerEvents } from "./listen-to-server-events";

function App() {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const sendMessage = async () => {
    await fetch('/api/send', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newMessage })
    });
    setNewMessage('');
  }
  useEffect(() => listenToServerEvents((process.env['NODE_ENV'] !== "production" ? 'http://localhost:3002' : '') + '/api/stream', {
    onMessage: message => setMessages(m => [...m, message])
  }), [])

  return (
    <div className="App">
      <h3>Open multiple browsers and see the messages work</h3>
      <ul>
        {messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <input value={newMessage} onChange={e => setNewMessage(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>


    </div>
  );
}

export default App;
