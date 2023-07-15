async function getClientes(req, res) {
  const token = req.headers.authorization;

  const result = await fetch(`${process.env.NEXT_INTEGRATION_URL}/clientes`, {
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await result.json();

  return res.status(result.status).json(json);
}

async function cadastrarCliente(req, res) {
  const token = req.headers.authorization;
  const data = req.body;

  const result = await fetch(`${process.env.NEXT_INTEGRATION_URL}/clientes/`, {
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
  if (req.method == "GET") {
    getClientes(req, res);
  } else if (req.method == "POST") {
    cadastrarCliente(req, res);
  } else {
    res.status(405).send();
  }
}
