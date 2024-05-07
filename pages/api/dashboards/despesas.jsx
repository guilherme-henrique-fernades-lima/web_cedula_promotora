async function getDespesas(req, res) {
  try {
    const token = req.headers.authorization;
    const loja = req.query.loja ?? "";
    const dt_inicio = req.query.dt_inicio ?? "";
    const dt_final = req.query.dt_final ?? "";

    const result = await fetch(
      `${process.env.NEXT_INTEGRATION_URL}/despesas/dashboard/?dt_inicio=${dt_inicio}&dt_final=${dt_final}&loja=${loja}`,
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
