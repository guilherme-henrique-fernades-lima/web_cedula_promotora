async function getDespesas(req, res) {
  const token = req.headers.authorization;

  const response = await fetch(`${process.env.NEXT_INTEGRATION_URL}/despesas`, {
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  return res.status(response.status).json(json);
}

export default async function handler(req, res) {
  if (req.method == "GET") {
    getDespesas(req, res);
  } else {
    res.status(405).send();
  }
}
