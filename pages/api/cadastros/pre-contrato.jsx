async function create(req, res) {
  const token = req.headers.authorization;
  const data = req.body;

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/pre-contratos/`,
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

// async function update(req, res) {
//   const token = req.headers.authorization;
//   const data = req.body;
//   const id = req.query.id ?? "";

//   const result = await fetch(
//     `${process.env.NEXT_INTEGRATION_URL}/resources/bancos/${id}`,
//     {
//       method: "PUT",
//       headers: {
//         "X-Requested-With": "XMLHttpRequest",
//         "Content-Type": "application/json;charset=UTF-8",
//         Authorization: `Bearer ${token}`,
//       },
//       body: data,
//     }
//   );

//   const json = await result.json();

//   return res.status(result.status).json(json);
// }

async function retrieve(req, res) {
  const token = req.headers.authorization;

  const id = req.query.ativas ?? "";

  const result = await fetch(
    `${process.env.NEXT_INTEGRATION_URL}/pre-contratos/?id=${id}`,
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
  if (req.method == "POST") {
    create(req, res);
  } else if (req.method == "GET") {
    retrieve(req, res);

    //  else if (req.method == "GET") {
    //   list(req, res);
  } else {
    res.status(405).send();
  }
}
