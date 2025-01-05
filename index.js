import express from 'express';
import { join } from 'path';

function main() {
    const app = express();
    const port = 3000;

    startServer(app, port);
}

// Start the server
function startServer(app, port) {
    configureMiddleware(app);
    configureRoutes(app);

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Configure middleware
function configureMiddleware(app) {
    // Serve static files from the public directory
    app.use(express.static(join(process.cwd(), 'public')));  
}

// Define routes
function configureRoutes(app) {
    app.get('/', (req, res) => {
        res.sendFile(join(process.cwd(), 'public', 'index.html'));
    });
}

main();
