import { Hono } from "hono";

export const societyAdminRouter = new Hono();

societyAdminRouter.get("/signup", (c) => {
    return c.json({
        message: "Hello from signup endpoint from the societyAdmin router",
    });
});
