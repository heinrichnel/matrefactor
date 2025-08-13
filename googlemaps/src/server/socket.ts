import { Server } from "socket.io";
import http from "http";

// Socket.io singleton instance
let io: Server;

export const initializeSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  interface DeliveryEvent {
    "join:delivery": (deliveryId: string) => void;
    disconnect: () => void;
  }

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join:delivery", (deliveryId: string) => {
      socket.join(`delivery:${deliveryId}`);
      console.log(`Client ${socket.id} joined delivery:${deliveryId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export { io };
