import { Hono } from "hono";

export const residentRouter = new Hono();

residentRouter.post("/signup", (c) => {
    return c.json({
        message: "Hi from the sign up endpoint",
    });
});
