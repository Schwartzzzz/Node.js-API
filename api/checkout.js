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
              id: 7091294, // tu package ID
              quantity: 1,
            },
          ],
        },
        username: username,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Tebex error:", data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ url: data.checkout_url });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
