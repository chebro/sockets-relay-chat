// Accepts connections on port 8080
// Relays messages from one client to the rest

const net = require('net')
const connectedClients = new Set()

// Broadcast data to all clients except the sender
const broadcast = (data, except) => {
	for (let client of connectedClients) {
		if (client !== except) client.write(data)
	}
}

const handleClientMessage = (data, client) => {
	// Set client username
	if (data.startsWith('/USERNAME')) {
		client.name = data.split(' ')[1].trim()
		broadcast(`-!- ${client.name} has joined\r\n`, client)
	}
	// Broadcast messages
	else if (data.startsWith('/MESSAGE')) {
		broadcast(`<${client.name}> ${data.slice(9).trim()}\r\n`, client)
	}
}

const server = new net.Server(client => {
	// Add client to the connected clients set
	connectedClients.add(client)
	// Handle incoming data from a client
	client.on('data', (buf) => {
		handleClientMessage(buf.toString('utf-8'), client)
	})
	// Delete client from the set if disconnected
	client.on('end', () => {
		broadcast(`-!- ${client.name} disconnected\r\n`, client)
		connectedClients.delete(client)
	})
})

// Open a socket on port 8080
server.listen({ port: 8080, host: '0.0.0.0' }, () => console.log('listening on 8080'))

