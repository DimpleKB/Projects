import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pkg from "pg";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const { Client } = pkg;

const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "dimple",
  port: 5432,
});

db.connect()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err.stack));

// 🔹 Signup Route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashed]
    );
    res.json({ message: "✅ User registered", userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(400).json({ message: "⚠️ Username already exists" });
    }
    res.status(500).json({ message: "❌ Server error" });
  }
});

// 🔹 Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "⚠️ User not found" });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "⚠️ Incorrect password" });
    }
    res.json({
      message: "✅ Login successful",
      userId: user.id,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// ✅ Find deficiencies & food recommendations from symptoms
app.post("/check-symptoms", async (req, res) => {
  let { symptoms } = req.body; // array of symptom names

  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    return res.json({ deficiencies: [] });
  }

  symptoms=symptoms.map(s=>s.trim().toLowerCase());

  try {
    // 1️⃣ Get deficiencies related to symptoms
    const result = await db.query(
      `SELECT DISTINCT d.id, d.name, d.description
       FROM deficiencies d
       JOIN deficiency_symptoms ds ON d.id = ds.deficiency_id
       JOIN symptoms s ON ds.symptom_id = s.id
       WHERE LOWER(s.name) = ANY($1)`,
      [symptoms]
    );

    const deficiencies = [];

    // 2️⃣ For each deficiency, fetch foods
    for (const def of result.rows) {
      const foodsRes = await db.query(
        `SELECT f.name 
         FROM foods f
         JOIN deficiency_foods df ON f.id = df.food_id
         WHERE df.deficiency_id = $1`,
        [def.id]
      );

      deficiencies.push({
        id: def.id,
        name: def.name,
        description: def.description,
        foods: foodsRes.rows.map(f => f.name),
      });
    }

    res.json({ deficiencies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 Test Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
