async function getEmprestimosVencidos(req, res) {
  const token = req.headers.authorization;
  const date = req.query.date ?? "";

  const response = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/emprestimos/vencimento/?date=${date}`,
    {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    const json = await response.json();

    return res.status(response.status).json(json);
  } else {
    return res.status(response.status).json({ message: "sem registros" });
  }
}

export default async function handler(req, res) {
  if (req.method == "GET") {
    getEmprestimosVencidos(req, res);
  } else {
    res.status(405).send();
  }
}
