async function getDespesas(req, res) {
  try {
    const token = req.headers.authorization;

    const result = await fetch(
      `${process.env.NEXT_INTEGRATION_URL}/despesas/dashboard/`,
      {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await result.json();

    return res.status(result.status).json(json);
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    return res.status(500).json({ error: "Erro ao buscar despesas" });
  }
}

export default async function handler(req, res) {
  if (req.method == "GET") {
    getDespesas(req, res);
  } else {
    res.status(405).send();
  }
}
