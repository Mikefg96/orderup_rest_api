import { Router } from 'https://deno.land/x/oak/mod.ts'
import { addUser, getUsers } from "./controllers/users.ts";

const router = new Router()

router.post('/api/v1/user', addUser)
router.get('/api/v1/user', getUsers)

export default  router