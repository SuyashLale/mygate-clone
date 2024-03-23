import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
    residentSignInInput,
    residentSignUpInput,
} from "@suyashlale/mygate-clone";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const residentRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

/**
 * *POST: Sign-up Resident
 */
residentRouter.post("/signup", async (c) => {
    // Initialize prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body
    const body = await c.req.json();

    // SafeParse the request body
    const { success } = residentSignUpInput.safeParse(body);

    // Enforce Validation
    if (!success) {
        c.status(411);
        return c.json({
            error: "Input validation failed",
        });
    }

    // Process the request body and create the resident in the DB
    try {
        const resident = await prisma.resident.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                societyId: body.societyId,
            },
        });

        // Create the JWT
        const token = await sign({ id: resident.id }, c.env.JWT_SECRET);

        // Return
        c.status(200);
        return c.json({
            message: "Sign-up successful",
            token,
        });
    } catch (e) {
        console.log("Internal Error resident /sign-up: ", e);
        c.status(500);
        return c.json({
            error: "Internal Error resident /sign-up route",
        });
    }
});

/**
 * *POST: Sign-in resident
 */
residentRouter.post("/signin", async (c) => {
    // Initialize the prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body
    const body = await c.req.json();

    // SafeParse tthe input
    const { success } = residentSignInInput.safeParse(body);

    // Enforce validation
    if (!success) {
        c.status(411);
        return c.json({
            error: "Input validation failed",
        });
    }

    // Check the email and password and sign the user in
    const resident = await prisma.resident.findUnique({
        where: {
            email: body.email,
            password: body.password,
        },
    });
    if (!resident) {
        c.status(403);
        return c.json({
            error: "Unauthorized",
        });
    }
    const token = await sign({ id: resident.id }, c.env.JWT_SECRET);
    c.status(200);
    return c.json({
        message: "Sign-in successful",
        token,
    });
});
