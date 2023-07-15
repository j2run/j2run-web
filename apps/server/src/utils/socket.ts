import * as net from 'net';

export function findClosedPorts(startPort: number, endPort: number) {
  const closedPorts = [];

  for (let port = startPort; port <= endPort; port++) {
    const server = net.createServer();

    server.once('error', () => {
      closedPorts.push(port);
      server.close();
    });

    server.once('listening', () => {
      server.close();
    });

    server.listen(port, '127.0.0.1');
  }
  return closedPorts;
}
