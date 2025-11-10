// ✅ Endpoint de checkout para Tebex Checkout
export default async function handler(req, res) {
  // Obtenemos el nombre de usuario desde la query (?username=Nombre)
  const { username } = req.query;

  // Validamos que venga un nombre de usuario
  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    // Enviamos la solicitud al endpoint oficial de Tebex Checkout
    const response = await fetch("https://checkout.tebex.io/api/checkout", {
      method: "POST",
      headers: {
        "X-Tebex-Secret": process.env.TEBEX_PRIVATE_KEY, // Clave privada
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        basket: {
          packages: [
            {
              id: 7091294, // 👈 Reemplazá esto con el ID real de tu paquete en Tebex
              quantity: 1,
            },
          ],
        },
        username, // nombre de usuario enviado desde la URL
      }),
    });

    // Obtenemos el JSON de respuesta
    const data = await response.json();

    // Si la API responde con error
    if (!response.ok) {
      console.error("Tebex API error:", data);
      return res.status(response.status).json({ error: data });
    }

    // Si todo está bien, devolvemos el link de checkout
    return res.status(200).json({
      success: true,
      checkout_url: data?.data?.links?.checkout || null,
      full_response: data,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
