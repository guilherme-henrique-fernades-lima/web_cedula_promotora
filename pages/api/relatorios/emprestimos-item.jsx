async function getEmprestimoItem(req, res) {
  const token = req.headers.authorization;
  const id = req.query.id ?? "";

  const response = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/parcelas/?id=${id}`,
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

export default async function handler(req, res) {
  if (req.method == "GET") {
    getEmprestimoItem(req, res);
  } else {
    res.status(405).send();
  }
}
