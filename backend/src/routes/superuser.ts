import { Hono } from "hono";

export const superuserRouter = new Hono();

superuserRouter.get("/signup", (c) => {
    return c.json({
        message: "Hello from signup endpoint from the superuser router",
    });
});
