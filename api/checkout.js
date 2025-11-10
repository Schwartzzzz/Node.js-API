export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const response = await fetch("https://plugin.tebex.io/payments", {
      method: "POST",
      headers: {
        "X-Tebex-Secret": process.env.TEBEX_PRIVATE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        basket: {
          packages: [
            {
              id: 7091294, // tu ID del paquete
              quantity: 1,
            },
          ],
        },
        username,
      }),
    });

    const text = await response.text(); // obtenemos el texto crudo
    console.log("Tebex raw response:", text); // mostramos en logs de Vercel

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("Tebex returned error:", data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ url: data.checkout_url || data });
  } catch (err) {
    console.error("Server crash:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
