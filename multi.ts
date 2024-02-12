import cluster from 'node:cluster';
import os from 'os';
import http from 'http';

const numProcesses = os.cpus().length;

interface Message {
    type: string;
    data: {
        res: http.ServerResponse<http.IncomingMessage>;
        req: http.IncomingMessage;
    }
}

// Master Process
if (cluster.isMaster) {
    // Fork worker processes
    for (let i = 0; i < numProcesses; i++) {
        cluster.fork();
    }

    // Create load balancer
    const balancer = http.createServer((req, res) => {
        const worker = Object.values(cluster.workers || {})[0]; // Implement round-robin logic here
        if (worker) {
            // Forward the request to the selected worker
            worker.send({ type: 'request', data: { req, res } });
        } else {
            res.writeHead(503);
            res.end('Service Unavailable');
        }
    });

    balancer.listen(4000, () => {
        console.log('Load balancer is listening on port 4000');
    });

    // Handle messages from workers
    cluster.on('message', (worker, message) => {
        if (message.type === 'response') {
            console.log(worker)
            // Forward the response from a worker to the client
            const { res, responseData } = message.data;
            res.writeHead(200);
            res.end(responseData);
        }
    });
} else {
    // Worker Process
    const server = http.createServer((req, res) => {
        // Process the request
        // Send response back to the client
        console.log(req);
        res.writeHead(200);
        res.end('Hello from worker');
    });

    server.listen(0, () => {
        // Send message to master to notify the port the worker is listening on
        (<any> process).send({ type: 'ready', data: 4001 });
    });

    // Handle messages from the master
    process.on('message', (message: Message) => {
        if (message.type === 'request') {
            // Handle request forwarded by the load balancer
            // Process the request and send the response back to the master
            const { req, res } = message.data;
            // Process the request
            // Send response back to the master
            console.log(req);
            (<any> process).send({ type: 'response', data: { res, responseData: 'Response from worker' } });
        }
    });
}
