import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "cc61ca74-d783-46f2-94f2-7e276f6ce927"; // вставь сюда свой ключ Polar
const PRODUCT_ID = "f87cb57a-2189-4c7b-9b88-588ef917096c"; // ID вашего продукта в Polar

app.post("/create-checkout", async (req, res) => {
  try {
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
