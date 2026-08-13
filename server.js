const app = require('./app.js');
const connectToDatabase = require('./Database/Mongo.js');
const port = process.env.PORT || 4021;

let server;

const startServer = async () => {
    try {
        await connectToDatabase();
        server = app.listen(port, () => {
            console.log(`Server is up and running on ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database. Server not started.');
    }
};

const gracefulShutdown = (signal) => {
    if (server) {
        server.close(() => {
            console.log(`[Server] HTTP server closed gracefully on ${signal}`);
            if (signal === 'SIGUSR2') {
                process.kill(process.pid, 'SIGUSR2');
            } else {
                process.exit(0);
            }
        });
    } else {
        if (signal === 'SIGUSR2') {
            process.kill(process.pid, 'SIGUSR2');
        } else {
            process.exit(0);
        }
    }
};

process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();

