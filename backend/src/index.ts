import { Hono } from "hono";
import { residentRouter } from "./routes/resident";
import { superuserRouter } from "./routes/superuser";
import { societyAdminRouter } from "./routes/societyAdmin";

const app = new Hono();

app.route("/api/v1/superuser", superuserRouter);
app.route("/api/v1/societyAdmin", societyAdminRouter);
app.route("/api/v1/resident", residentRouter);

export default app;
