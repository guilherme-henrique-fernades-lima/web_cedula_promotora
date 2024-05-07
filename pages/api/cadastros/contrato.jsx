async function getCliente(req, res) {
  const token = req.headers.authorization;
  const cpf = req.query.cpf ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/clientes/${cpf}`,
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
}

async function salvarContrato(req, res) {
  const token = req.headers.authorization;
  const data = req.body;

  const result = await fetch(`${process.env.NEXT_INTEGRATION_URL}/contratos/`, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  const json = await result.json();

  return res.status(result.status).json(json);
}

export default async function handler(req, res) {
  if (req.method == "POST") {
    salvarContrato(req, res);
  } else if (req.method == "GET") {
    getCliente(req, res);
  } else {
    res.status(405).send();
  }
}
