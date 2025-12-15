import React, { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://guts-notify.n6t.online';
const API_URL = "https://guts-notify.n6t.online/api/v1";
const API_KEY = '9a16829f-55de-4a64-b758-0f1db872b42e';

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString + 'Z'); // Force UTC interpretation
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 172800) return 'yesterday';
  return date.toLocaleDateString();
}
function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(() => localStorage.getItem('private_key'));
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'connecting' | 'error' | 'disconnected'>('disconnected');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Step 1: Get private key from backend
  const getPrivateKey = async (username: string) => {
    try {
      setError(null);
      const res = await axios.post(
        `${API_URL}/notifications/get-private-key?api_key=${API_KEY}&username=${encodeURIComponent(username)}`
      );
      setPrivateKey(res.data.private_key);
      localStorage.setItem('private_key', res.data.private_key);
      localStorage.setItem('username', username);
      return res.data.private_key;
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to get private key');
      return null;
    }
  };

  // Step 2: Connect to Socket.IO with private key
  const connectSocket = () => {
    if (!privateKey || !username) {
      setError('Missing private key or username');
      return;
    }
    if (socket) {
      socket.disconnect();
    }
    setConnectionStatus('connecting');
    setError(null);

    const newSocket = io(SOCKET_URL, {
      auth: { private_key: privateKey },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    newSocket.onAny((event, ...args) => {
      console.log('[Socket.IO event]', event, args);
    });

    newSocket.on('connect', () => {
      setConnected(true);
      setConnectionStatus('connecting'); // Stay in connecting until authenticated
      setError(null);
    });

    newSocket.on('connected', (data) => {
      setAuthenticated(true);
      setConnectionStatus('success');
      setConnected(true);
      newSocket.emit('get_messages', { limit: 50 });
    });

    newSocket.on('new_message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    newSocket.on('messages_loaded', (data) => {
      setMessages(data.messages || []);
    });

    newSocket.on('message_sent', () => {
      setIsLoading(false);
      setMessage('');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      setAuthenticated(false);
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      setError(`Connection failed: ${error.message}`);
      setConnectionStatus('error');
      setConnected(false);
      setAuthenticated(false);
    });

    newSocket.on('error', (err) => {
      setError(err.message || 'Socket.IO error');
      setIsLoading(false);
    });

    setSocket(newSocket);
  };

  // Disconnect socket
  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setConnected(false);
    setAuthenticated(false);
    setConnectionStatus('disconnected');
  };

  // Send a message via Socket.IO
  const sendMessage = async () => {
    if (!socket || !message.trim() || !authenticated) return;
    setIsLoading(true);
    setError(null);
    socket.emit('send_message', { message });
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Message send timeout');
      }
    }, 10000);
  };

  // Refresh messages via Socket.IO
  const refreshMessages = () => {
    if (socket && authenticated) {
      socket.emit('get_messages', { limit: 50 });
    }
  };

  // Clear stored data and reset
  const resetApp = () => {
    localStorage.removeItem('private_key');
    localStorage.removeItem('username');
    disconnectSocket();
    setPrivateKey(null);
    setUsername('');
    setMessages([]);
    setError(null);
  };

  // UI to get username and private key
  if (!privateKey || !username) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Enter Username to Join</h2>
        <div style={{ marginBottom: 20 }}>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter a username"
            style={{ padding: '10px', marginRight: '10px', fontSize: '16px' }}
          />
          <button
            onClick={() => getPrivateKey(username)}
            disabled={!username.trim()}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: !username.trim() ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !username.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            Get Private Key
          </button>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 20 }}>{error}</div>}
        <div style={{ marginTop: 20, fontSize: 14, color: '#555' }}>
          <strong>Public API Key:</strong> <code>{API_KEY}</code>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      minHeight: '100vh', 
      position: 'relative', 
      background: '#f8f9fa'
    }}>
      <h1>📱 Socket.IO  App 1</h1>

      <div style={{
        marginBottom: 16,
        padding: 10,
        background: '#f1f3f4',
        borderRadius: 6,
        fontSize: 14,
        color: '#333'
      }}>
        <div>
          <strong>Public API Key:</strong> <code>{API_KEY}</code>
        </div>
        <div>
          <strong>Private Key:</strong> <code>{privateKey}</code>
        </div>
        <div>
          <strong>Username:</strong> {username}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        {!connected ? (
          <button
            onClick={connectSocket}
            disabled={connectionStatus === 'connecting'}
            style={{
              padding: '12px 24px',
              backgroundColor: connectionStatus === 'connecting' ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: connectionStatus === 'connecting' ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect to Socket.IO Server'}
          </button>
        ) : (
          <button
            onClick={disconnectSocket}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Disconnect
          </button>
        )}
        <button
          onClick={resetApp}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Reset App
        </button>
      </div>

      <div style={{
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: 
          connectionStatus === 'success' ? '#d4edda' : 
          connectionStatus === 'connecting' ? '#cce7ff' :
          connectionStatus === 'error' ? '#f8d7da' : '#f8d7da',
        color: 
          connectionStatus === 'success' ? '#155724' : 
          connectionStatus === 'connecting' ? '#004085' :
          connectionStatus === 'error' ? '#721c24' : '#721c24',
        border: `1px solid ${
          connectionStatus === 'success' ? '#c3e6cb' : 
          connectionStatus === 'connecting' ? '#99d6ff' :
          connectionStatus === 'error' ? '#f5c6cb' : '#f5c6cb'
        }`,
        borderRadius: '4px'
      }}>
        {connectionStatus === 'success'
          ? '🟢 Connected & Authenticated'
          : connectionStatus === 'connecting'
          ? '🔵 Connecting...'
          : connectionStatus === 'error'
          ? '🔴 Connection Error'
          : '🔴 Disconnected'}
      </div>

      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#721c24' }}>✕</button>
        </div>
      )}

      {/* Messages area */}
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        marginBottom: '80px',
        maxHeight: '400px', 
        overflowY: 'auto' 
      }}>
        <h3>💬 Real-time Messages ({messages.length})</h3>
        {messages.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No messages yet. {authenticated ? 'Send a message below!' : 'Please authenticate first.'}
          </p>
        ) : (
          <div>
            {messages.map((msg, index) => {
              const isOwn = msg.sender === username;
              return (
                <div
                  key={`${msg.id}-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    margin: '8px 0'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      background: isOwn ? '#007bff' : '#fff',
                      color: isOwn ? '#fff' : '#222',
                      border: isOwn ? '1px solid #007bff' : '1px solid #dee2e6',
                      borderRadius: '12px',
                      padding: '5px 8px',
                      textAlign: isOwn ? 'right' : 'left',
                      boxShadow: '0 0.5px 0.5px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', marginBottom: 4 }}>
                      <span>{msg.sender}</span>
                      <span style={{ fontSize: '11px', color: isOwn ? '#e0e0e0' : '#888', marginLeft: 12 }}>
                        {timeAgo(msg.timestamp)}
                      </span>
                    </div>
                    <div>{msg.message}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Fixed input bar at the bottom */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100%',
          background: '#fff',
          borderTop: '1px solid #ddd',
          zIndex: 100,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '7px',
            padding: '12px 20px 12px 20px', // top right bottom left
            width: '100%',
            boxSizing: 'border-box',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            style={{
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              flex: 1,
              minWidth: 0,
              width: '100%',
              boxSizing: 'border-box',
              maxWidth: '100vw',
            }}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            disabled={!authenticated}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || isLoading || !authenticated}
            style={{
              padding: '12px 24px',
              backgroundColor: (!message.trim() || isLoading || !authenticated) ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: (!message.trim() || isLoading || !authenticated) ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
          >
            {isLoading ? 'Sending...' : '📡 Send'}
          </button>
          <button
            onClick={refreshMessages}
            disabled={!authenticated}
            style={{
              padding: '12px 16px',
              backgroundColor: !authenticated ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: !authenticated ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
          >
            🔄
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <div><strong>App 1:</strong> Socket.IO only communication</div>
        <div><strong>Socket:</strong> {SOCKET_URL}</div>
        <div><strong>Key:</strong> {API_KEY.substring(0, 8)}***</div>
        <div><strong>Status:</strong> {connectionStatus}</div>
        <div><strong>Mode:</strong> ⚡ Real-time only (no HTTP sending)</div>
      </div>
    </div>
  );
}

export default App;