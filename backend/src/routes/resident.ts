import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
    residentSignInInput,
    residentSignUpInput,
} from "@suyashlale/mygate-clone";
import { Hono } from "hono";

export const residentRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        societyId: string;
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
                societyId: c.get("societyId"),
            },
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
});
