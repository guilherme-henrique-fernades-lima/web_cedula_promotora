async function getContratos(req, res) {
  const token = req.headers.authorization;

  const dt_inicio = req.query.dt_inicio ?? "";
  const dt_final = req.query.dt_final ?? "";
  const convenios = req.query.convenios ?? "";
  const promotoras = req.query.promotoras ?? "";
  const corretores = req.query.corretores ?? "";
  const operacoes = req.query.operacoes ?? "";
  const bancos = req.query.bancos ?? "";

  //Mock data filter
  // const dt_inicio = "2024-03-01";
  // const dt_final = "2024-04-20";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/contratos/dashboard/?dt_inicio=${dt_inicio}&dt_final=${dt_final}&convenios=${convenios}&promotoras=${promotoras}&corretores=${corretores}&operacoes=${operacoes}&bancos=${bancos}`,
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
    getContratos(req, res);
  } else {
    res.status(405).send();
  }
}
