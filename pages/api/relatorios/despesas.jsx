async function getDespesas(req, res) {
  const token = req.headers.authorization;

  const dt_inicio = req.query.dt_inicio ?? "";
  const dt_final = req.query.dt_final ?? "";

  const response = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/despesas/?dt_inicio=${dt_inicio}&dt_final=${dt_final}`,
    {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await response.json();

  return res.status(response.status).json(json);
}

async function editarDespesa(req, res) {
  const token = req.headers.authorization;
  const data = req.body;
  const id = req.query.id ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/despesas/${id}/`,
    {
      method: "PUT",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    }
  );

  const json = await result.json();

  return res.status(result.status).json(json);
}

async function excluirDepesa(req, res) {
  const token = req.headers.authorization;
  const id = req.query.id ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/despesas/${id}/`,
    {
      method: "DELETE",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.status(result.status).json({ message: "deletado com sucesso" });
}

export default async function handler(req, res) {
  if (req.method == "GET") {
    getDespesas(req, res);
  } else if (req.method == "PUT") {
    editarDespesa(req, res);
  } else if (req.method == "DELETE") {
    excluirDepesa(req, res);
  } else {
    res.status(405).send();
  }
}
