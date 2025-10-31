import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mapsRouter from "./routes/maps.js";
import checkoutRouter from "./routes/checkout.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
});
app.use(limiter);

app.get("/", (_, res) => res.json({ ok: true }));
app.use("/api", mapsRouter);
app.use("/api/checkout", checkoutRouter);

app.use((err, req, res, next) => {
  const isZod = err?.issues && err?.name === "ZodError";
  const isAxios = err?.isAxiosError || err?.response;
  if (isZod) {
    return res
      .status(400)
      .json({ error: "Invalid request", details: err.issues });
  }
  if (isAxios) {
    const status = err.response?.status || 502;
    const msg = err.response?.data?.error || err.message || "Upstream error";
    return res.status(status).json({ error: msg });
  }
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => console.log(`API listening on :${PORT}`));
