import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:your_port');  // Replace with your server URL

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');  // Default room
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Receive messages from the server
    socket.on('chat message', (msg) => {
      setMessages([...messages, msg]);
    });

    // Cleanup function to disconnect on unmount
    return () => socket.disconnect();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', { username, room, message });
      setMessage(''); // Clear message input after sending
    }
  };

  return (
    <div className="chat-container bg-gray-200 p-4 rounded-lg shadow-md">
      <h2>{room} Chat Room</h2>
      <ul className="chat-messages list-none p-0 overflow-y-auto h-80">
        {messages.map((msg, index) => (
          <li key={index} className="flex items-center py-2 px-4 border-b border-gray-300">
            <b>{msg.username}:</b> <span className="ml-2">{msg.message}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage} className="flex mt-4">
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
