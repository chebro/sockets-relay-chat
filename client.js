// Connects to server on port 8080
// Prints messages from server and sends input to server

const net = require('net')
const readline = require('readline')

const HOST = process.argv[2]
const USER = process.argv[3]
const PROMPT = '>>> '

// Create an input/output interface
const interface = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: PROMPT })

// Fancy print function with cursor scrollback
const printline = (message, scrollback) => {
	readline.cursorTo(process.stdout, 0)
	readline.moveCursor(process.stdout, -PROMPT.length, -scrollback)
	readline.clearLine(process.stdout, 1)
	process.stdout.write(message)
	interface.prompt()
}

// Send input to server and print if not empty
interface.on('line', input => {
	if (input === '') printline('', 1)
	else {
		socket.write(`/MESSAGE ${input}\r\n`)
		printline(`<you> ${input}\r\n`, 1)
	}
})

// Open a connection to HOST on port 8080
const socket = new net.createConnection({ port: 8080, host: HOST, family: 4 }, () => {
	interface.prompt()
	socket.write(`/USERNAME ${USER}`)
})

// Print incoming messages from the server
socket.on('data', buf => {
	printline(buf.toString('utf8'), 0)
})

