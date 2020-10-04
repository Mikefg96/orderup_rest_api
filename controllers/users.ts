import { Client } from "https://deno.land/x/postgres/mod.ts"
import { User } from '../types.ts'

const cfg = Deno.env.get("DB_URI")
const client = new Client(cfg)

// @desc    Get all registered users.
// @route   GET /api/v1/user
// @ts-ignore
const getUsers = async ({ response }: { response: any }) => {
    try {
        await client.connect()

        const result = await client.query("SELECT * FROM users")

        const users = new Array()
        result.rows.map(user => {
            let obj: any = new Object()
            result.rowDescription.columns.map((el, i) => {
                obj[el.name] = user[i]
            })
            users.push(obj)
        })

        response.status = 200
        response.body = {
            success: true,
            data: users
        }
    } catch(e) {
        response.status = 500
        response.body = {
            success: false,
            msg: e.toString()
        }
    } finally {
        await client.end()
    }
}

// @desc    Register a new user.
// @route   POST /api/v1/user
// @ts-ignore
const addUser = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body()
    const user = await body.value

    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: 'No data sent'
        }
    } else {
        try {
            await client.connect()

            const result = await client.query("INSERT INTO users(name, last_name, email, password) VALUES($1, $2, $3, $4)",
                user.name, user.last_name, user.email, user.password)

            response.status = 201
            response.body = {
                success: true,
                data: user
            }
        } catch (e) {
            response.status = 500
            response.body = {
                success: false,
                msg: e.toString()
            }
        } finally {
            await client.end()
        }
    }
}

export { getUsers, addUser }