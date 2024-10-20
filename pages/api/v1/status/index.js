function status(request, response) {
  response.status(200).json({ chave: "esse é um teste" });
}

export default status;
