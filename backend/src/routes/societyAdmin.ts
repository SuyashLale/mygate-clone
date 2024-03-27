import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
    createBlockInput,
    createResidentInput,
    createUnitInput,
    societyAdminSignInInput,
    societyAdminSignUpInput,
} from "@suyashlale/mygate-clone";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";

export const societyAdminRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

/**
 * * A society admin should be able to add blocks, units and residents
 * * A society admin should be able to map units to blocks and residents to units
 */

/**
 * *MW: All routes that need to be protected for Society Admin
 */
societyAdminRouter.use("/admin/*", async (c, next) => {
    // Check if the society admin is signed in
    try {
        const token = c.req.header("authorization") || undefined;
        if (!token) {
            c.status(403);
            return c.json({
                error: "Unauthorized: no header info found",
            });
        }

        // Verify the token
        const decoded = await verify(token, c.env.JWT_SECRET);
        if (decoded) {
            await next();
        } else {
            c.status(403);
            return c.json({
                error: "Unauthorized",
            });
        }
    } catch (e) {
        console.log("Internal error in MW Authenticating superuser: ", e);
        c.status(500);
        return c.json({
            error: "Internal error in MW authenticating superuser",
        });
    }
});

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

/**
 * *POST: Add Society Block
 */
societyAdminRouter.post("/admin/block", async (c) => {
    try {
        // Initialize the prisma client
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        // Get the request body
        const body = await c.req.json();

        // SafePrse the request body
        const { success } = createBlockInput.safeParse(body);

        // Enforce validation
        if (!success) {
            c.status(411);
            return c.json({
                error: "Input validation failed",
            });
        }

        // Create the block in the DB
        const block = await prisma.block.create({
            data: {
                name: body.name,
                society: body.societyId,
            },
        });

        // Return
        c.status(200);
        return c.json({
            message: "Block created successfully",
            id: block.id,
        });
    } catch (e) {
        console.log("Internal Error /admin/block route: ", e);
        c.status(500);
        return c.json({
            error: "Internal error /admin/block",
        });
    }
});

/**
 * * POST: Add Society Unit
 */
societyAdminRouter.post("/admin/unit", async (c) => {
    try {
        // Initialize the prisma client
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        // Get hte req body
        const body = await c.req.json();

        // SafeParse the request body
        const { success } = createUnitInput.safeParse(body);

        // Enforce Validation
        if (!success) {
            c.status(411);
            return c.json({
                error: "Input validation failed",
            });
        }

        // Create a unit in the DB
        const unit = await prisma.unit.create({
            data: {
                name: body.name,
                block: body.blockId,
                society: body.societyId,
            },
        });

        // Return
        c.status(200);
        return c.json({
            message: "Unit created successfully",
            id: unit.id,
        });
    } catch (e) {
        console.log("Internal Error /admin/unit: ", e);
        c.status(500);
        return c.json({
            error: "Internal error /admin/unit",
        });
    }
});

/**
 * *POST: Add Resident
 */
societyAdminRouter.post("/admin/resident", async (c) => {
    try {
        // Initialize prisma client
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        // Get the request body
        const body = await c.req.json();

        // SafeParse the request body
        const { success } = createResidentInput.safeParse(body);

        // Enforce validation
        if (!success) {
            c.status(411);
            return c.json({
                error: "Input validation failed",
            });
        }

        // Create the resident in the DB
        const resident = await prisma.resident.create({
            data: {
                email: body.email,
                password: "changeme",
                name: body.name,
                society: body.societyId,
                block: body.blockId,
                unit: body.unitId,
            },
        });
    } catch (e) {
        console.log("Internal Error /societyAdmin/admin/resident: ", e);
        c.status(500);
        return c.json({
            error: "Internal error: /societyAdmin/admin/resident",
        });
    }
});
