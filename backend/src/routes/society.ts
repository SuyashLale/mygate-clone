import { Hono } from "hono";

export const societyRouter = new Hono();

societyRouter.get("/info", (c) => {
    return c.json({
        message: "Hi from the society get endpoint",
    });
});
