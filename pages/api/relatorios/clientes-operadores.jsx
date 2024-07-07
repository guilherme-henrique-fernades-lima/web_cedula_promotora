async function list(req, res) {
  const token = req.headers.authorization;
  const user_id = req.query.user_id ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/clientes/?user_id=${user_id}`,
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

export default async function handler(req, res) {
  if (req.method == "GET") {
    list(req, res);
  } else {
    res.status(405).send();
  }
}
