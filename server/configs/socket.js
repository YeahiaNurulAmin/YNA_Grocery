import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer, allowedOrigins) => {
    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        },
    });

    io.on("connection", (socket) => {
        socket.on("join_seller", () => {
            socket.join("seller_room");
        });
    });

    return io;
};

export const getIO = () => {
    return io;
};

export const emitOrderChange = (data) => {
    if (io) {
        io.emit("orders_updated", data);
        if (data.type === "NEW_ORDER") {
            io.emit("new_order", data.order);
        }
    }
};
