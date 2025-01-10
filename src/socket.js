import { io } from 'socket.io-client';

// Replace with your server's URL if it's running on a different host or port
const socket = io('http://localhost:3002');

export default socket;
