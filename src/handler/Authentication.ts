import { effectValidator } from "@hono/effect-validator";
import { Hono } from "hono";
import * as Schema from "effect/Schema"
import { createSuccessResponse } from "@core/Responder";

const app = new Hono()

const LoginRequestSpecification = Schema.Struct({
    email: Schema.String,
    password: Schema.String,
})

const RegisterRequestSpecification = Schema.Struct({
    email: Schema.String,
    password: Schema.String,
    phone_number: Schema.String,
    name: Schema.String,
    profile_image_url: Schema.optional(Schema.String),
})

app.post("/login", effectValidator("json", LoginRequestSpecification), (c) => {
    const validatedBody = c.req.valid("json")
    return c.json(createSuccessResponse(null, "User logged in successfully", 200), {
        status: 200
    })
})

app.post("/register", effectValidator("json", RegisterRequestSpecification), (c) => {
    const validatedBody = c.req.valid("json")
    return c.json(createSuccessResponse(null, "User registered successfully", 200), {
        status: 200
    })
})

export default app;