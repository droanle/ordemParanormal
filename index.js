const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.sendFile(__dirname + "/view/index.html"))

app.get("/getLogs", (req, res) => {
  let DataJson = require('./data/data.json');
  res.json(DataJson.log);
})


app.get("/:ID", (req, res) => {
  let id = req.params.ID;
  let DataJson = require('./data/data.json');
  var validate = false;

  for (let i in DataJson.log) if (DataJson.log[i] == id) validate = true;

  if (validate) {
    res.sendFile(__dirname + "/view/ficha.html");
  }
  else {
    res.sendFile(__dirname + "/view/404Error.html");
  }


})

app.get("/getFicha/:ID", (req, res) => {
  let id = req.params.ID;
  let DataJson = require('./data/data.json');
  var validate = false;
  for (let i in DataJson.log) if (DataJson.log[i] == id) validate = true;

  if (validate) {
    try {
      res.json(JSON.parse(fs.readFileSync('./data/' + id + '.json')));
    } catch {
      res.json(JSON.parse("{}"));
    }
  }
  else {
    res.json(JSON.parse("{}"));
  }
})

app.get("/setFicha/:ID", (req, res) => {
  let id = req.params.ID;
  let DataJson = require('./data/data.json');
  var validate = false;
  for (let i in DataJson.log) if (DataJson.log[i] == id) validate = true;

  if (validate) {
    try {
      let save = fs.writeFileSync('./data/' + id + '.json', req.query.data);
      if (save == false) throw null;
      else res.sendStatus(202);
    } catch {
      res.sendStatus(500);
    }
  }
  else res.sendStatus(500);
})

app.get("/testes/vsd", (req, res) => {
  var key = '2:85;71427405358';
  var iv = '8746376827619797';
  var encrypted = CryptoJS.AES.encrypt('2022-08-12', CryptoJS.enc.Utf8.parse(key), { iv: CryptoJS.enc.Utf8.parse(iv) });

  var r1 = encrypted.ciphertext.toString();
  r2 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
  res.send(r2);
})




app.use((req, res) => res.status(404).sendFile(__dirname + "/view/404Error.html"));

app.listen(3001, () => {
  console.log("Servidor rodando");
});