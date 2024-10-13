async function list(req, res) {
  const token = req.headers.authorization;

  const dt_inicio = req.query.dt_inicio ?? "";
  const dt_final = req.query.dt_final ?? "";
  const user_id = req.query.user_id ?? "";
  const has_contrato = req.query.has_contrato ?? "";
  const convenios = req.query.convenios ?? "";
  const promotoras = req.query.promotoras ?? "";
  const corretores = req.query.corretores ?? "";
  const operacoes = req.query.operacoes ?? "";
  const bancos = req.query.bancos ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/pre-contratos/?dt_inicio=${dt_inicio}&dt_final=${dt_final}&user_id=${user_id}&has_contrato=${has_contrato}&convenios=${convenios}&promotoras=${promotoras}&corretores=${corretores}&operacoes=${operacoes}&bancos=${bancos}`,
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

async function del(req, res) {
  const token = req.headers.authorization;
  const id = req.query.id ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/pre-contratos/${id}/`,
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

async function send(req, res) {
  const token = req.headers.authorization;
  const data = req.body;
  const id = req.query.id ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/pre-contratos/send-to-contrato/`,
    {
      method: "POST",
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

export default async function handler(req, res) {
  if (req.method == "GET") {
    list(req, res);
  } else if (req.method == "DELETE") {
    del(req, res);
  } else if (req.method == "POST") {
    send(req, res);
  } else {
    res.status(405).send();
  }
}
