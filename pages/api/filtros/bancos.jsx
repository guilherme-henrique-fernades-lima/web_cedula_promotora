async function getBancos(req, res) {
  const token = req.headers.authorization;

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/contratos/bancos/`,
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
    getBancos(req, res);
  } else {
    res.status(405).send();
  }
}
