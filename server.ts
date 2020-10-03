import { Application } from 'https://deno.land/x/oak/mod.ts'
import "https://deno.land/x/dotenv/load.ts"
import router from './routes.ts'

const port = Deno.env.get("PORT") || 3000

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Local server listening on port ${port}`)
await app.listen({ port: +port })