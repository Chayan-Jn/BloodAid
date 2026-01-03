import { createClient } from 'redis'
import dotenv from 'dotenv'
dotenv.config();

const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
})
client.on('error', err => console.error(err))
client.on('connect', () => console.log('redis connected successfully '))

await client.connect()
export default client
