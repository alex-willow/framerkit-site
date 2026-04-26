import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.POLAR_API_KEY;
const PRODUCT_ID = process.env.POLAR_PRODUCT_ID;

app.post("/create-checkout", async (req, res) => {
  try {
    if (!API_KEY || !PRODUCT_ID) {
      res.status(500).json({
        error: "Polar API credentials are not configured.",
      });
      return;
    }

    const { email } = req.body; // email покупателя

    const response = await fetch("https://api.polar.sh/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: PRODUCT_ID,
        customer: { email },
        require_billing_address: false // <- убираем адрес
      }),
    });

    const data = await response.json();
    res.json({ url: data.checkout_url }); // возвращаем ссылку на checkout
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
