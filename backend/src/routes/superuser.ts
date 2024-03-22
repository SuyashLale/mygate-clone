import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { superUserSignUpInput } from "@suyashlale/mygate-clone";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const superuserRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

/**
 * *POST: Sign-up superuser
 */
superuserRouter.post("/signup", async (c) => {
    // Initialize the prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body from the context
    const body = await c.req.json();

    // Safe parse the request body
    const { success } = superUserSignUpInput.safeParse(body);

    // Enforce validation
    if (!success) {
        c.status(411);
        return c.json({
            error: "Input validation failed",
        });
    }

    // Process the request body and create the user entry in the DB
    try {
        const superuser = await prisma.superUser.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
            },
        });

        // Create the JWT token
        const token = await sign({ id: superuser.id }, c.env.JWT_SECRET);

        // Return
        c.status(200);
        return c.json({
            message: "Sign up successful",
            token,
        });
    } catch (e) {
        console.log("Internal Error: superuser/signup: ", e);
        return c.json({
            error: "Internal Error: superuser/signup",
        });
    }
});

/**
 * *POST: Sign-in superuser
 */
superuserRouter.post("/signin", async c => {

    // Initialize Prisma Client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    });

    // Get the request body
    const body = await c.req.json();

    // SafeParse the request body
    
})