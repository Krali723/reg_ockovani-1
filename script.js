const URL_CRUD = "https://nodejs-3260.rostiapp.cz/crud/";
const APP_ID = "35d564fb3f63e8b826446864e565b8a7";

async function nactiSeznamZadatelu() {
  let url = URL_CRUD + "read";
  let body = {};
  body.appId = APP_ID;
  let response = await fetch(url, {method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  let s = "";
  for (let item of data.items) {
    s += `<tr><td>${item.obj.jmeno}</td> <td>${item.obj.prijmeni}</td> <td>${item.obj.rodne_c}${item.obj.ctyrcisli}</td><td>${item.obj.o_misto}</td> <td><button value="Upravit" onclick="upravZadatele(${item.id})"><span class="		glyphicon glyphicon-edit
    "></span><button value="Odstranit" onclick="odstranZadatele(${item.id})"><span class="	glyphicon glyphicon-remove-circle"></span></button></td></tr>`; 
      }
      
      document.getElementById("tbody_seznam_zadatelu").innerHTML = s;
      
}  

let idEditace;

async function ulozZadatele() {
  let j = document.getElementById("jmeno").value;
  let p = document.getElementById("prijmeni").value;
  let c = document.getElementById("rodne_c").value;
  let m = document.getElementById("o_misto").value;

  let url = URL_CRUD + "create";
  let body = {};
  body.appId = APP_ID;
  body.obj = {};
  body.obj.jmeno = j;
  body.obj.prijmeni = p;
  body.obj.rodne_c = c;
  body.obj.o_misto = m;
  body.obj.fotka = fotkaUrl;
  if (idEditace) { //=false pro undefined, =true pro jakoukoliv nastavenou hodnotu
    url = URL_CRUD + "update";
    body.id = idEditace;
  }
  let response = await fetch(url, {method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  console.log(data);
  ukazOblast("div_seznam");
  nactiSeznamZadatelu();
}

function pridejZadatele() {
  idEditace = undefined;
  document.getElementById("jmeno").value = "";
  document.getElementById("prijmeni").value = "";
  document.getElementById("rodne_c").value = "";
  document.getElementById("o_misto").value = "";
  document.getElementById("fotka").src = "avatarr.png";

  ukazOblast("div_editace");
}

async function upravZadatele(id) {
  idEditace = id;
  let url = URL_CRUD + "read";
  let body = {};
  body.appId = APP_ID;
  body.id = id;
  let response = await fetch(url, {method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  let item = data.items[0];
  document.getElementById("jmeno").value = item.obj.jmeno;
  document.getElementById("prijmeni").value = item.obj.prijmeni;
  document.getElementById("rodne_c").value = item.obj.rodne_c;
  document.getElementById("o_misto").value = item.obj.o_misto;
  document.getElementById("fotka").src = item.obj.fotka;

  ukazOblast("div_editace");
}

async function odstranZadatele(id) {
  if (!confirm("Opravdu odstranit?")) return;

  idEditace = id;
  let url = URL_CRUD + "delete";
  let body = {};
  body.appId = APP_ID;
  body.id = id;
  let response = await fetch(url, {method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  nactiSeznamZadatelu();
}

let fotkaUrl;
function getBase64Image(img, resize = false) {
    let cnv = document.createElement("canvas");
    if (resize) {
        cnv.width = img.width;
        cnv.height = img.height;
    } else {
        cnv.width = img.naturalWidth;
        cnv.height = img.naturalHeight;
    }

    let ctx = cnv.getContext("2d");
    ctx.drawImage(img, 0, 0, cnv.width, cnv.height);

    return cnv.toDataURL();
}

async function ulozFotku() {
  const file = document.getElementById('file_fotka').files[0];
  if (!file) return; //stisknuto Storno
  let tmppath = URL.createObjectURL(file); //vytvoření dočasného souboru
  console.log(tmppath);
  let img = document.getElementById("fotka");
  img.src = tmppath;
  img.onload = async function(){
    let body = {};
    body.appId = APP_ID;
    body.fileName = file.name;
    body.contentType = file.type;
    body.data = getBase64Image(img, true); //převod obrázku na Base64
    let opt = {};
    opt.method = "POST";
    opt.body = JSON.stringify(body);
    let response = await fetch('https://nodejs-3260.rostiapp.cz/crud/upload', opt);
    let data = await response.json();
    console.log(data);
    fotkaUrl = 'https://nodejs-3260.rostiapp.cz/' + data.savedToFile;
    console.log(fotkaUrl);
    img.onload = null;
  };
}

const oblasti = ["div_editace","div_seznam"];

function ukazOblast(oblast) {
  for (let o of oblasti) {
    let disp = "none";
    if (o == oblast) {
      disp = "block";
    }
    document.getElementById(o).style.display = disp;
  }
}

function poNacteni() {
  ukazOblast("div_seznam");
  nactiSeznamZadatelu();
}