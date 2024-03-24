import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
    createSocietyInput,
    superuserSignInInput,
    superUserSignUpInput,
} from "@suyashlale/mygate-clone";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";

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
superuserRouter.post("/signin", async (c) => {
    // Initialize Prisma Client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body
    const body = await c.req.json();

    // SafeParse the request body
    const { success } = superuserSignInInput.safeParse(body);

    // Enforce validation
    if (!success) {
        c.status(411);
        return c.json({
            error: "Input validation failed",
        });
    }

    // Sign the user in
    try {
        // Get the email/pwd from the body and check in DB
        const user = await prisma.superUser.findUnique({
            where: {
                email: body.email,
                password: body.password,
            },
        });
        if (!user) {
            c.status(403);
            return c.json({
                error: "Unauthorized",
            });
        }

        // Create the JWT
        const token = await sign({ id: user.id }, c.env.JWT_SECRET);

        // Return
        c.status(200);
        return c.json({
            message: "Sign-in successful",
            token,
        });
    } catch (e) {
        console.log("Internal Error: superuser/signin: ", e);
        c.status(500);
        return c.json({
            error: "Internal Error: supersuer/signin",
        });
    }
});

/**
 * *MW
 * *All society routes need to be protected.
 * *Only superusers can create a socitey
 */
superuserRouter.use("/society/*", async (c, next) => {
    try {
        // Get the superuser JWT from the header
        const token = c.req.header("authorization") || undefined;

        if (!token) {
            c.status(403);
            return c.json({
                Error: "Unauthorized",
            });
        }

        const response = await verify(token, c.env.JWT_SECRET);
        if (response) {
            await next();
        } else {
            c.status(403);
            return c.json({
                error: "Token expired",
            });
        }
    } catch (e) {
        console.log("Error in MW /society: ", e);
        c.status(500);
        return c.json({
            error: "Internal error in MW /society",
        });
    }
});

/**
 * *POST: Create Society
 */
superuserRouter.post("/society/create", async (c) => {
    // Initialize prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body
    const body = await c.req.json();

    // SafeParse the request body
    const { success } = createSocietyInput.safeParse(body);

    // Enforce validation
    if (!success) {
        c.status(411);
        return c.json({
            error: "Input validation failed",
        });
    }

    try {
        // Create the society record in the DB
        const society = await prisma.society.create({
            data: {
                name: body.name,
                address: body.address,
            },
        });

        // Return
        c.status(200);
        return c.json({
            message: "Society created successfully",
            id: society.id,
        });
    } catch (e) {
        console.log("Internal error /society/create: ", e);
        c.status(500);
        return c.json({
            error: "Internal error: /society/create",
        });
    }
});

/**
 * *GET: All societies
 */
superuserRouter.get("/society/all", async (c) => {
    // Initialize the prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Make the DB call
        const societies = await prisma.society.findMany();

        // Return
        c.status(200);
        return c.json({
            societies,
        });
    } catch (e) {
        console.log("Internal error /society/all: ", e);
        c.status(500);
        return c.json({
            error: "Internal error: /society/all",
        });
    }
});
