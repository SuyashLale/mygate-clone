import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createSocietyInput } from "@suyashlale/mygate-clone";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const societyRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        superuserId: string;
    };
}>();

/**
 * *MW
 * *All society routes need to be protected.
 * *Only superusers can create a socitey
 */
societyRouter.use("/*", async (c, next) => {
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
societyRouter.post("/create", async (c) => {
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
societyRouter.get("/all", async (c) => {
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
