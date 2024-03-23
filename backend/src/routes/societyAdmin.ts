import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
    societyAdminSignInInput,
    societyAdminSignUpInput,
} from "@suyashlale/mygate-clone";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const societyAdminRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

/**
 * *POST: Sign-up Society Admin
 */
societyAdminRouter.post("/signup", async (c) => {
    // Initialize prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body
    const body = await c.req.json();

    // SafeParse the request body
    const { success } = societyAdminSignUpInput.safeParse(body);

    // Enforce validation
    if (!success) {
        c.status(411);
        return c.json({
            error: "Input validation failed",
        });
    }

    try {
        // Get the username, password and name from the request body and create the societyAdmin in the db
        const admin = await prisma.societyAdmin.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
                societyId: body.societyId,
            },
        });

        // Create the JWT and send back
        const token = await sign({ id: admin.id }, c.env.JWT_SECRET);
        c.status(200);
        return c.json({
            message: "Sign-up successful",
            token,
        });
    } catch (e) {
        console.log("Internal Error societyAdmin/signup: ", e);
        c.status(500);
        return c.json({
            error: "Internal Error societyAdmin/signup",
        });
    }
});

/**
 * *POST: Sign-in Society Admin
 */
societyAdminRouter.post("/signin", async (c) => {
    // Initialize the Prisma Client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Get the request body
    const body = await c.req.json();

    // SafeParse the request body
    const { success } = societyAdminSignInInput.safeParse(body);

    // Enforce validation
    if (!success) {
        c.status(411);
        return c.json({
            error: "Input validation failed",
        });
    }

    // Parse the request and sign the user in
    try {
        const admin = await prisma.societyAdmin.findUnique({
            where: {
                email: body.email,
                password: body.password,
            },
        });

        if (!admin) {
            c.status(403);
            return c.json({
                error: "Unauthorized",
            });
        }

        // Create JWT and send to front end
        const token = await sign({ id: admin.id }, c.env.JWT_SECRET);

        c.status(200);
        return c.json({
            message: "Sign-in successful",
            token,
        });
    } catch (e) {
        console.log("Internal Error /societyAdmin Sign-up router: ", e);
        c.status(500);
        return c.json({
            error: "Internal Error /societyAdmin sign-up route",
        });
    }
});
