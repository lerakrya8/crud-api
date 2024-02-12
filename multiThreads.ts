import cluster from 'node:cluster';
import os from 'os';
import http from 'http';
import { handler } from './app';
import { Mutex } from './src/mutex';
import { DATABASE } from './src/database/users';

const mutex = new Mutex();
let numOfWorker = 0;

const numProcesses = os.cpus().length;

interface  Message {
    type: String,
    data: {
        req: Request
        res: http.ServerResponse<http.IncomingMessage>
    }
}


if(cluster.isPrimary) {
    for (let i = 0; i < numProcesses; i++) {
        cluster.fork();
    }

    for (const id in cluster.workers) {
        cluster.workers[id]?.send(DATABASE);
    }


async function onRequest(client_req: http.IncomingMessage, client_res: http.ServerResponse<http.IncomingMessage>) {
  console.log('serve: ' + client_req.url);

  await mutex.lock();
  if (numOfWorker == numProcesses) {
    numOfWorker = 1;
  }

  var options = {
    hostname: 'localhost',
    port: 4000 + numOfWorker,
    path: client_req.url,
    method: client_req.method,
    headers: client_req.headers
  };

  numOfWorker += 1;
  mutex.release();

  console.log(options.port);

  var proxy = http.request(options, function (res) {
    client_res.writeHead(res.statusCode || 200, res.headers) // statusCode
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}
    http.createServer(onRequest).listen(4000);

} else {
    console.log(`Worker ${process.pid} started`);


    const server = http.createServer(handler);

    // Listen for messages from the master
    process.on('message', (message: Message) => {
        if (message.type === 'request') {
            console.log("worker proccess req");

    
            (<any> process).send('hello from worker with id: ' + process.pid);
            return;
        }
    });

    const workerId = cluster.worker?.id || 0;

    server.listen(4000 + workerId, () => {
        console.log(`Worker ${process.pid} is listening on port ${4000 + workerId}`);
    });
}



