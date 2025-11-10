export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const response = await fetch("https://checkout.tebex.io/api/checkout", {
      method: "POST",
      headers: {
        "X-Tebex-Secret": process.env.TEBEX_PRIVATE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        basket: {
          packages: [
            {
              id: 7091294, // <-- Reemplaza con el ID de tu paquete
              quantity: 1,
            },
          ],
          username,
        },
      }),
    });

    const data = await response.json();

    if (!data.links || !data.links.checkout) {
      return res.status(500).json({ error: "Checkout link not found", data });
    }

    return res.redirect(data.links.checkout);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
