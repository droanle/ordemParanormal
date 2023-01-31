var data = {};

var selectTrainado = {
  "0": "Leigo",
  "5": "Treinado",
  "10": "Veterano",
  "15": "Expert",
}

function systemRequest(dir, fun, method, param) {
  var url = "/" + dir;

  let ajax = new XMLHttpRequest();

  ajax.open(method, url, true);

  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      fun(ajax.responseText, param);
    } else if (this.readyState == 4 && this.status == 500) {
      alert("Olve um Erro na requisição, tente mais tarde.")
    }
  }

  ajax.send();
}

function saveData() {
  console.log(data);

  var urlParams = {};
  urlParams.data = JSON.stringify(data);
  urlParams = new URLSearchParams(urlParams);

  var id = window.location.pathname.split("/");

  id = id[(id.length - 1)];

  var url = 'setFicha/' + id + '?' + urlParams;

  var fun = (text, param) => { }

  systemRequest(url, fun, 'GET', null);
}

function setValues() {
  var Elements = document.getElementsByTagName("input");
  for (var i = 0; i < Elements.length; i++) {
    let input = Elements[i];

    if (data[input.name]) {
      if (input.type == "text" || input.type == "number") { input.value = data[input.name]; }
      if (input.type == "checkbox")
        if (data[input.name] == 1)
          input.checked = true;
    }
  }

  var Elements = document.getElementsByTagName("select");
  for (var i = 0; i < Elements.length; i++) {
    let element = Elements[i];
    if (data[element.name]) {
      element.value = data[element.name];

      document.getElementById(element.name + "T").innerText = selectTrainado[data[element.name]];
    }
  }

  var Elements = document.getElementsByTagName("textarea");
  for (var i = 0; i < Elements.length; i++) {
    let element = Elements[i];
    if (data[element.name]) element.value = data[element.name];
  }

  setHabilidades();
  setRituais();
}


// Pagina 1
function chargeValue(e) {
  if (e.type == "checkbox") data[e.name] = e.checked ? 1 : 0;
  else if (e.tagName == "SELECT") {
    data[e.name] = e.value;

    document.getElementById(e.name + "T").innerText = selectTrainado[e.value];
  }
  else data[e.name] = e.value;

  saveData()
}


// Pagina 2
function escHabilidade(target) {
  if (target == 0) data.habilidades.splice(0, 1);
  else data.habilidades.splice(target, target);

  setHabilidades()
  saveData()
}

function setHabilidades() {
  if (data.habilidades) {
    var habilidades = document.getElementById("habilidades");

    habilidades.innerHTML = "";

    for (let hCount = 0; hCount < data.habilidades.length; hCount++) {
      let habilidadeName = data.habilidades[hCount].habilidadeName;
      let habilidadeDescri = data.habilidades[hCount].habilidadeDescri;

      let content = '<div id="habilidade' + hCount + '" class="habilidade">'
      content += '<img onclick="escHabilidade(' + hCount + ')" src="./img/escBtn.png" alt="escHabilidade" class="btn escHabilidade">';
      content += '<input onchange="chargeValueHabilidades(true,' + hCount + ')" value="' + habilidadeName + '" type="text" id="habilidadeName/' + hCount + '" class="defaultInput habilidadeName">';
      content += '<textarea onchange="chargeValueHabilidades(false,' + hCount + ')" id="habilidadeDescri/' + hCount + '" class="defaultInput habilidadeDescri">' + habilidadeDescri + '</textarea>';
      content += '</div>';

      habilidades.innerHTML += content;
    }
  }

}

function addHabilidade() {
  if (!data.habilidades) {
    data.habilidades = [];
  }

  var hCount = data.habilidades.length;
  data.habilidades[hCount] = {};
  data.habilidades[hCount].habilidadeName = "Nome da habilidade:";
  data.habilidades[hCount].habilidadeDescri = "Descrição da habilidade";

  saveData()
  setHabilidades();
}

function chargeValueHabilidades(opt, hCount) {
  if (data.habilidades[hCount]) {
    if (opt) {
      data.habilidades[hCount].habilidadeName = document.getElementById("habilidadeName/" + hCount).value;
    } else {
      data.habilidades[hCount].habilidadeDescri = document.getElementById("habilidadeDescri/" + hCount).value;
    }

    saveData()
  }
}


// Pagina 3
function escRituais(target) {
  if (target == 0) data.rituais.splice(0, 1);
  else data.rituais.splice(target, target);
  setRituais()
  saveData()
}

function setRituais() {
  if (data.rituais) {
    var rituais = document.getElementById("rituais");

    rituais.innerHTML = "";

    for (let hCount = 0; hCount < data.rituais.length; hCount++) {
      let Name = data.rituais[hCount].ritualName;
      let elementos = data.rituais[hCount].elementos;
      let Circulo = data.rituais[hCount].ritualCirculo;
      let Execucao = data.rituais[hCount].ritualExecucao;
      let Alcance = data.rituais[hCount].ritualAlcance;
      let Alvo = data.rituais[hCount].ritualAlvo;
      let Duracao = data.rituais[hCount].ritualDuracao;
      let Resistencia = data.rituais[hCount].ritualResistencia;
      let Descri = data.rituais[hCount].ritualDescri;

      let content = '<div id="ritual' + hCount + '" class="ritual">';
      content += '<input onchange="chargeValueRituais(this, ' + hCount + ')" value="' + Name + '" type="text" name="ritualName" class="defaultInput ritualName">';
      content += '<div class="elementos">';
      content += '<p onclick="changeElemento(0, ' + hCount + ')" name="Morte" class="elemento eMorte ' + (elementos[0] ? "" : "elementoInativo") + '">Morte</p>';
      content += '<p onclick="changeElemento(1, ' + hCount + ')" name="Samgue" class="elemento eSamgue ' + (elementos[1] ? "" : "elementoInativo") + '">Sangue</p>';
      content += '<p onclick="changeElemento(2, ' + hCount + ')" name="Energia" class="elemento eEnergia ' + (elementos[2] ? "" : "elementoInativo") + '">Energia</p>';
      content += '<p onclick="changeElemento(3, ' + hCount + ')" name="Conhecimento" class="elemento eConhecimento ' + (elementos[3] ? "" : "elementoInativo") + '">Conhecimento</p>';
      content += '<p onclick="changeElemento(4, ' + hCount + ')" name="Medo" class="elemento eMedo ' + (elementos[4] ? "" : "elementoInativo") + '">Medo</p>';
      content += '</div>';
      content += '<label for="ritualCirculo/' + hCount + '" class="ritualLabel">Círculo:';
      content += '<input onchange="chargeValueRituais(this, ' + hCount + ')" value="' + Circulo + '" type="text" id="ritualCirculo/' + hCount + '" name="ritualCirculo" class="defaultInput ritualInput">';
      content += '</label>';
      content += '<label for="ritualExecucao/' + hCount + '" class="ritualLabel">Execução:';
      content += '<input onchange="chargeValueRituais(this, ' + hCount + ')" value="' + Execucao + '" type="text" id="ritualExecucao/' + hCount + '" name="ritualExecucao" class="defaultInput ritualInput">';
      content += '</label>';
      content += '<label for="ritualAlcance/' + hCount + '" class="ritualLabel">Alcance:';
      content += '<input onchange="chargeValueRituais(this, ' + hCount + ')" value="' + Alcance + '" type="text" id="ritualAlcance/' + hCount + '" name="ritualAlcance" class="defaultInput ritualInput">';
      content += '</label>';
      content += '<label for="ritualAlvo/' + hCount + '" class="ritualLabel">Alvo:';
      content += '<input onchange="chargeValueRituais(this, ' + hCount + ')" value="' + Alvo + '" type="text" id="ritualAlvo/' + hCount + '" name="ritualAlvo" class="defaultInput ritualInput">';
      content += '</label>';
      content += '<label for="ritualDuracao/' + hCount + '" class="ritualLabel">Duração:';
      content += '<input onchange="chargeValueRituais(this, ' + hCount + ')" value="' + Duracao + '" type="text" id="ritualDuracao/' + hCount + '" name="ritualDuracao" class="defaultInput ritualInput">';
      content += '</label>';
      content += '<label for="ritualResistencia/' + hCount + '" class="ritualLabel">Resistência:';
      content += '<input onchange="chargeValueRituais(this, ' + hCount + ')" value="' + Resistencia + '" type="text" id="ritualResistencia/' + hCount + '" name="ritualResistencia" class="defaultInput ritualInput">';
      content += '</label>';
      content += '<textarea onchange="chargeValueRituais(this, ' + hCount + ')" id="ritualDescri/' + hCount + '" name="ritualDescri" class="defaultInput ritualDescri">' + Descri + '</textarea>';
      content += '<img onclick="escRituais(' + hCount + ')" src="./img/escBtn.png" alt="escRituais" class="btn escRituais">';
      content += '</div>';

      rituais.innerHTML += content;
    }
  }

}

function addRituais() {
  if (!data.rituais) {
    data.rituais = [];
  }

  var hCount = data.rituais.length;
  data.rituais[hCount] = {};
  data.rituais[hCount].ritualName = "[Nome da Ritual]";
  data.rituais[hCount].elementos = [0, 0, 0, 0, 0];
  data.rituais[hCount].ritualCirculo = "";
  data.rituais[hCount].ritualExecucao = "";
  data.rituais[hCount].ritualAlcance = "";
  data.rituais[hCount].ritualAlvo = "";
  data.rituais[hCount].ritualDuracao = "";
  data.rituais[hCount].ritualResistencia = "";
  data.rituais[hCount].ritualDescri = "[Descrição do Ritual]";

  setRituais();
  saveData()
}

function chargeValueRituais(opt, hCount) {
  if (data.rituais) {
    data.rituais[hCount][opt.name] = opt.value;
    saveData()
  }
}

function changeElemento(opt, hCount) {
  if (data.rituais) {
    data.rituais[hCount].elementos[opt] = data.rituais[hCount].elementos[opt] ? 0 : 1;
    setRituais();
    saveData()
  }

}