import { Client } from "https://deno.land/x/postgres/mod.ts"
import { User } from '../types.ts'
import { dbCredentials } from "../config.ts";

// Client init
const client = new Client(dbCredentials)

// @desc    Get all registered users.
// @route   GET /api/v1/user
// @ts-ignore
const getUsers= async ({ response }: { response: any }) => {
    try {
        await client.connect()

        const result = await client.query("SELECT * FROM users")
        response.status = 200
        response.body = {
            success: true,
            data: result
        }
    } catch(e) {
        console.log(e)
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
    const body = request.body()
    const user = body.value

    if(!request.hasBody) {
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
                data: result
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
}

export { getUsers, addUser }