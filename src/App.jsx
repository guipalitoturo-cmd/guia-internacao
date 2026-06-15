import { useState, useRef, useCallback } from "react";

// ─── DADOS ───────────────────────────────────────────────────────────────────
const MEDICO = {
  nome: "Guilherme Bastos Palitot de Brito",
  conselho: "CRM", numero: "29401", uf: "PE", rqe: "13665",
  especialidade: "Urologia", cbo: "2251-04",
};

const CONVENIOS = ["Bradesco Saúde","SulAmérica","Unimed Recife","Maximed","Amil","CASSI","Camed","Saúde Petrobras"];

const TUSS_DB = [
  { codigo:"31205070", nome:"Cirurgia esterilizadora masculina (Vasectomia)", tabela:"22" },
  { codigo:"30715030", nome:"Prostatectomia radical (retropúbica)", tabela:"22" },
  { codigo:"30715013", nome:"Prostatectomia transvesical / retropúbica", tabela:"22" },
  { codigo:"30715048", nome:"Prostatectomia laparoscópica / robótica", tabela:"22" },
  { codigo:"30716019", nome:"Nefrectomia radical", tabela:"22" },
  { codigo:"30716027", nome:"Nefrectomia parcial", tabela:"22" },
  { codigo:"30716035", nome:"Nefrectomia laparoscópica", tabela:"22" },
  { codigo:"30717015", nome:"Cistectomia radical", tabela:"22" },
  { codigo:"30717023", nome:"Ressecção transuretral de bexiga (RTU)", tabela:"22" },
  { codigo:"30718011", nome:"Uretrotomia endoscópica interna", tabela:"22" },
  { codigo:"30719018", nome:"Orquidectomia bilateral", tabela:"22" },
  { codigo:"30719026", nome:"Orquidopexia bilateral", tabela:"22" },
  { codigo:"30715056", nome:"Ressecção transuretral de próstata (RTUP)", tabela:"22" },
  { codigo:"30716043", nome:"Litotripsia endoscópica / ureteroscopia", tabela:"22" },
  { codigo:"30716051", nome:"Nefrolitotomia percutânea (NLPC)", tabela:"22" },
  { codigo:"30714021", nome:"Implante de esfíncter urinário artificial", tabela:"22" },
  { codigo:"30714013", nome:"Sling pubovaginal / TVT / TOT", tabela:"22" },
];

const TUSS_INDEX = [
  {codigo:"30101174",nome:"Correção de deformidades por exérese de tumores e cicatrizes com expansores musculares",tabela:"22"},
  {codigo:"30101182",nome:"Correção de deformidades por exérese de tumores e cicatrizes com expansores cutâneos",tabela:"22"},
  {codigo:"30101522",nome:"Extensos ferimentos ou tumores - excisão e retalhos cutâneos",tabela:"22"},
  {codigo:"30101530",nome:"Extensos ferimentos ou tumores - exérese e emprego de retalhos cutâneos",tabela:"22"},
  {codigo:"30101549",nome:"Extensos ferimentos ou tumores - exérese e retalhos cutâneos à distância",tabela:"22"},
  {codigo:"30101557",nome:"Extensos ferimentos ou tumores - exérese e rotação de retalho fasciocutâneo",tabela:"22"},
  {codigo:"30101565",nome:"Extensos ferimentos ou tumores - exérese e rotação de retalhos miocutâneos",tabela:"22"},
  {codigo:"30101573",nome:"Extensos ferimentos ou tumores - exérese e rotação de retalhos musculares",tabela:"22"},
  {codigo:"30101581",nome:"Extensos ferimentos ou tumores - exérese e enxerto cutâneo",tabela:"22"},
  {codigo:"30101603",nome:"Ferimentos infectados e mordidas de animais (desbridamento)",tabela:"22"},
  {codigo:"30101786",nome:"Sutura de extensos ferimentos com ou sem desbridamento",tabela:"22"},
  {codigo:"30101794",nome:"Sutura de pequenos ferimentos com ou sem desbridamento",tabela:"22"},
  {codigo:"30206243",nome:"Microcirurgia para remoção de cisto ou lesão intracordal",tabela:"22"},
  {codigo:"30210020",nome:"Correção de tumores ou cicatrizes com expansores de tecido",tabela:"22"},
  {codigo:"30210038",nome:"Paralisia facial - reanimação com músculo temporal (oral), sem neurotização",tabela:"22"},
  {codigo:"30210046",nome:"Paralisia facial - reanimação com músculo temporal (orbital), sem neurotização",tabela:"22"},
  {codigo:"30210054",nome:"Paralisia facial - reanimação com músculo temporal (oral), com neurotização",tabela:"22"},
  {codigo:"30210062",nome:"Paralisia facial - reanimação com músculo temporal (orbital e oral), com neurotização",tabela:"22"},
  {codigo:"30210127",nome:"Exérese de tumor benigno, cisto ou fístula",tabela:"22"},
  {codigo:"30212065",nome:"Exérese de cisto branquial",tabela:"22"},
  {codigo:"30212073",nome:"Exérese de cisto tireoglosso",tabela:"22"},
  {codigo:"30212081",nome:"Exérese de tumor benigno, cisto ou fístula cervical",tabela:"22"},
  {codigo:"30212111",nome:"Neuroblastoma cervical - exérese",tabela:"22"},
  {codigo:"30214041",nome:"Tratamento cirúrgico do hiperparatireoidismo primário",tabela:"22"},
  {codigo:"30214068",nome:"Paratireoidectomia total com reimplante primário de paratireóide",tabela:"22"},
  {codigo:"30304059",nome:"Recobrimento conjuntival",tabela:"22"},
  {codigo:"30313015",nome:"Cirurgia da glândula lacrimal",tabela:"22"},
  {codigo:"30313023",nome:"Dacriocistectomia - unilateral",tabela:"22"},
  {codigo:"30313031",nome:"Dacriocistorrinostomia com ou sem intubação - unilateral",tabela:"22"},
  {codigo:"30313040",nome:"Fechamento dos pontos lacrimais",tabela:"22"},
  {codigo:"30313058",nome:"Reconstituição de vias lacrimais com silicone ou outro material",tabela:"22"},
  {codigo:"30313066",nome:"Sondagem das vias lacrimais - com ou sem lavagem",tabela:"22"},
  {codigo:"30313074",nome:"Reconstituição de pontos lacrimais",tabela:"22"},
  {codigo:"30401038",nome:"Exérese de tumor com fechamento primário",tabela:"22"},
  {codigo:"30402034",nome:"Cisto pré-auricular (coloboma auris) - exérese unilateral",tabela:"22"},
  {codigo:"30404150",nome:"Procedimento cirúrgico de implante coclear unilateral",tabela:"22"},
  {codigo:"30404177",nome:"Cirurgia para prótese auditiva percutânea ancorada no osso unilateral",tabela:"22"},
  {codigo:"30404185",nome:"Neurotelemetria transoperatória do implante coclear unilateral",tabela:"22"},
  {codigo:"30502047",nome:"Cisto naso-alveolar e globular - exérese",tabela:"22"},
  {codigo:"30601053",nome:"Fechamento de pleurostomia",tabela:"22"},
  {codigo:"30701040",nome:"Couro cabeludo - transplantes cutâneos",tabela:"22"},
  {codigo:"30701201",nome:"Transplante cutâneo sem microanastomose, ilha neurovascular",tabela:"22"},
  {codigo:"30703085",nome:"Músculos latissimus dorsi, gracilis, rectus femoris - transferência",tabela:"22"},
  {codigo:"30703107",nome:"Primeiro radial externo (extensor carpi radialis longus)",tabela:"22"},
  {codigo:"30712050",nome:"Cruro-podálico",tabela:"22"},
  {codigo:"30722713",nome:"Ressecção de cisto sinovial",tabela:"22"},
  {codigo:"30723078",nome:"Osteomielite ao nível da pelve - tratamento cirúrgico",tabela:"22"},
  {codigo:"30723094",nome:"Fratura de pelve sem aparelho pelve-podálico - tratamento conservador",tabela:"22"},
  {codigo:"30723116",nome:"Fratura ou disjunção ao nível da pelve - tratamento conservador com gesso",tabela:"22"},
  {codigo:"30723124",nome:"Fratura ou disjunção ao nível da pelve - tratamento conservador sem gesso",tabela:"22"},
  {codigo:"30731046",nome:"Cisto sinovial - tratamento cirúrgico",tabela:"22"},
  {codigo:"30803039",nome:"Cisto pulmonar congênito - tratamento cirúrgico",tabela:"22"},
  {codigo:"30804043",nome:"Pleurodese (qualquer técnica)",tabela:"22"},
  {codigo:"30804051",nome:"Pleuroscopia",tabela:"22"},
  {codigo:"30804060",nome:"Pleurostomia (aberta)",tabela:"22"},
  {codigo:"30804175",nome:"Pleurodese por vídeo",tabela:"22"},
  {codigo:"30804183",nome:"Pleuroscopia por vídeo",tabela:"22"},
  {codigo:"30805040",nome:"Cisto ou duplicação brônquica ou esofágica - tratamento cirúrgico",tabela:"22"},
  {codigo:"30805139",nome:"Pericardiotomia com abertura pleuro-pericárdica (qualquer técnica)",tabela:"22"},
  {codigo:"30805198",nome:"Cisto ou duplicação brônquica ou esofágica - tratamento cirúrgico por vídeo",tabela:"22"},
  {codigo:"30805252",nome:"Pericardiotomia com abertura pleuro-pericárdica por vídeo",tabela:"22"},
  {codigo:"30902037",nome:"Comissurotomia valvar",tabela:"22"},
  {codigo:"30906016",nome:"Aneurisma de aorta abdominal infra-renal",tabela:"22"},
  {codigo:"30906024",nome:"Aneurisma de aorta abdominal supra-renal",tabela:"22"},
  {codigo:"30906156",nome:"Artéria renal bilateral revascularização",tabela:"22"},
  {codigo:"30910013",nome:"Aneurisma roto ou trombosado de aorta abdominal abaixo da artéria renal",tabela:"22"},
  {codigo:"30910030",nome:"Aneurismas rotos ou trombosados de aorta abdominal acima da artéria renal",tabela:"22"},
  {codigo:"30912180",nome:"Recanalização arterial no IAM - angioplastia primária com stent coronariano",tabela:"22"},
  {codigo:"30912199",nome:"Recanalização mecânica do IAM (angioplastia primária com balão)",tabela:"22"},
  {codigo:"30917034",nome:"Cardiotomia (ferimento, corpo estranho, exploração)",tabela:"22"},
  {codigo:"31003150",nome:"Cisto mesentérico - tratamento cirúrgico",tabela:"22"},
  {codigo:"31003605",nome:"Cisto mesentérico - tratamento cirúrgico por videolaparoscopia",tabela:"22"},
  {codigo:"31005098",nome:"Cisto de colédoco - tratamento cirúrgico",tabela:"22"},
  {codigo:"31005101",nome:"Colecistectomia com colangiografia",tabela:"22"},
  {codigo:"31005110",nome:"Colecistectomia com fístula biliodigestiva",tabela:"22"},
  {codigo:"31005128",nome:"Colecistectomia sem colangiografia",tabela:"22"},
  {codigo:"31005136",nome:"Colecistojejunostomia",tabela:"22"},
  {codigo:"31005144",nome:"Colecistostomia",tabela:"22"},
  {codigo:"31005187",nome:"Coledocotomia ou coledocostomia sem colecistectomia",tabela:"22"},
  {codigo:"31005357",nome:"Ressecção de cisto hepático com hepatectomia",tabela:"22"},
  {codigo:"31005365",nome:"Ressecção de cisto hepático sem hepatectomia",tabela:"22"},
  {codigo:"31005446",nome:"Coledocotomia ou coledocostomia com colecistectomia",tabela:"22"},
  {codigo:"31005470",nome:"Colecistectomia com colangiografia por videolaparoscopia",tabela:"22"},
  {codigo:"31005489",nome:"Colecistectomia com fístula biliodigestiva por videolaparoscopia",tabela:"22"},
  {codigo:"31005497",nome:"Colecistectomia sem colangiografia por videolaparoscopia",tabela:"22"},
  {codigo:"31005500",nome:"Colecistojejunostomia por videolaparoscopia",tabela:"22"},
  {codigo:"31005519",nome:"Colecistostomia por videolaparoscopia",tabela:"22"},
  {codigo:"31005543",nome:"Coledocotomia ou coledocostomia com colecistectomia por videolaparoscopia",tabela:"22"},
  {codigo:"31005551",nome:"Coledocotomia ou coledocostomia sem colecistectomia por videolaparoscopia",tabela:"22"},
  {codigo:"31005659",nome:"Ressecção de cisto hepático com hepatectomia por videolaparoscopia",tabela:"22"},
  {codigo:"31005667",nome:"Ressecção de cisto hepático sem hepatectomia por videolaparoscopia",tabela:"22"},
  {codigo:"31006108",nome:"Pseudocisto pâncreas - drenagem externa (qualquer técnica)",tabela:"22"},
  {codigo:"31006116",nome:"Pseudocisto pâncreas - drenagem interna (qualquer técnica)",tabela:"22"},
  {codigo:"31006124",nome:"Cisto pancreático - cistojejunoanastomose - tratamento cirúrgico",tabela:"22"},
  {codigo:"31006132",nome:"Cisto pancreático - gastroanastomose - tratamento cirúrgico",tabela:"22"},
  {codigo:"31006175",nome:"Pseudocisto pâncreas - drenagem externa por videolaparoscopia",tabela:"22"},
  {codigo:"31006183",nome:"Pseudocisto pâncreas - drenagem interna por videolaparoscopia",tabela:"22"},
  {codigo:"31009042",nome:"Cisto sacro-coccígeo - tratamento cirúrgico",tabela:"22"},
  {codigo:"31009204",nome:"Neuroblastoma abdominal - exérese",tabela:"22"},
  {codigo:"31009220",nome:"Onfalocele/gastrosquise - tratamento cirúrgico",tabela:"22"},
  {codigo:"31009271",nome:"Ressecção de cisto ou fístula de úraco",tabela:"22"},
  {codigo:"31009280",nome:"Ressecção de cisto ou fístula ou restos do ducto onfalomesentérico",tabela:"22"},
  {codigo:"31101011",nome:"Abscesso renal ou peri-renal - drenagem cirúrgica",tabela:"22"},
  {codigo:"31101020",nome:"Abscesso renal ou peri-renal - drenagem percutânea",tabela:"22"},
  {codigo:"31101038",nome:"Adrenalectomia unilateral",tabela:"22"},
  {codigo:"31101046",nome:"Angioplastia renal unilateral a céu aberto",tabela:"22"},
  {codigo:"31101054",nome:"Angioplastia renal unilateral transluminal",tabela:"22"},
  {codigo:"31101062",nome:"Autotransplante renal unilateral",tabela:"22"},
  {codigo:"31101070",nome:"Biópsia renal cirúrgica unilateral",tabela:"22"},
  {codigo:"31101089",nome:"Cisto renal - escleroterapia percutânea - por cisto",tabela:"22"},
  {codigo:"31101100",nome:"Estenose de junção pieloureteral - tratamento cirúrgico",tabela:"22"},
  {codigo:"31101135",nome:"Marsupialização de cistos renais unilateral",tabela:"22"},
  {codigo:"31101151",nome:"Nefrectomia parcial com ureterectomia",tabela:"22"},
  {codigo:"31101160",nome:"Nefrectomia parcial unilateral",tabela:"22"},
  {codigo:"31101178",nome:"Nefrectomia parcial unilateral extracorpórea",tabela:"22"},
  {codigo:"31101186",nome:"Nefrectomia radical unilateral",tabela:"22"},
  {codigo:"31101194",nome:"Nefrectomia total unilateral",tabela:"22"},
  {codigo:"31101208",nome:"Nefro ou pieloenterocistostomia unilateral",tabela:"22"},
  {codigo:"31101216",nome:"Nefrolitotomia anatrófica unilateral",tabela:"22"},
  {codigo:"31101224",nome:"Nefrolitotomia percutânea unilateral",tabela:"22"},
  {codigo:"31101232",nome:"Nefrolitotomia simples unilateral",tabela:"22"},
  {codigo:"31101240",nome:"Nefrolitotripsia extracorpórea - 1ª sessão",tabela:"22"},
  {codigo:"31101259",nome:"Nefrolitotripsia extracorpórea - reaplicações (até 3 meses)",tabela:"22"},
  {codigo:"31101275",nome:"Nefrolitotripsia percutânea (pneumática ou pneumático-balística)",tabela:"22"},
  {codigo:"31101283",nome:"Nefropexia unilateral",tabela:"22"},
  {codigo:"31101291",nome:"Nefrorrafia (trauma) unilateral",tabela:"22"},
  {codigo:"31101305",nome:"Nefrostomia a céu aberto unilateral",tabela:"22"},
  {codigo:"31101313",nome:"Nefrostomia percutânea unilateral",tabela:"22"},
  {codigo:"31101321",nome:"Nefroureterectomia com ressecção vesical unilateral",tabela:"22"},
  {codigo:"31101330",nome:"Pielolitotomia com nefrolitotomia anatrófica unilateral",tabela:"22"},
  {codigo:"31101348",nome:"Pielolitotomia com nefrolitotomia simples unilateral",tabela:"22"},
  {codigo:"31101356",nome:"Pielolitotomia unilateral",tabela:"22"},
  {codigo:"31101364",nome:"Pieloplastia",tabela:"22"},
  {codigo:"31101399",nome:"Punção aspirativa renal para diagnóstico de rejeição",tabela:"22"},
  {codigo:"31101402",nome:"Punção biópsia renal percutânea",tabela:"22"},
  {codigo:"31101410",nome:"Revascularização renal - qualquer técnica",tabela:"22"},
  {codigo:"31101429",nome:"Sinfisiotomia (rim em ferradura)",tabela:"22"},
  {codigo:"31101437",nome:"Transuretero anastomose",tabela:"22"},
  {codigo:"31101453",nome:"Tumor renal - enucleação unilateral",tabela:"22"},
  {codigo:"31101488",nome:"Adrenalectomia laparoscópica unilateral",tabela:"22"},
  {codigo:"31101496",nome:"Marsupialização laparoscópica de cisto renal unilateral",tabela:"22"},
  {codigo:"31101500",nome:"Biópsia renal laparoscópica unilateral",tabela:"22"},
  {codigo:"31101518",nome:"Nefropexia laparoscópica unilateral",tabela:"22"},
  {codigo:"31101526",nome:"Pieloplastia laparoscópica unilateral",tabela:"22"},
  {codigo:"31101534",nome:"Pielolitotomia laparoscópica unilateral",tabela:"22"},
  {codigo:"31101542",nome:"Nefroureterectomia com ressecção vesical laparoscópica unilateral",tabela:"22"},
  {codigo:"31101550",nome:"Nefrectomia radical laparoscópica unilateral",tabela:"22"},
  {codigo:"31101569",nome:"Nefrectomia parcial laparoscópica unilateral",tabela:"22"},
  {codigo:"31101577",nome:"Nefrolitotripsia percutânea unilateral a laser",tabela:"22"},
  {codigo:"31101585",nome:"Nefrectomia total unilateral por videolaparoscopia",tabela:"22"},
  {codigo:"31101593",nome:"Cisto de supra-renal - tratamento cirúrgico",tabela:"22"},
  {codigo:"31101607",nome:"Pieloplastia na criança",tabela:"22"},
  {codigo:"31101615",nome:"Pieloplastia laparoscópica unilateral na criança",tabela:"22"},
  {codigo:"31102018",nome:"Biópsia cirúrgica de ureter unilateral",tabela:"22"},
  {codigo:"31102026",nome:"Biópsia endoscópica de ureter unilateral",tabela:"22"},
  {codigo:"31102034",nome:"Cateterismo ureteral unilateral",tabela:"22"},
  {codigo:"31102050",nome:"Colocação cistoscópica de duplo J unilateral",tabela:"22"},
  {codigo:"31102069",nome:"Colocação nefroscópica de duplo J unilateral",tabela:"22"},
  {codigo:"31102077",nome:"Colocação ureteroscópica de duplo J unilateral",tabela:"22"},
  {codigo:"31102093",nome:"Duplicação pieloureteral - tratamento cirúrgico unilateral",tabela:"22"},
  {codigo:"31102107",nome:"Fístula uretero-cutânea unilateral (tratamento cirúrgico)",tabela:"22"},
  {codigo:"31102115",nome:"Fístula uretero-intestinal unilateral (tratamento cirúrgico)",tabela:"22"},
  {codigo:"31102123",nome:"Fístula uretero-vaginal unilateral (tratamento cirúrgico)",tabela:"22"},
  {codigo:"31102174",nome:"Reimplante ureterointestinal uni ou bilateral",tabela:"22"},
  {codigo:"31102182",nome:"Reimplante ureteral por via extra ou intravesical unilateral",tabela:"22"},
  {codigo:"31102204",nome:"Reimplante uretero-vesical unilateral - via combinada",tabela:"22"},
  {codigo:"31102220",nome:"Retirada endoscópica de cálculo de ureter unilateral",tabela:"22"},
  {codigo:"31102239",nome:"Transureterostomia",tabela:"22"},
  {codigo:"31102247",nome:"Ureterectomia unilateral",tabela:"22"},
  {codigo:"31102255",nome:"Ureterocele unilateral - ressecção a céu aberto",tabela:"22"},
  {codigo:"31102263",nome:"Ureterocele - tratamento endoscópico unilateral",tabela:"22"},
  {codigo:"31102271",nome:"Ureteroileocistostomia unilateral",tabela:"22"},
  {codigo:"31102280",nome:"Ureteroileostomia cutânea unilateral",tabela:"22"},
  {codigo:"31102298",nome:"Ureterólise unilateral",tabela:"22"},
  {codigo:"31102301",nome:"Ureterolitotomia unilateral",tabela:"22"},
  {codigo:"31102310",nome:"Ureterolitotripsia extracorpórea - 1ª sessão",tabela:"22"},
  {codigo:"31102328",nome:"Ureterolitotripsia extracorpórea - reaplicações (até 3 meses)",tabela:"22"},
  {codigo:"31102344",nome:"Ureteroplastia unilateral",tabela:"22"},
  {codigo:"31102352",nome:"Ureterorrenolitotomia unilateral",tabela:"22"},
  {codigo:"31102360",nome:"Ureterorrenolitotripsia flexível a laser unilateral",tabela:"22"},
  {codigo:"31102379",nome:"Ureterorrenolitotripsia rígida unilateral",tabela:"22"},
  {codigo:"31102409",nome:"Ureterossigmoidoplastia unilateral",tabela:"22"},
  {codigo:"31102417",nome:"Ureterossigmoidostomia unilateral",tabela:"22"},
  {codigo:"31102425",nome:"Ureterostomia cutânea unilateral",tabela:"22"},
  {codigo:"31102433",nome:"Ureterotomia interna percutânea unilateral",tabela:"22"},
  {codigo:"31102441",nome:"Ureterotomia interna ureteroscópica flexível unilateral",tabela:"22"},
  {codigo:"31102450",nome:"Ureterotomia interna ureteroscópica rígida unilateral",tabela:"22"},
  {codigo:"31102468",nome:"Ureteroureterocistoneostomia",tabela:"22"},
  {codigo:"31102476",nome:"Ureteroureterostomia unilateral",tabela:"22"},
  {codigo:"31102492",nome:"Ureterolitotomia laparoscópica unilateral",tabela:"22"},
  {codigo:"31102506",nome:"Ureterólise laparoscópica unilateral",tabela:"22"},
  {codigo:"31102514",nome:"Ureteroureterostomia laparoscópica unilateral",tabela:"22"},
  {codigo:"31102522",nome:"Ureteroplastia laparoscópica unilateral",tabela:"22"},
  {codigo:"31102530",nome:"Correção laparoscópica de refluxo vesico-ureteral unilateral",tabela:"22"},
  {codigo:"31102549",nome:"Reimplante uretero-vesical laparoscópico unilateral",tabela:"22"},
  {codigo:"31102557",nome:"Reimplante ureterointestinal laparoscópico unilateral",tabela:"22"},
  {codigo:"31102565",nome:"Ureterorrenolitotripsia rígida unilateral a laser",tabela:"22"},
  {codigo:"31102573",nome:"Ureteroenterostomia cutânea - unilateral",tabela:"22"},
  {codigo:"31102581",nome:"Ureterolitotripsia transureteroscópica",tabela:"22"},
  {codigo:"31102590",nome:"Refluxo vésico-ureteral - tratamento endoscópico unilateral",tabela:"22"},
  {codigo:"31103022",nome:"Bexiga psóica - tratamento cirúrgico",tabela:"22"},
  {codigo:"31103030",nome:"Biópsia endoscópica de bexiga (inclui cistoscopia)",tabela:"22"},
  {codigo:"31103065",nome:"Cistectomia parcial",tabela:"22"},
  {codigo:"31103073",nome:"Cistectomia radical (inclui próstata ou útero)",tabela:"22"},
  {codigo:"31103081",nome:"Cistectomia total",tabela:"22"},
  {codigo:"31103090",nome:"Cistolitotomia",tabela:"22"},
  {codigo:"31103103",nome:"Cistolitotripsia extracorpórea - 1ª sessão",tabela:"22"},
  {codigo:"31103111",nome:"Cistolitotripsia extracorpórea - reaplicações (até 3 meses)",tabela:"22"},
  {codigo:"31103138",nome:"Cistolitotripsia percutânea",tabela:"22"},
  {codigo:"31103146",nome:"Cistolitotripsia transuretral",tabela:"22"},
  {codigo:"31103154",nome:"Cistoplastia redutora",tabela:"22"},
  {codigo:"31103162",nome:"Cistorrafia (trauma)",tabela:"22"},
  {codigo:"31103170",nome:"Cistostomia cirúrgica",tabela:"22"},
  {codigo:"31103189",nome:"Cistostomia com procedimento endoscópico",tabela:"22"},
  {codigo:"31103197",nome:"Cistostomia por punção com trocater",tabela:"22"},
  {codigo:"31103251",nome:"Enterocistoplastia (ampliação vesical)",tabela:"22"},
  {codigo:"31103413",nome:"Reimplante uretero-vesical à Boari",tabela:"22"},
  {codigo:"31103480",nome:"Neobexiga cutânea continente",tabela:"22"},
  {codigo:"31103499",nome:"Neobexiga retal continente",tabela:"22"},
  {codigo:"31103502",nome:"Neobexiga uretral continente",tabela:"22"},
  {codigo:"31103529",nome:"Cistectomia parcial laparoscópica",tabela:"22"},
  {codigo:"31103537",nome:"Cistectomia radical laparoscópica (inclui próstata ou útero)",tabela:"22"},
  {codigo:"31103545",nome:"Neobexiga laparoscópica",tabela:"22"},
  {codigo:"31103561",nome:"Cistolitotripsia a laser",tabela:"22"},
  {codigo:"31104010",nome:"Abscesso periuretral - tratamento cirúrgico",tabela:"22"},
  {codigo:"31104029",nome:"Biópsia endoscópica de uretra",tabela:"22"},
  {codigo:"31104053",nome:"Divertículo uretral - tratamento cirúrgico",tabela:"22"},
  {codigo:"31104070",nome:"Esfincterotomia - uretra",tabela:"22"},
  {codigo:"31104088",nome:"Fístula uretro-cutânea - correção cirúrgica",tabela:"22"},
  {codigo:"31104096",nome:"Fístula uretro-retal - correção cirúrgica",tabela:"22"},
  {codigo:"31104100",nome:"Fístula uretro-vaginal - correção cirúrgica",tabela:"22"},
  {codigo:"31104126",nome:"Injeções periuretrais por tratamento",tabela:"22"},
  {codigo:"31104142",nome:"Meatotomia uretral",tabela:"22"},
  {codigo:"31104150",nome:"Neouretra proximal (cistouretroplastia)",tabela:"22"},
  {codigo:"31104177",nome:"Ressecção de válvula uretral posterior",tabela:"22"},
  {codigo:"31104185",nome:"Tumor uretral - excisão",tabela:"22"},
  {codigo:"31104193",nome:"Uretroplastia anterior",tabela:"22"},
  {codigo:"31104207",nome:"Uretroplastia posterior",tabela:"22"},
  {codigo:"31104215",nome:"Uretrostomia",tabela:"22"},
  {codigo:"31104223",nome:"Uretrotomia interna",tabela:"22"},
  {codigo:"31104231",nome:"Uretrotomia interna com prótese endouretral",tabela:"22"},
  {codigo:"31104240",nome:"Uretrectomia total",tabela:"22"},
  {codigo:"31104258",nome:"Ressecção de corda da uretra",tabela:"22"},
  {codigo:"31104266",nome:"Uretrotomia externa para retirada de cálculo ou corpo estranho",tabela:"22"},
  {codigo:"31201024",nome:"Abscesso de próstata - drenagem",tabela:"22"},
  {codigo:"31201059",nome:"Eletrovaporização de próstata",tabela:"22"},
  {codigo:"31201113",nome:"Prostatavesiculectomia radical",tabela:"22"},
  {codigo:"31201121",nome:"Prostatectomia a céu aberto",tabela:"22"},
  {codigo:"31201130",nome:"Ressecção endoscópica da próstata",tabela:"22"},
  {codigo:"31201148",nome:"Prostatavesiculectomia radical laparoscópica",tabela:"22"},
  {codigo:"31201156",nome:"Exérese laparoscópica de cisto de vesícula seminal unilateral",tabela:"22"},
  {codigo:"31202020",nome:"Drenagem de abscesso - escroto",tabela:"22"},
  {codigo:"31202047",nome:"Exérese de cisto escrotal",tabela:"22"},
  {codigo:"31203019",nome:"Autotransplante de um testículo",tabela:"22"},
  {codigo:"31203027",nome:"Biópsia unilateral de testículo",tabela:"22"},
  {codigo:"31203035",nome:"Escroto agudo - exploração cirúrgica",tabela:"22"},
  {codigo:"31203051",nome:"Implante de prótese testicular unilateral",tabela:"22"},
  {codigo:"31203108",nome:"Torção de testículo - cura cirúrgica",tabela:"22"},
  {codigo:"31203116",nome:"Tumor de testículo - ressecção",tabela:"22"},
  {codigo:"31203167",nome:"Tumor testicular na criança",tabela:"22"},
  {codigo:"31204066",nome:"Exérese de cisto unilateral",tabela:"22"},
  {codigo:"31205046",nome:"Vasectomia unilateral",tabela:"22"},
  {codigo:"31206093",nome:"Fratura de pênis - tratamento cirúrgico",tabela:"22"},
  {codigo:"31206166",nome:"Neofaloplastia com retalho inguinal com reconstrução uretral",tabela:"22"},
  {codigo:"31206174",nome:"Parafimose - redução manual ou cirúrgica",tabela:"22"},
  {codigo:"31206182",nome:"Pênis curvo congênito - tratamento cirúrgico",tabela:"22"},
  {codigo:"31206247",nome:"Reconstrução de pênis com enxerto - plástica total",tabela:"22"},
  {codigo:"31206255",nome:"Reimplante do pênis",tabela:"22"},
  {codigo:"31302084",nome:"Exérese de cisto vaginal",tabela:"22"},
  {codigo:"31306071",nome:"Seio urogenital - plástica",tabela:"22"},
  {codigo:"31307078",nome:"Liberação de aderências pélvicas com ou sem ressecção de cistos peritoneais",tabela:"22"},
  {codigo:"31307205",nome:"Liberação laparoscópica de aderências pélvicas com ressecção de cistos",tabela:"22"},
  {codigo:"31307299",nome:"Endometriose profunda - tratamento cirúrgico",tabela:"22"},
  {codigo:"31309038",nome:"Assistência ao trabalho de parto (por hora)",tabela:"22"},
  {codigo:"31401066",nome:"Drenagem estereotáxica - cistos, hematomas ou abscessos",tabela:"22"},
  {codigo:"31401228",nome:"Revisão de sistema de neuroestimulação",tabela:"22"},
  {codigo:"31401333",nome:"Tratamento pré-natal das hidrocefalias e cistos cerebrais",tabela:"22"},
  {codigo:"31401392",nome:"Trepanação para propedêutica neurocirúrgica",tabela:"22"},
  {codigo:"31401414",nome:"Localização estereotáxica de lesões de crânio por neuroimagem",tabela:"22"},
  {codigo:"31403131",nome:"Extirpação de neuroma",tabela:"22"},
  {codigo:"31403140",nome:"Implante de gerador para neuroestimulação",tabela:"22"},
  {codigo:"31403255",nome:"Microneurorrafia de dedos da mão",tabela:"22"},
  {codigo:"31403263",nome:"Microneurorrafia múltipla (plexo nervoso)",tabela:"22"},
  {codigo:"31403271",nome:"Microneurorrafia única",tabela:"22"},
  {codigo:"31403298",nome:"Neurotripsia (cada extremidade)",tabela:"22"},
  {codigo:"31403310",nome:"Ressecção de neuroma",tabela:"22"},
  {codigo:"31403360",nome:"Tratamento microcirúrgico das neuropatias compressivas",tabela:"22"},
  {codigo:"31403387",nome:"Neurotomia",tabela:"22"},
  {codigo:"31404022",nome:"Neurotomia seletiva do trigêmio",tabela:"22"},
  {codigo:"31506011",nome:"Transplante renal (receptor e doador vivo ou doador falecido)",tabela:"22"},
  {codigo:"31506038",nome:"Nefrectomia em doador vivo - para transplante",tabela:"22"},
  {codigo:"31506046",nome:"Nefrectomia laparoscópica em doador vivo - para transplante",tabela:"22"},
  {codigo:"31602037",nome:"Anestesia geral ou condutiva para realização de bloqueio neurolítico",tabela:"22"},
  {codigo:"31602100",nome:"Bloqueio de gânglio estrelado com neurolítico",tabela:"22"},
  {codigo:"31602118",nome:"Bloqueio de nervo periférico - bloqueios anestésicos neurolíticos",tabela:"22"},
  {codigo:"31602134",nome:"Bloqueio neurolítico de nervos cranianos ou cérvico-torácico",tabela:"22"},
  {codigo:"31602142",nome:"Bloqueio neurolítico do plexo celíaco, simpático lombar ou torácico",tabela:"22"},
  {codigo:"31602150",nome:"Bloqueio neurolítico peridural ou subaracnóideo",tabela:"22"},
  // Linfadenectomias
  {codigo:"30914043",nome:"Linfadenectomia inguinal ou ilíaca",tabela:"22"},
  {codigo:"30914051",nome:"Linfadenectomia cervical",tabela:"22"},
  {codigo:"30914060",nome:"Linfadenectomia pélvica",tabela:"22"},
  {codigo:"30914078",nome:"Linfadenectomia retroperitoneal",tabela:"22"},
  {codigo:"30914140",nome:"Linfadenectomia pélvica laparoscópica",tabela:"22"},
  {codigo:"30914159",nome:"Linfadenectomia retroperitoneal laparoscópica",tabela:"22"},
  {codigo:"30212090",nome:"Linfadenectomia profunda",tabela:"22"},
  {codigo:"30212103",nome:"Linfadenectomia superficial",tabela:"22"},
  {codigo:"30602130",nome:"Linfadenectomia axilar",tabela:"22"},
  {codigo:"30602190",nome:"Quadrantectomia e linfadenectomia axilar - em mama",tabela:"22"},
  {codigo:"30602343",nome:"Linfadenectomia por incisão extra-axilar",tabela:"22"},
  {codigo:"30805090",nome:"Linfadenectomia mediastinal",tabela:"22"},
  {codigo:"30805228",nome:"Linfadenectomia mediastinal por vídeo",tabela:"22"},
  {codigo:"31001254",nome:"Esofagectomia subtotal com linfadenectomia",tabela:"22"},
  {codigo:"31002064",nome:"Gastrectomia parcial com linfadenectomia",tabela:"22"},
  {codigo:"31002110",nome:"Gastrectomia total com linfadenectomia",tabela:"22"},
  {codigo:"31002307",nome:"Gastrectomia parcial com linfadenectomia por videolaparoscopia",tabela:"22"},
  {codigo:"31002331",nome:"Gastrectomia total com linfadenectomia por videolaparoscopia",tabela:"22"},
  {codigo:"31006078",nome:"Pancreato-duodenectomia com linfadenectomia",tabela:"22"},
];

// Justificativas por PROCEDIMENTO (código TUSS)
const JUST_PROC = {
  "31205070": [
    "Paciente com prole constituída, exercendo seu direito à esterilização voluntária conforme Lei nº 9.263/1996. Realizou período de reflexão obrigatório de 60 dias. Sem contraindicações clínicas ao procedimento.",
    "Paciente em pleno exercício de autonomia reprodutiva, com prole definida e desejo firme de esterilização permanente. Cumprido protocolo legal de 60 dias de reflexão. Indicação eletiva de vasectomia bilateral.",
  ],
  "30715030": [
    "Paciente com diagnóstico de adenocarcinoma de próstata. Indicação de prostatectomia radical por doença localizada, com expectativa de vida superior a 10 anos. Risco cirúrgico avaliado e aceitável.",
    "Neoplasia maligna de próstata localizada (CID C61) com indicação cirúrgica após discussão multidisciplinar. Paciente candidato a prostatectomia radical.",
  ],
  "30715056": [
    "Hiperplasia prostática benigna sintomática (CID N40), refratária a tratamento clínico otimizado por mais de 6 meses. LUTS moderado a grave com impacto significativo na qualidade de vida. Indicação de RTUP.",
  ],
  "30716019": [
    "Neoplasia renal diagnosticada por exame de imagem. Lesão sólida sem evidência de metástase à distância. Indicação de nefrectomia radical por doença localizada.",
  ],
  "30716051": [
    "Nefrolitíase com cálculo de grande volume (>2cm), refratária a tratamento conservador. Indicação de nefrolitotomia percutânea (NLPC). Avaliação pré-operatória realizada.",
  ],
  "30716043": [
    "Ureterolitíase com cálculo ureteral impactado, sem resolução espontânea após período observacional adequado. Indicação de ureteroscopia com litotripsia intracorpórea.",
  ],
  "30717023": [
    "Neoplasia vesical (CID D09.0/C67) com indicação de ressecção transuretral da bexiga para diagnóstico histológico e tratamento. Hematúria persistente com achado endoscópico suspeito.",
  ],
};

// Justificativas por CID-10
const JUST_CID = {
  "Z30.2": [
    "Esterilização voluntária feminina/masculina conforme Lei nº 9.263/1996 (Planejamento Familiar). Paciente com prole constituída, período de reflexão legal cumprido.",
  ],
  "C61": [
    "Adenocarcinoma de próstata localizado. Paciente em estadiamento clínico favorável com indicação de tratamento cirúrgico definitivo.",
    "Neoplasia maligna de próstata (CID C61) com indicação de prostatectomia radical após avaliação multidisciplinar oncológica.",
  ],
  "N40": [
    "Hiperplasia prostática benigna com obstrução infravesical sintomática, refratária ao tratamento farmacológico. Indicação cirúrgica estabelecida.",
  ],
  "C64": [
    "Neoplasia maligna do rim (CID C64), lesão sólida localizada sem metástase. Indicação de nefrectomia após estadiamento completo.",
  ],
  "N20.0": [
    "Calculose renal com cálculo de grandes dimensões, sem eliminação espontânea. Indicação de tratamento cirúrgico minimamente invasivo.",
  ],
  "N20.1": [
    "Calculose ureteral com obstrução. Indicação de ureteroscopia com litotripsia após falha de tratamento conservador.",
  ],
  "N13.1": [
    "Hidronefrose por obstrução da junção ureteropélvica. Indicação de pieloplastia após confirmação da obstrução por cintilografia renal.",
  ],
  "C67": [
    "Neoplasia maligna da bexiga. Indicação de ressecção transuretral para diagnóstico histológico e estadiamento local.",
  ],
  "N32.0": [
    "Obstrução do colo vesical com retenção urinária recorrente, refratária a tratamento clínico. Indicação de intervenção cirúrgica.",
  ],
  "N39.0": [
    "Infecção do trato urinário de repetição com fator obstrutivo identificado. Indicação de correção cirúrgica da causa obstrutiva.",
  ],
};

const OPME_SUGERIDAS = {
  "31205070": [],
  "30715030": [
    { descricao:"Clipe de titânio para hemostasia", quantidade:"1 cx" },
    { descricao:"Fio de sutura absorvível 3-0", quantidade:"2 un" },
  ],
  "30716019": [
    { descricao:"Clipe de titânio (porta-clip laparoscópico)", quantidade:"1 cx" },
    { descricao:"Bisturi harmônico / energia avançada", quantidade:"1 un" },
  ],
  "30715056": [
    { descricao:"Ressectoscópio 26Fr com alça de ressecção", quantidade:"1 un" },
  ],
  "30716051": [
    { descricao:"Nefroscópio percutâneo", quantidade:"1 un" },
    { descricao:"Bainha de acesso percutânea 30Fr", quantidade:"1 un" },
  ],
  default: [],
};

const CID_SUGERIDOS = {
  "31205070":"Z30.2","30715030":"C61","30716019":"C64","30715056":"N40",
  "30717023":"D09.0","30716051":"N20.0","30716043":"N20.1",default:"",
};

const HOSPITAIS_POR_CONVENIO = {
  "Unimed Recife": ["CHUR - Complexo Hospitalar Unimed Recife","HGMI - Hospital Geral Materno Infantil"],
  "Maximed": ["Hospital D'Ávila","RHP - Real Hospital Português","Hospital Esperança Recife","Hospital Memorial STAR","Hospital Santa Joana"],
  default: ["RHP - Real Hospital Português","Hospital Esperança Recife","Hospital Memorial STAR","Hospital Santa Joana"],
};
["Amil","CASSI","Camed","Saúde Petrobras","Bradesco Saúde","SulAmérica"].forEach(cv => {
  if (!HOSPITAIS_POR_CONVENIO[cv]) HOSPITAIS_POR_CONVENIO[cv] = HOSPITAIS_POR_CONVENIO.default;
});

function getHospitais(cv) { return HOSPITAIS_POR_CONVENIO[cv] || HOSPITAIS_POR_CONVENIO.default; }
function searchTUSS(q) {
  if (!q||q.length<2) return [];
  const ql=q.toLowerCase();
  const dbCodes=new Set(TUSS_DB.map(t=>t.codigo));
  const fromDB=TUSS_DB.filter(t=>t.codigo.includes(ql)||t.nome.toLowerCase().includes(ql)).map(t=>({...t,hasTCLE:true}));
  const fromIndex=TUSS_INDEX.filter(t=>!dbCodes.has(t.codigo)&&(t.codigo.includes(ql)||t.nome.toLowerCase().includes(ql)));
  return [...fromDB,...fromIndex].slice(0,10);
}
function getJustificativas(tussCode, cid) {
  const byProc = JUST_PROC[tussCode] || [];
  const byCid  = JUST_CID[cid]  || [];
  const combined = [...new Set([...byProc, ...byCid])];
  return combined.length ? combined : ["Paciente com indicação cirúrgica após avaliação clínica e propedêutica adequadas. Procedimento eletivo com indicação formal estabelecida. Risco cirúrgico avaliado e compatível com o procedimento proposto."];
}
function getOPME(c) { return (OPME_SUGERIDAS[c]||OPME_SUGERIDAS.default).map(o=>({...o})); }
function getCID(c)  { return CID_SUGERIDOS[c]||CID_SUGERIDOS.default; }

// ─── API CALLS ────────────────────────────────────────────────────────────────
async function readInsuranceCard(base64Image, mimeType) {
  const prompt = `Analise esta imagem de carteira de plano de saúde e extraia os dados em JSON. Retorne APENAS o JSON, sem markdown.
Campos: nome, carteira (só números/hifens), validade (MM/AAAA), plano, convenio (mapeie: Bradesco→"Bradesco Saúde", SulAmérica→"SulAmérica", Unimed→"Unimed Recife", Maximed→"Maximed", Amil→"Amil", CASSI→"CASSI", Camed→"Camed", Petrobras→"Saúde Petrobras"), cns.
Se não for carteira: {"erro":"Imagem não reconhecida como carteira de convênio"}`;
  const res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:800,
      messages:[{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:mimeType,data:base64Image}},
        {type:"text",text:prompt}
      ]}]
    })
  });
  const data = await res.json();
  return JSON.parse(data.content?.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
}

// ─── TEMPLATE BRADESCO SAÚDE ─────────────────────────────────────────────────
function gerarGuiaBradesco(dados) {
  const { paciente, medico, procPrincipal, procsSecundarios, justificativa, opmes, carater, regime, diarias, cid } = dados;
  const hospital = paciente.hospital === "__outro__" ? (paciente.hospitalCustom||"") : paciente.hospital;
  const dataHoje = new Date().toLocaleDateString("pt-BR");
  const regimeTexto = {"1":"Hospitalar","2":"Hospital-dia","3":"Domiciliar"}[regime]||"Hospitalar";
  const caraterTexto = carater==="E"?"Eletivo":"Urgência/Emergência";
  const todosProcs = [procPrincipal, ...procsSecundarios].filter(Boolean);
  const nGuia = String(Date.now()).slice(-7);
  const temOPME = opmes && opmes.filter(o=>o.descricao).length > 0;

  const procRows = Array.from({length:12},(_,i)=>{
    const p = todosProcs[i];
    return `<tr>
      <td style="border:1px solid #000;border-top:none;padding:1px 3px;font-size:6.5pt;white-space:nowrap;">${i+1}&nbsp;-&nbsp;${p?p.tabela||"":""}</td>
      <td style="border:1px solid #000;border-top:none;border-left:none;padding:1px 3px;font-size:6.5pt;">${p?p.codigo||"":""}</td>
      <td style="border:1px solid #000;border-top:none;border-left:none;padding:1px 3px;font-size:6.5pt;">${p?p.nome||"":""}</td>
      <td style="border:1px solid #000;border-top:none;border-left:none;padding:1px 3px;font-size:6.5pt;text-align:center;">${p?"1":""}</td>
      <td style="border:1px solid #000;border-top:none;border-left:none;padding:1px 3px;font-size:6.5pt;"></td>
    </tr>`;
  }).join("");

  // Logo Bradesco Saúde (SVG fiel ao oficial)
  const logo = `<svg width="130" height="52" viewBox="0 0 130 52" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="40" height="40" rx="8" fill="#CC0000"/>
    <path d="M10 8 L10 33 L22 33 Q32 33 32 26 Q32 21 26 20 Q31 18 31 13 Q31 8 22 8 Z
             M17 14 L20 14 Q24 14 24 17 Q24 20 20 20 L17 20 Z
             M17 24 L21 24 Q26 24 26 27.5 Q26 31 21 31 L17 31 Z" fill="white"/>
    <text x="48" y="24" font-family="Arial,sans-serif" font-weight="bold" font-size="15" fill="#CC0000" letter-spacing="-0.3">bradesco</text>
    <text x="48" y="38" font-family="Arial,sans-serif" font-size="11" fill="#CC0000">saúde</text>
  </svg>`;

  const C = "#CC0000"; // vermelho Bradesco
  const hdr = `background:${C};color:#fff;font-weight:bold;font-size:7pt;padding:2px 4px;`;
  const lbl = `font-size:5.5pt;color:#333;display:block;padding:1px 2px 0;line-height:1.2;`;
  const val = `display:block;padding:1px 3px 2px;font-size:7pt;min-height:13px;`;
  const cel = `border:1px solid #000;vertical-align:top;padding:0;`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
@page { margin: 0; size: A4 portrait; }
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;font-size:7pt;width:210mm;min-height:297mm;padding:5mm 5mm 4mm 5mm;color:#000;}
table{border-collapse:collapse;width:100%;table-layout:fixed;}
</style>
</head>
<body>

<!-- CABEÇALHO -->
<table style="margin-bottom:3px;border-collapse:collapse;">
  <tr>
    <td style="width:38%;padding:2px 4px;vertical-align:middle;">${logo}</td>
    <td style="width:38%;text-align:center;vertical-align:middle;padding:4px 0;">
      <div style="font-size:12pt;font-weight:bold;color:${C};line-height:1.25;">GUIA DE SOLICITAÇÃO<br>DE INTERNAÇÃO</div>
    </td>
    <td style="width:24%;border:1.5px solid #000;padding:3px 5px;vertical-align:top;">
      <span style="${lbl}">2 - N.º Guia no Prestador</span>
      <span style="font-size:10pt;font-weight:bold;display:block;margin-top:1px;">${nGuia}</span>
    </td>
  </tr>
</table>

<!-- CAMPOS 1 E 3 -->
<table>
  <tr>
    <td style="${cel}width:22%;">
      <span style="${lbl}">1 - Registro ANS</span>
      <span style="${val}">005711</span>
    </td>
    <td style="${cel}border-left:none;width:78%;">
      <span style="${lbl}">3 - Número da Guia Atribuído pela Operadora</span>
      <span style="${val}"> </span>
    </td>
  </tr>
  <tr>
    <td style="${cel}border-top:none;width:22%;">
      <span style="${lbl}">4 - Data da Autorização</span>
      <span style="${val}"> </span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:78%;">
      <table style="border-collapse:collapse;width:100%;">
        <tr>
          <td style="width:50%;vertical-align:top;padding:0;">
            <span style="${lbl}">5 - Senha</span>
            <span style="${val}"> </span>
          </td>
          <td style="width:50%;border-left:1px solid #000;vertical-align:top;padding:0;">
            <span style="${lbl}">6 - Data de Validade da Senha</span>
            <span style="${val}"> </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- DADOS DO BENEFICIÁRIO -->
<table style="margin-top:2px;">
  <tr><td colspan="3" style="${hdr}">Dados do Beneficiário</td></tr>
  <tr>
    <td style="${cel}border-top:none;width:58%;">
      <span style="${lbl}">7 - Número da Carteira</span>
      <span style="${val}">${paciente.carteira||""}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:26%;">
      <span style="${lbl}">8 - Validade da Carteira</span>
      <span style="${val}">${paciente.validade||""}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:16%;">
      <span style="${lbl}">9 - Atendimento a RN</span>
      <span style="${val}"> </span>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="${cel}border-top:none;">
      <span style="${lbl}">50 - Nome Social</span>
      <span style="${val}"> </span>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="${cel}border-top:none;">
      <span style="${lbl}">10 - Nome</span>
      <span style="${val}font-weight:bold;">${paciente.nome||""}</span>
    </td>
  </tr>
</table>

<!-- DADOS DO CONTRATADO SOLICITANTE -->
<table style="margin-top:2px;">
  <tr><td colspan="5" style="${hdr}">Dados do Contratado Solicitante</td></tr>
  <tr>
    <td style="${cel}border-top:none;width:28%;">
      <span style="${lbl}">12 - Código na Operadora</span>
      <span style="${val}"> </span>
    </td>
    <td colspan="4" style="${cel}border-top:none;border-left:none;width:72%;">
      <span style="${lbl}">13 - Nome do Contratado</span>
      <span style="${val}">Dr. ${medico.nome}</span>
    </td>
  </tr>
  <tr>
    <td style="${cel}border-top:none;width:34%;">
      <span style="${lbl}">14 - Nome do Profissional Solicitante</span>
      <span style="${val}">Dr. ${medico.nome}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:11%;">
      <span style="${lbl}">15 - Conselho Profissional</span>
      <span style="${val}">${medico.conselho}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:28%;">
      <span style="${lbl}">16 - Número no Conselho</span>
      <span style="${val}">${medico.numero}-${medico.uf}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:8%;">
      <span style="${lbl}">17 - UF</span>
      <span style="${val}">${medico.uf}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:19%;">
      <span style="${lbl}">18 - Código CBO</span>
      <span style="${val}">${medico.cbo}</span>
    </td>
  </tr>
</table>

<!-- DADOS DO HOSPITAL / INTERNAÇÃO -->
<table style="margin-top:2px;">
  <tr><td colspan="6" style="${hdr}">Dados do Hospital/Local Solicitado/Dados da Internação</td></tr>
  <tr>
    <td style="${cel}border-top:none;width:24%;">
      <span style="${lbl}">19 - Código na Operadora/CNPJ</span>
      <span style="${val}"> </span>
    </td>
    <td colspan="4" style="${cel}border-top:none;border-left:none;width:52%;">
      <span style="${lbl}">20 - Nome do Hospital/Local Solicitado</span>
      <span style="${val}">${hospital}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:24%;">
      <span style="${lbl}">21 - Data Sugerida para Internação</span>
      <span style="${val}">${dataHoje}</span>
    </td>
  </tr>
  <tr>
    <td style="${cel}border-top:none;width:14%;">
      <span style="${lbl}">22 - Caráter do Atendimento</span>
      <span style="${val}">${caraterTexto}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:14%;">
      <span style="${lbl}">23 - Tipo de Internação</span>
      <span style="${val}">Cirúrgico</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:18%;">
      <span style="${lbl}">24 - Regime de Internação</span>
      <span style="${val}">${regimeTexto}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:18%;">
      <span style="${lbl}">25 - Qtde. Diárias Solicitadas</span>
      <span style="${val}">${diarias}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:18%;">
      <span style="${lbl}">26 - Previsão de Uso de OPME</span>
      <span style="${val}">${temOPME?"Sim":"Não"}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:18%;">
      <span style="${lbl}">27 - Previsão de Uso de Quimioterápico</span>
      <span style="${val}">Não</span>
    </td>
  </tr>
  <tr>
    <td colspan="6" style="${cel}border-top:none;">
      <span style="${lbl}">28 - Indicação Clínica</span>
      <div style="padding:2px 3px;min-height:58px;font-size:7pt;white-space:pre-wrap;line-height:1.35;">${justificativa||""}</div>
    </td>
  </tr>
</table>

<!-- CIDs -->
<table>
  <tr>
    <td style="${cel}border-top:none;width:18%;">
      <span style="${lbl}">29 - CID 10 Principal (Opcional)</span>
      <span style="${val}">${cid||""}</span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:14%;">
      <span style="${lbl}">30 - CID 10 (2) (Opcional)</span>
      <span style="${val}"> </span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:14%;">
      <span style="${lbl}">31 - CID 10 (3) (Opcional)</span>
      <span style="${val}"> </span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:14%;">
      <span style="${lbl}">32 - CID 10 (4) (Opcional)</span>
      <span style="${val}"> </span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:40%;">
      <span style="${lbl}">33 - Indicação de Acidente (Acidente ou Doença Relacionada)</span>
      <span style="${val}"> </span>
    </td>
  </tr>
</table>

<!-- PROCEDIMENTOS -->
<table style="margin-top:2px;">
  <tr><td colspan="5" style="${hdr}">Procedimentos ou Itens Assistenciais Solicitados</td></tr>
  <tr style="background:#f5f5f5;">
    <th style="border:1px solid #000;border-top:none;padding:2px 3px;font-size:6pt;width:28%;text-align:left;font-weight:bold;">34 - Tabela&nbsp;&nbsp;&nbsp;35 - Código do Procedimento ou Item Assistencial</th>
    <th style="border:1px solid #000;border-top:none;border-left:none;padding:2px 3px;font-size:6pt;width:0%;display:none;"></th>
    <th style="border:1px solid #000;border-top:none;border-left:none;padding:2px 3px;font-size:6pt;width:46%;text-align:left;font-weight:bold;">36 - Descrição</th>
    <th style="border:1px solid #000;border-top:none;border-left:none;padding:2px 3px;font-size:6pt;width:13%;text-align:center;font-weight:bold;">37 - Qtde. Solic.</th>
    <th style="border:1px solid #000;border-top:none;border-left:none;padding:2px 3px;font-size:6pt;width:13%;text-align:center;font-weight:bold;">38 - Qtde. Aut.</th>
  </tr>
  ${procRows}
</table>

<!-- DADOS DA AUTORIZAÇÃO -->
<table style="margin-top:2px;">
  <tr><td colspan="3" style="${hdr}">Dados da Autorização</td></tr>
  <tr>
    <td style="${cel}border-top:none;width:34%;">
      <span style="${lbl}">39 - Data Provável da Admissão Hospitalar</span>
      <span style="${val}"> </span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:32%;">
      <span style="${lbl}">40 - Qtde. Diárias Autorizadas</span>
      <span style="${val}"> </span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:34%;">
      <span style="${lbl}">41 - Tipo de Acomodação Autorizada</span>
      <span style="${val}"> </span>
    </td>
  </tr>
  <tr>
    <td style="${cel}border-top:none;width:34%;">
      <span style="${lbl}">42 - Código na Operadora/CNPJ Autorizado</span>
      <span style="${val}"> </span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:46%;">
      <span style="${lbl}">43 - Nome do Hospital/Local Autorizado</span>
      <span style="${val}"> </span>
    </td>
    <td style="${cel}border-top:none;border-left:none;width:20%;">
      <span style="${lbl}">44 - Código CNES</span>
      <span style="${val}"> </span>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="${cel}border-top:none;">
      <span style="${lbl}">45 - Observação/Justificativa</span>
      <div style="padding:2px 3px;min-height:44px;font-size:7pt;"> </div>
    </td>
  </tr>
</table>

<!-- ASSINATURAS -->
<table style="margin-top:2px;">
  <tr>
    <td style="${cel}width:22%;">
      <span style="${lbl}">46 - Data da Solicitação</span>
      <span style="${val}">${dataHoje}</span>
    </td>
    <td style="${cel}border-left:none;width:26%;">
      <span style="${lbl}">47 - Assinatura do Profissional Solicitante</span>
      <div style="height:28px;"> </div>
    </td>
    <td style="${cel}border-left:none;width:26%;">
      <span style="${lbl}">48 - Assinatura do Beneficiário ou Responsável</span>
      <div style="height:28px;"> </div>
    </td>
    <td style="${cel}border-left:none;width:26%;">
      <span style="${lbl}">49 - Assinatura do Responsável pela Autorização</span>
      <div style="height:28px;"> </div>
    </td>
  </tr>
</table>

</body>
</html>`;
}

// ─── GERADOR DE PDF / GUIA ────────────────────────────────────────────────────
async function gerarPDF(dados) {
  const { convenio, paciente, medico, procPrincipal, procsSecundarios, justificativa, opmes, carater, regime, diarias, cid } = dados;

  // Bradesco usa template estático fiel ao formulário TISS oficial
  if (convenio === "Bradesco Saúde") {
    return gerarGuiaBradesco(dados);
  }

  const hospital = paciente.hospital === "__outro__" ? (paciente.hospitalCustom||"") : paciente.hospital;
  const todosProcs = [procPrincipal, ...procsSecundarios].filter(Boolean);
  const dataHoje = new Date().toLocaleDateString("pt-BR");
  const regimeTexto = {"1":"Hospitalar","2":"Hospital-dia","3":"Domiciliar"}[regime]||"Hospitalar";
  const caraterTexto = carater==="E"?"Eletivo":"Urgência/Emergência";

  const prompt = `Você é um gerador de guias médicas em HTML. Gere uma guia de solicitação de internação completa em HTML, pronta para imprimir em A4.

CONVÊNIO: ${convenio}
DADOS DO PACIENTE: Nome: ${paciente.nome} | Carteira: ${paciente.carteira} | Validade: ${paciente.validade} | Plano: ${paciente.plano||""} | CNS: ${paciente.cns||""}
MÉDICO: ${medico.nome} | ${medico.conselho} ${medico.numero}-${medico.uf} | RQE ${medico.rqe} | CBO ${medico.cbo}
HOSPITAL: ${hospital}
INTERNAÇÃO: Caráter: ${caraterTexto} | Regime: ${regimeTexto} | Diárias: ${diarias}
PROCEDIMENTO PRINCIPAL: ${procPrincipal?.codigo} - ${procPrincipal?.nome} (Tabela ${procPrincipal?.tabela})
PROCEDIMENTOS SECUNDÁRIOS: ${procsSecundarios.map(p=>`${p.codigo} - ${p.nome}`).join("; ")||"Nenhum"}
CID-10 PRINCIPAL: ${cid}
INDICAÇÃO CLÍNICA: ${justificativa}
OPMEs: ${opmes.map(o=>`${o.descricao} (${o.quantidade})`).join("; ")||"Nenhum"}
DATA: ${dataHoje}

Gere um HTML completo e bem formatado que:
1. Tenha o cabeçalho com nome/logo do convênio (${convenio}) e título "GUIA DE SOLICITAÇÃO DE INTERNAÇÃO"
2. Use tabelas HTML para os campos, com bordas finas, fiel ao padrão da ANS/TISS
3. Cores do convênio: SulAmérica=azul(#003DA5), Unimed=verde(#006633), Maximed=vermelho(#C0392B), Amil=azul(#003DA5), CASSI=azul(#003F87) laranja(#F7941D), Camed=verde(#007A3D), Saúde Petrobras=verde(#009640)
4. Todos os campos preenchidos com os dados acima
5. Seções: Dados do Beneficiário, Dados do Contratado Solicitante, Dados do Hospital/Internação, Indicação Clínica, CIDs, Procedimentos, OPMEs (se houver), Dados da Autorização, Assinaturas
6. CSS inline para impressão A4 (max-width:210mm, font-size:8pt, padding:15mm). OBRIGATÓRIO incluir no <style>: @page { margin: 0; size: A4; } para suprimir URL e numeração automática do navegador.
7. Campos não preenchidos devem aparecer em branco (não escrever "N/A" nem traços)
8. Retorne APENAS o HTML completo começando com <!DOCTYPE html>, sem markdown`;

  const res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:4000,
      messages:[{role:"user",content:prompt}]
    })
  });
  const data = await res.json();
  const html = data.content?.map(b=>b.text||"").join("").replace(/```html|```/g,"").trim();
  return html;
}


// ─── TCLE DATA ────────────────────────────────────────────────────────────────
const TCLE_DB = {
  "30714013": {
    titulo: "CORREÇÃO CIRÚRGICA DE INCONTINÊNCIA URINÁRIA – SLING SINTÉTICO",
    procedimento: "CORREÇÃO CIRÚRGICA DE INCONTINÊNCIA URINÁRIA – SLING SINTÉTICO",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Procedimento cirúrgico que consiste na implantação de uma tela sintética (sling) sob a uretra para corrigir a incontinência urinária de esforço, restaurando o mecanismo de continência.",
    sintomas: [
      "Dor pélvica e vaginal de leve a moderada intensidade, geralmente controlada com analgésicos prescritos.",
      "Sangramento vaginal leve a moderado nos primeiros dias, com possível corrimento serossanguinolento por até algumas semanas durante a cicatrização.",
      "Sensação de pressão/peso pélvico e desconforto ao sentar ou caminhar nos primeiros dias.",
      "Edema (inchaço) e equimoses em vulva/períneo ou virilha; sensibilidade aumentada na região operada.",
      "Desconforto ao urinar (ardor leve) nas primeiras 24–72 horas, com possível urgência/frequência urinária transitórias; em alguns casos, dificuldade para urinar exigindo cateterismo temporário conforme orientação médica.",
      "Se houver tampão vaginal: sensação de corpo estranho até a retirada conforme orientação da equipe.",
    ],
    riscos: [
      "Retenção urinária necessitando passagem de cateter na bexiga por um período prolongado.",
      "Necessidade de reparo da uretra ou bexiga durante o ato cirúrgico e permanência do cateter vesical por período prolongado.",
      "Sangramento vaginal e formação de hematomas (coleção de sangue), podendo requerer drenagem.",
      "Retenção urinária persistente, podendo requerer nova cirurgia para correção.",
      "Suspensão do ato cirúrgico por impossibilidade de realização do bloqueio anestésico raquimedular, na eventualidade da anestesia geral estar contra indicada.",
      "Infecção da incisão cirúrgica, requerendo tratamento posterior (antibiótico ou cirurgia).",
      "Necessidade de transfusão sanguínea durante ou após a operação.",
      "Não há garantia absoluta de cura da incontinência urinária, podendo ser necessário tratamento adicional no futuro.",
      "Trombose venosa e embolia pulmonar (coágulos de sangue oriundos das veias).",
      "Possibilidade de suspensão do procedimento imediatamente antes ou mesmo durante a cirurgia por alterações clínicas imprevistas.",
      "Complicações relacionadas à tela (sling sintético), como infecção, extrusão ou erosão para a uretra ou vagina, podendo requerer remoção por novo procedimento cirúrgico.",
      "Aparecimento ou agravamento de incontinência urinária de urgência no pós-operatório, podendo requerer fisioterapia, medicamentos ou outras formas de tratamento.",
      "Disfunção sexual, como dor durante as relações sexuais ou diminuição da sensibilidade genital, podendo requerer avaliação e tratamento especializado.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30714021": {
    titulo: "IMPLANTE DE ESFÍNCTER URINÁRIO ARTIFICIAL",
    procedimento: "IMPLANTE DE ESFÍNCTER URINÁRIO ARTIFICIAL",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia de implante de dispositivo protético (esfíncter urinário artificial) para tratamento da incontinência urinária grave, composto por manguito, reservatório pressurizado e bomba escrotal que controla a abertura e fechamento da uretra.",
    sintomas: [
      "Dor pélvica e perineal de leve a moderada intensidade, geralmente controlada com analgésicos prescritos.",
      "Sensação de pressão/peso pélvico e escrotal com desconforto ao sentar ou caminhar nos primeiros dias.",
      "Edema (inchaço) e equimoses em escroto/períneo; sensibilidade aumentada na região operada.",
      "Desconforto ao urinar (ardor leve) e pequena quantidade de sangue na urina (hematúria leve), com possível urgência/frequência urinária transitórias; em alguns casos, dificuldade para urinar exigindo cateterismo temporário conforme orientação médica.",
      "Dor local das incisões perineais e/ou abdominais, equimose e pequena secreção serossanguinolenta na ferida nos primeiros dias.",
      "Dificuldade temporária para acionar a bomba escrotal nos primeiros dias após ativação.",
    ],
    riscos: [
      "Suspensão do procedimento antes ou durante a cirurgia devido a intercorrências clínicas, como picos hipertensivos, falhas anestésicas ou dificuldade na passagem de sonda uretral.",
      "Retenção urinária no pós-operatório, com necessidade de cateterismo uretral ou cistostomia temporária.",
      "Deiscência (abertura) de pontos da ferida cirúrgica.",
      "Hematomas ou edemas escrotais e/ou perineais.",
      "Infecção da incisão cirúrgica, com possível necessidade de retirada do dispositivo.",
      "Lesões na bexiga ou uretra, que podem impedir a colocação do esfíncter, exigindo o uso temporário de sonda vesical, cirurgia reparadora e reprogramação do procedimento.",
      "Disfunção erétil: embora não haja relação direta, alguns pacientes podem apresentar dificuldades de ereção após a cirurgia devido à manipulação da região genital.",
      "Perda de sensibilidade escrotal ou perineal.",
      "Dor persistente nas regiões operadas.",
      "Migração do dispositivo para o interior da uretra, infecção, mau funcionamento ou falhas técnicas do esfíncter, que podem levar à necessidade de retirada parcial ou total do dispositivo.",
      "Retenção urinária pós-ativação, com necessidade de sondagem ou nova cirurgia.",
      "Necessidade de troca futura do esfíncter por desgaste, falha ou perda da função do dispositivo.",
      "Dificuldade do paciente em acionar o pump, podendo levar à inativação permanente do dispositivo ou necessidade de retirada por falha funcional.",
      "Distúrbios funcionais da bexiga, como baixa capacidade ou contrações durante o enchimento, podendo levar a micções frequentes e à persistência ou retorno da incontinência urinária, exigindo tratamento complementar.",
      "Lesão de estruturas adjacentes na pelve, como intestino e vasos sanguíneos.",
      "Não há garantia de cura completa da incontinência urinária, podendo haver persistência parcial ou total do quadro. Casos de insatisfação poderão requerer outros procedimentos cirúrgicos para ajuste, substituição ou retirada do dispositivo.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30715013": {
    titulo: "PROSTATECTOMIA PARA H.P.B. (TRANSVESICAL OU RETROPÚBICA)",
    procedimento: "PROSTATECTOMIA PARA H.P.B. (TRANSVESICAL OU RETROPÚBICA)",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia para remoção do adenoma prostático (Hiperplasia Prostática Benigna) por via transvesical ou retropúbica, indicada para próstatas de grande volume que causam obstrução urinária significativa.",
    sintomas: [
      "Ardor/dor ao urinar (disúria), sensação de urgência e aumento da frequência urinária.",
      "Pequena quantidade de sangue na urina (hematúria leve) e/ou no sêmen (hematospermia).",
      "Desconforto leve em períneo, pênis, uretra ou região suprapúbica.",
      "Saída de \"debris\" (pequenos fragmentos/filamentos) ou coágulos pela urina.",
      "Uso de sonda vesical por período variável, conforme orientação médica.",
      "Possibilidade de mudança no volume de ejaculação (pode reduzir) ou ausência de emissão de sêmen durante o orgasmo (ejaculação retrógrada).",
    ],
    riscos: [
      "Suspensão do ato cirúrgico por impossibilidade de realização de bloqueio anestésico raquimedular, na eventualidade da anestesia geral estar contra indicada.",
      "Dor ou desconforto na uretra ou na região da incisão cirúrgica, requerendo uso de medicamentos analgésicos.",
      "Detecção de câncer no material retirado, identificado somente no exame anatomopatológico pós-operatório, mesmo que exames prévios tenham descartado essa possibilidade.",
      "Possibilidade de necessidade de colocação de um dreno abdominal para drenar coleções internas de líquido ou sangue.",
      "Necessidade de transfusão sanguínea devido a sangramento intraoperatório.",
      "Edema, hematoma e/ou infecção da incisão cirúrgica, requerendo tratamento médico ou cirúrgico posterior.",
      "Possibilidade de extravasamento de urina pela incisão ou pelo dreno, caracterizando uma fístula urinária.",
      "Risco de sangramento urinário no pós-operatório, podendo requerer reinternação hospitalar e novo procedimento cirúrgico.",
      "Cicatrização esteticamente inadequada da incisão por fatores individuais (ex: quelóide, cicatriz hipertrófica).",
      "Possibilidade de permanecer sem a emissão do sêmen durante o orgasmo (ejaculação retrógrada).",
      "Incontinência urinária, de forma temporária ou definitiva.",
      "Possibilidade remota de impotência sexual (disfunção erétil).",
      "Embolia pulmonar (coágulos sanguíneos originados nas veias).",
      "Necessidade de retratamento no futuro (em aproximadamente 10% dos pacientes).",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30715030": {
    titulo: "PRÓSTATO-VESICULECTOMIA RADICAL RETROPÚBICA",
    procedimento: "PRÓSTATO-VESICULECTOMIA RADICAL RETROPÚBICA",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia de retirada total da próstata e vesículas seminais por via retropúbica, indicada para tratamento do câncer de próstata localizado, com o objetivo de remover completamente o tumor.",
    sintomas: [
      "Dor abdominal ou à palpação abdominal, associada ou não a gases e distensão abdominal, requerendo medicação analgésica.",
      "Vômito ou náusea, principalmente nos primeiros dias.",
      "Alteração do ritmo intestinal, podendo levar alguns dias para normalizar.",
      "Presença de sangue em pequena quantidade na urina.",
      "Desconforto decorrentes da presença de drenos, sondas.",
      "Sensação de dormência, edema ou hematomas em torno da região operada e das feridas operatórias.",
      "Saída de secreção sanguinolenta ou serosa pelas feridas operatórias, com necessidade de monitorização.",
      "Perda de apetite temporária ou perda de peso discreta.",
    ],
    riscos: [
      "Possibilidade de infecção na incisão cirúrgica.",
      "Necessidade de transfusão sanguínea durante ou após a operação.",
      "Incapacidade de obter ou manter a ereção peniana (impotência sexual).",
      "Incontinência urinária (perdas de urina em diversas situações).",
      "Estreitamento da bexiga e/ou uretra, requerendo dilatações ou futuros procedimentos.",
      "Possibilidade de dano à parede do reto (podendo raramente requerer colostomia temporária).",
      "Possibilidade de lesões no trato urinário entre elas ureter por aderências ou sangramento.",
      "Possibilidade de embolia pulmonar (coágulos de sangue oriundos das veias).",
      "Possibilidade de haver fístula urinária podendo requerer uso de cateter vesical por tempo mais prolongado que o esperado e, mais raramente, necessidade de tratamento cirúrgico.",
      "Possibilidade de ocorrer sangramento com coleção de sangue (hematoma) podendo requerer tratamento adicional.",
      "Possibilidade de haver hérnia incisional e sensação de dormência em torno do acesso cirúrgico.",
      "Necessidade de medicamentos analgésicos devido a dor no local da cirurgia.",
      "Não há garantia absoluta da cura do câncer podendo haver necessidade de tratamento complementar no futuro.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30715048": {
    titulo: "PRÓSTATO-VESICULECTOMIA RADICAL ROBÓTICA OU VIDEOLAPAROSCÓPICA",
    procedimento: "PRÓSTATO-VESICULECTOMIA RADICAL ROBÓTICA OU VIDEOLAPAROSCÓPICA",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia minimamente invasiva de retirada total da próstata e vesículas seminais por via robótica ou videolaparoscópica, indicada para o tratamento do câncer de próstata localizado.",
    sintomas: [
      "Dor abdominal discreta ou à palpação abdominal, associada ou não a gases e distensão abdominal, requerendo medicação analgésica.",
      "Vômito ou náusea, principalmente nos primeiros dias.",
      "Alteração do ritmo intestinal, podendo levar alguns dias para normalizar.",
      "Presença de sangue em pequena quantidade na urina.",
      "Desconforto decorrentes da presença de drenos, sondas.",
      "Sensação de dormência, edema ou hematomas em torno da região operada e das feridas operatórias.",
      "Saída de secreção sanguinolenta ou serosa pelas feridas operatórias, com necessidade de monitorização.",
      "Perda de apetite temporária ou perda de peso discreta.",
    ],
    riscos: [
      "Possibilidade da não realização da cirurgia por dificuldades técnicas identificadas no transoperatório.",
      "Necessidade de transfusão sanguínea durante ou após a operação.",
      "Incapacidade de obter ou manter a ereção peniana (impotência sexual).",
      "Incontinência urinária (perdas de urina em diversas situações).",
      "Estreitamento da bexiga e/ou uretra, requerendo dilatações ou futuros procedimentos.",
      "Possibilidade de dano à parede do reto (podendo raramente requerer colostomia temporária).",
      "Possibilidade de ocorrer sangramento com coleção de sangue (hematoma) podendo requerer tratamento adicional.",
      "Possibilidade de infecção na incisão cirúrgica, requerendo futuro tratamento.",
      "Possibilidade de embolia pulmonar (coágulos de sangue oriundos das veias).",
      "Possibilidade de haver hérnia incisional e sensação de dormência em torno do acesso cirúrgico.",
      "Possibilidade de haver fístula urinária podendo requerer uso de cateter vesical por tempo mais prolongado que o esperado e, mais raramente, necessidade de tratamento cirúrgico.",
      "Necessidade de medicamentos analgésicos devido a dor no local da cirurgia.",
      "Possibilidade de enfisema subcutâneo (acúmulo de gás sob a pele).",
      "Possibilidade de traumas vasculares na parede abdominal podendo levar a hematoma.",
      "Possibilidade de embolia gasosa, ainda que extremamente rara.",
      "Possibilidade de traumas vasculares intra-abdominais no momento da punção, na colocação do primeiro trocarte ou no intra operatório.",
      "Possibilidade de lesões no aparelho digestório no momento da punção.",
      "Possibilidade de lesões no trato urinário entre elas ureter por aderências ou sangramento.",
      "Possibilidade de conversão para cirurgia aberta devido dificuldade técnica ou sangramento; se necessário, podem ocorrer: fístula urinária, hérnia, infecção na incisão, perda de função renal ou dormência na região operada.",
      "Complicações decorrentes da posição de Trendelemburg e ou nos pontos de maior pressão no posicionamento.",
      "Não há garantia absoluta da cura do câncer, podendo haver necessidade de tratamento complementar futuro.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30715056": {
    titulo: "RESSECÇÃO TRANSURETRAL DA PRÓSTATA (RTU de Próstata)",
    procedimento: "RESSECÇÃO TRANSURETRAL DA PRÓSTATA (RTU de Próstata)",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Procedimento endoscópico para remoção do tecido prostático que obstrui a uretra, realizado sem incisão externa, por meio de ressectoscópio introduzido pela uretra. Indicado no tratamento da hiperplasia prostática benigna sintomática.",
    sintomas: [
      "Ardor/dor ao urinar (disúria), sensação de urgência e aumento da frequência urinária.",
      "Pequena quantidade de sangue na urina (hematúria leve) e/ou no sêmen (hematospermia).",
      "Desconforto leve em períneo, pênis, uretra ou região suprapúbica.",
      "Saída de \"debris\" (pequenos fragmentos/filamentos) ou coágulos pela urina.",
      "Uso de sonda vesical por período variável, conforme orientação médica.",
      "Possibilidade de mudança no volume de ejaculação (pode reduzir) ou ausência de emissão de sêmen durante o orgasmo (ejaculação retrógrada).",
    ],
    riscos: [
      "Dor ou desconforto na região suprapúbica, perineal ou genital, requerendo uso de analgésicos.",
      "Diagnóstico incidental de câncer de próstata, identificado somente no exame anatomopatológico do material ressecado.",
      "Lesão de órgãos adjacentes à próstata durante a cirurgia (raro).",
      "Incontinência urinária, temporária ou permanente, podendo requerer uso de fraldas.",
      "Disfunção erétil (impotência sexual), com comprometimento da ereção.",
      "Estenose de uretra e/ou bexiga, com necessidade de dilatações ou cirurgias posteriores (uretroplastia ou uretrotomia).",
      "Suspensão do procedimento por falha no bloqueio raquimedular ou intercorrência clínica antes ou durante o ato cirúrgico.",
      "Infecção urinária, exigindo tratamento medicamentoso.",
      "Sangramento significativo, com necessidade de irrigação vesical contínua e, em alguns casos, transfusão de sangue.",
      "Conversão da cirurgia endoscópica para cirurgia aberta, em caso de complicações técnicas.",
      "Embolia pulmonar, devido à formação de coágulos venosos.",
      "Absorção excessiva do líquido de irrigação, podendo causar síndrome hemolítica (Síndrome de TURP), com necessidade de tratamento clínico.",
      "Em caso de cirurgia aberta: fístula urinária, hérnia no local operado, infecção na incisão, perda de função renal, dormência na região operada.",
      "Trombose venosa profunda, com risco de complicações pulmonares.",
      "Ejaculação retrógrada, sem emissão de sêmen durante o orgasmo.",
      "Reações alérgicas inesperadas a medicamentos, anestésicos ou soluções utilizadas no procedimento.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30716019": {
    titulo: "NEFRECTOMIA RADICAL ONCOLÓGICA VIDEOLAPAROSCÓPICA OU ROBÔ-ASSISTIDA",
    procedimento: "NEFRECTOMIA RADICAL ONCOLÓGICA COM OU SEM LINFADENECTOMIA RETROPERITONEAL VIDEOLAPAROSCÓPICA OU ROBÔ-ASSISTIDA",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia minimamente invasiva de retirada total do rim acometido por tumor maligno, podendo incluir a retirada dos linfonodos regionais (linfadenectomia retroperitoneal), realizada por via videolaparoscópica ou com auxílio robótico.",
    sintomas: [
      "Dor no local da cirurgia e região lombar.",
      "Presença de dreno temporário no local da cirurgia.",
      "Presença de sonda vesical por período determinado.",
      "Desconforto abdominal transitório devido ao procedimento.",
      "Sangue na urina em pequena quantidade.",
    ],
    riscos: [
      "Necessidade de transfusão sanguínea durante ou após a operação.",
      "Constatação de impossibilidade de remoção do rim durante a cirurgia.",
      "Possibilidade de conversão para cirurgia aberta em caso de dificuldade técnica ou sangramento.",
      "Risco de lesão de órgãos adjacentes durante a cirurgia devido a aderências ou proximidade do tumor.",
      "Possibilidade de traumas vasculares na parede abdominal (levando a hematomas), traumas vasculares intra-abdominais ou traumas no aparelho digestivo no momento da punção dos trocateres ou durante o intraoperatório.",
      "Formação de enfisema subcutâneo (acúmulo de gás sob a pele).",
      "Possibilidade extremamente rara de embolia gasosa (gás dentro dos vasos sanguíneos).",
      "Abertura do diafragma com formação de pneumotórax, podendo requerer drenagem cirúrgica (dreno de tórax).",
      "Formação de hérnia ou flacidez no local da cirurgia.",
      "Sensação de dormência em torno da região operada.",
      "Infecção na incisão cirúrgica, podendo necessitar de tratamento.",
      "Dor no local da cirurgia, necessitando uso de medicamentos analgésicos.",
      "Trombose venosa profunda ou embolia pulmonar durante ou após a cirurgia.",
      "Insuficiência renal no pós-operatório imediato ou tardio, podendo necessitar hemodiálise temporária ou definitiva.",
      "Realização da retirada de linfonodos adjacentes ao rim e ureter pode levar, no pós-operatório tardio, à ejaculação retrógrada.",
      "Presença de câncer fora do rim, identificada apenas no exame anatomopatológico pós-operatório.",
      "Possibilidade de complicações gerais como sangramento, infecção, problemas cardiovasculares e respiratórios, podendo levar à internação prolongada, incapacidade temporária ou permanente, e até ao óbito.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30716027": {
    titulo: "NEFRECTOMIA PARCIAL ABERTA",
    procedimento: "NEFRECTOMIA PARCIAL ABERTA",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia aberta de remoção parcial do rim, preservando o parênquima renal saudável, indicada para tumores renais pequenos a médios onde é possível retirar apenas a parte acometida pelo tumor.",
    sintomas: [
      "Desconforto pela presença de cateter vesical de demora após a cirurgia.",
      "Ardência para urinar, sangue na urina, geralmente em pequena quantidade e sem repercussão clínica após a retirada de sonda vesical.",
      "Dor abdominal discreta ou à palpação abdominal, associada ou não à gases e distensão abdominal.",
      "Vômitos ou náuseas, principalmente nos primeiros dias.",
      "Alteração do ritmo intestinal, podendo levar alguns dias para normalizar.",
      "Desconforto decorrentes da presença de drenos, sondas e/ou cateteres duplo J.",
      "Sensação de dormência, edema ou hematomas em torno da região operada.",
      "Saída de secreção sanguinolenta ou serosa pelas feridas operatórias, com necessidade de monitorização.",
      "Perda de apetite temporária ou perda de peso discreta.",
    ],
    riscos: [
      "Necessidade de transfusão sanguínea antes, durante ou após a cirurgia.",
      "Constatação intraoperatória da impossibilidade de remoção apenas do tumor ou parte do rim, sendo necessária a retirada total do rim, por tumores grandes, sangramentos incontroláveis ou dificuldades técnicas.",
      "Possibilidade de saída de urina pela ferida operatória por algum tempo (fístula).",
      "Possibilidade de formação de hérnia ou flacidez no local da cirurgia.",
      "Possibilidade de infecção na incisão cirúrgica, requerendo tratamento.",
      "Possibilidade de perda da função renal como sequela da cirurgia.",
      "Possibilidade de sensação de dormência em torno da região operada.",
      "Risco de lesão dos órgãos adjacentes durante a cirurgia devido a aderências prévias ou do tumor.",
      "Possibilidade de traumas vasculares na parede abdominal, traumas vasculares intra-abdominais ou traumas no aparelho digestivo durante a cirurgia.",
      "Possibilidade de enfisema subcutâneo (acúmulo de gás sob a pele).",
      "Possibilidade de abertura do diafragma com formação de pneumotórax que pode requerer drenagem cirúrgica.",
      "Possibilidade extremamente rara de ocorrer embolia gasosa (gás dentro dos vasos sanguíneos).",
      "Possibilidade de deiscências de suturas renais, com necessidade de reabordagem e em alguns casos necessidade de utilização de nefrostomias ou cateter duplo J.",
      "Possibilidade de formação de aneurismas na vascularização renal.",
      "Possibilidade de trombose venosa profunda ou embolia pulmonar durante ou após a cirurgia.",
      "Possibilidade de insuficiência renal no pós-operatório imediato ou tardio necessitando hemodiálise temporária ou definitiva.",
      "Possibilidade de dor aguda ou crônica decorrente do posicionamento durante a cirurgia, com necessidade de analgésicos ou fisioterapia pós-operatória.",
      "Presença do câncer fora do rim, identificada apenas no resultado do exame anatomopatológico pós-operatório.",
      "Não há garantia absoluta da cura do câncer, podendo haver necessidade de tratamento futuro.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30716035": {
    titulo: "NEFRECTOMIA VIDEOLAPAROSCÓPICA",
    procedimento: "NEFRECTOMIA VIDEOLAPAROSCÓPICA",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia minimamente invasiva de retirada total do rim por via videolaparoscópica, indicada para tumores renais malignos ou rins não funcionantes, realizada através de pequenas incisões com câmera e instrumentos cirúrgicos.",
    sintomas: [
      "Dor leve a moderada na região lombar ou abdominal, controlada com analgésicos.",
      "Inchaço discreto nas áreas das incisões.",
      "Sensação de desconforto e/ou distensão abdominal devido ao gás utilizado na cirurgia.",
      "Presença de pequena quantidade de secreção serosa no dreno.",
      "Sensação de cansaço ou fraqueza nos primeiros dias.",
      "Dor leve no ombro ou no tórax, decorrente da insuflação de gás (habitualmente autolimitada).",
    ],
    riscos: [
      "Necessidade de transfusão sanguínea, durante ou após a cirurgia.",
      "Lesão de órgãos adjacentes (intestinos, fígado, baço, pâncreas, vasos sanguíneos ou diafragma) devido a aderências do rim.",
      "Abertura acidental do diafragma, podendo causar pneumotórax, que pode requerer colocação de dreno torácico.",
      "Formação de hérnia ou flacidez no local da incisão cirúrgica.",
      "Infecção na ferida cirúrgica, exigindo tratamento clínico ou, raramente, nova intervenção.",
      "Sensação de dormência ou alteração de sensibilidade ao redor da região operada.",
      "Enfisema subcutâneo (acúmulo de gás sob a pele), com tendência à regressão espontânea.",
      "Trauma vascular da parede abdominal, podendo causar hematoma.",
      "Lesões vasculares intra-abdominais, durante a punção, introdução dos trocartes ou durante o procedimento.",
      "Lesões do aparelho digestório, especialmente durante o acesso cirúrgico.",
      "Conversão da cirurgia laparoscópica para cirurgia aberta, em caso de dificuldade técnica ou sangramento importante.",
      "Necessidade de procedimentos adicionais para o tratamento de complicações intra ou pós-operatórias.",
      "Embolia gasosa (entrada de gás nos vasos sanguíneos), complicação extremamente rara, mas grave.",
      "Dor no local da cirurgia, podendo requerer uso de analgésicos por tempo variável.",
      "Necessidade futura de diálise, caso o rim remanescente não consiga suprir plenamente as necessidades fisiológicas do organismo.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30716043": {
    titulo: "URETEROLITOTRIPSIA TRANSURETEROSCÓPICA SEMIRRÍGIDA",
    procedimento: "URETEROLITOTRIPSIA TRANSURETEROSCÓPICA SEMIRRÍGIDA, COM OU SEM IMPLANTE DE CATETER URETERAL",
    lateralidade: "( ) Não se aplica",
    descricao: "Procedimento endoscópico para fragmentação e remoção de cálculos ureterais por meio de ureteroscópio semirrígido introduzido pela uretra e bexiga até o ureter, podendo incluir o implante de cateter ureteral duplo J.",
    sintomas: [],
    riscos: [
      "Cólica renal resultante da eliminação de fragmentos de cálculos, coágulos de sangue ou edema do ureter pode ocorrer no pós-operatório necessitando de analgésicos.",
      "Migração do cálculo ureteral para o rim durante a cirurgia pode tornar impossível sua retirada com instrumento endoscópico semirrígido.",
      "Impossibilidade de remoção integral do cálculo por dificuldades técnicas ou pelas condições cirúrgicas locais.",
      "Estenose (estreitamento) ou lesão do ureter (perfurações, avulsão, secção) e/ou da bexiga que poderão requerer tratamento cirúrgico imediato por via aberta ou endoscópica.",
      "Em caso de cirurgia aberta: saída de urina pela ferida (fístula), formação de hérnia no local, infecção da incisão ou perda da função renal.",
      "Formação de coleções sanguíneas ao redor do ureter com necessidade de drenagem.",
      "Obstrução ureteral por fragmentos de cálculos, que podem evoluir com infecção urinária e dilatação do rim, podendo ser necessária a passagem de cateter duplo J ou drenagem por nefrostomia.",
      "Possibilidade de infecção no trato urinário (sepse) durante ou após a internação, mesmo com exame de urina pré-operatório normal, requerendo tratamento com prioridade.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30716051": {
    titulo: "NEFROLITOTRIPSIA PERCUTÂNEA (NLPC)",
    procedimento: "NEFROLITOTRIPSIA PERCUTÂNEA",
    lateralidade: "( ) Não se aplica",
    descricao: "Procedimento cirúrgico minimamente invasivo para remoção de cálculos renais de grande porte por acesso percutâneo (punção direta no rim através da pele), com fragmentação e extração dos cálculos por via endoscópica.",
    sintomas: [],
    riscos: [
      "Sangramento durante ou após a cirurgia; a necessidade de transfusão sanguínea é rara.",
      "Dor, equimose ou hematomas no local da punção.",
      "Coleções sanguíneas no rim ou ao seu redor, geralmente reabsorvidas espontaneamente.",
      "Lesão de vasos sanguíneos com hemorragia que necessita de cirurgia aberta para hemostasia ou embolização por arteriografia; possibilidade de pseudoaneurisma ou fístula arteriovenosa.",
      "Punção acidental de órgãos próximos ao rim (intestino, fígado, baço, pulmão), sendo raro.",
      "Outros procedimentos ou cirurgias para corrigir lesões (drenagem de tórax, colostomia, laparotomia exploradora).",
      "Febre e elevação nos leucócitos são comuns no pós-operatório; infecção sistêmica (sepse) é rara.",
      "Infecção grave pode implicar em suspensão imediata do procedimento e necessitar de tratamento em UTI.",
      "Pequenas perfurações no sistema de drenagem de urina podem ocorrer com extravasamento persistente de urina.",
      "Estreitamentos no interior do rim e ureter ou ruptura completa do ureter (rarísssimo), necessitando de tratamento subsequente.",
      "Migração de fragmentos de cálculo para o exterior do rim, normalmente sem consequências.",
      "Cólicas renais resultantes da eliminação de fragmentos do(s) cálculo(s).",
      "Obstrução ureteral por fragmentos de cálculos, podendo evoluir com infecção local e necessitar de cateter duplo J ou nefrostomia.",
      "A operação tem efeito mínimo na função do rim; piora da função renal a longo prazo pode ocorrer principalmente em cálculos mais complexos.",
      "Lesão renal aguda com necessidade de tratamento e perda do rim.",
      "Trombose venosa profunda e embolia pulmonar.",
      "Existe risco de óbito em consequência da cirurgia ou por problemas relacionados ao procedimento no pós-operatório, que é raro, em torno de 0,1 a 0,3%.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30717015": {
    titulo: "CISTECTOMIA RADICAL ABERTA",
    procedimento: "CISTECTOMIA RADICAL ABERTA",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia aberta de remoção total da bexiga por câncer vesical, incluindo a criação de uma derivação urinária (ureterostomia cutânea, neobexiga ortotópica ou conduto ileal) para permitir a eliminação da urina.",
    sintomas: [
      "Dor abdominal discreta ou à palpação abdominal, associada ou não à gases e distensão abdominal.",
      "Vômitos ou náuseas, principalmente nos primeiros dias.",
      "Alteração do ritmo intestinal, podendo levar alguns dias para normalizar.",
      "Presença de sangue em pequena quantidade na urina pelas ostomias.",
      "Desconforto decorrentes da presença de drenos, sondas, cateteres duplo J e splits.",
      "Sensação de dormência, edema ou hematomas em torno da região operada.",
      "Saída de secreção sanguinolenta ou serosa pelas feridas operatórias, com necessidade de monitorização.",
      "Perda de apetite temporária ou perda de peso discreta.",
    ],
    riscos: [
      "Necessidade de transfusão sanguínea antes, durante ou após a cirurgia.",
      "Constatação intraoperatória da impossibilidade de remoção da bexiga.",
      "Possibilidade de saída de urina pela ferida operatória por algum tempo (fístula).",
      "Possibilidade de formação de hérnia ou flacidez no local da cirurgia.",
      "Possibilidade de infecção na incisão cirúrgica, requerendo tratamento.",
      "Possibilidade de perda da função renal como sequela da cirurgia.",
      "Possibilidade de sensação de dormência em torno da região operada.",
      "Risco de lesão dos órgãos adjacentes durante a cirurgia devido a aderências prévias ou do tumor.",
      "Possibilidade de traumas vasculares na parede abdominal, traumas vasculares intra-abdominais ou traumas no aparelho digestivo durante o procedimento.",
      "Possibilidade de enfisema subcutâneo (acúmulo de gás sob a pele).",
      "Possibilidade extremamente rara de ocorrer embolia gasosa.",
      "Possibilidade de deiscências de anastomose intestinal, com necessidade de reabordagem e em alguns casos necessidade de utilização de ileostomia/colostomia.",
      "Possibilidade de deiscência da derivação urinária ou presença de fístulas urinárias, que podem necessitar de reabordagem cirúrgica.",
      "Possibilidade de formação de hérnia ou flacidez no local da cirurgia.",
      "Possibilidade de transtornos inerentes à derivação urinária (acidose, déficit de vitamina B12, infecção urinária de repetição).",
      "Possibilidade de trombose venosa profunda ou embolia pulmonar durante ou após a cirurgia.",
      "Possibilidade de insuficiência renal no pós-operatório imediato ou tardio necessitando hemodiálise temporária ou definitiva.",
      "Possibilidade de disfunção sexual.",
      "Presença do câncer fora da bexiga, identificada apenas no resultado do exame anatomopatológico pós-operatório.",
      "Não há garantia absoluta da cura do câncer, podendo haver necessidade de tratamento futuro.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30717023": {
    titulo: "RESSECÇÃO TRANSURETRAL DE TUMOR VESICAL (RTU DE BEXIGA)",
    procedimento: "RESSECÇÃO TRANSURETRAL DE TUMOR VESICAL (RTU DE BEXIGA)",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Procedimento endoscópico para ressecção de tumor(es) na bexiga por via transuretral, sem incisão externa, com finalidade diagnóstica e terapêutica. Realizado com ressectoscópio introduzido pela uretra.",
    sintomas: [
      "Ardência para urinar, sangue na urina, geralmente em pequena quantidade e sem repercussão clínica.",
      "Sintomas decorrentes da presença de sonda vesical, como vontade de urinar ou desconforto na região inferior do abdômen.",
      "Aumento da frequência para urinar, desconforto sobre a bexiga e dor lombar durante a micção por alguns dias após a retirada da sonda vesical.",
      "Eliminação de pequenos coágulos, grumos ou tecidos residuais pela urina após procedimento.",
      "Dor ou desconforto na região inferior do abdômen, perineal ou genital, necessitando uso de analgésicos.",
    ],
    riscos: [
      "Suspensão da cirurgia por impossibilidade de realização de anestesia adequada ou presença de bactérias na urina.",
      "Risco de perfuração da bexiga durante o procedimento necessitando de abordagem cirúrgica ou tempo prolongado de uso de sonda vesical.",
      "Risco de sangramento com formação de coágulos na bexiga com necessidade de lavagem ou reoperação.",
      "Risco de lesão de órgãos adjacentes à bexiga durante a ressecção.",
      "Estenose (estreitamento) ou lesão do ureter e/ou uretra que poderão requerer tratamento adicional ou subsequente.",
      "Possibilidade de infecção do trato urinário após o procedimento, mesmo com exames pré-operatórios normais.",
      "Possibilidade de sangramento leve a grave, podendo ser necessária a transfusão sanguínea, medicações para coagulação ou reabordagem cirúrgica.",
      "Necessidade de suspensão de medicações anticoagulantes/antiagregantes no período pré-operatório, podendo aumentar o risco de eventos trombóticos.",
      "Necessidade de novos procedimentos semelhantes para novo diagnóstico ou seguimento da neoplasia vesical, principalmente em tumores volumosos ou por recidiva (retorno) do tumor.",
      "Possibilidade de complicações anestésicas e/ou embolia pulmonar.",
      "Possibilidade de absorção do líquido utilizado durante o procedimento (Síndrome de Reabsorção).",
      "Possibilidade de conversão para cirurgia aberta por dificuldade técnica ou complicações.",
      "Em caso de conversão para cirurgia aberta: implante de células tumorais na via de acesso, fístula urinária, hérnia, infecção da incisão, perda de função renal ou dormência na região operada.",
      "Possibilidade de não conseguir urinar espontaneamente após a retirada da sonda vesical, sendo necessária nova sondagem e avaliação.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30718011": {
    titulo: "URETROTOMIA INTERNA",
    procedimento: "URETROTOMIA INTERNA",
    lateralidade: "( ) Não se aplica",
    descricao: "Procedimento endoscópico para tratamento de estenose (estreitamento) uretral, realizado com uretrotomo introduzido pela uretra para incisão do tecido cicatricial que causa a obstrução urinária.",
    sintomas: [],
    riscos: [
      "Complicações ou dificuldades técnicas durante a cirurgia que impeçam a realização da mesma.",
      "Dor ou desconforto no pênis e/ou região do períneo requerendo medicamentos analgésicos.",
      "Presença de edema e/ou hematomas do pênis e/ou do escroto, requerendo tratamento clínico ou cirúrgico.",
      "Possibilidade de infecção na uretra e na bexiga, necessitando de futuro tratamento.",
      "Possibilidade futura de novo estreitamento.",
      "Suspensão do ato cirúrgico por impossibilidade da realização de qualquer tipo de anestesia por condições técnicas ou clínicas surgidas imediatamente antes do ato cirúrgico.",
      "Possibilidade de permanecer com uma sonda no abdômen (cistostomia) para drenagem de urina por alguns dias.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30719018": {
    titulo: "ORQUIECTOMIA BILATERAL (RETIRADA DOS TESTÍCULOS)",
    procedimento: "ORQUIECTOMIA BILATERAL (RETIRADA DOS TESTÍCULOS)",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( ) Bilateral  ( ) Não se aplica",
    descricao: "Cirurgia de remoção cirúrgica de ambos os testículos, indicada principalmente como tratamento hormonal do câncer de próstata avançado (castração cirúrgica) ou em casos de tumor maligno testicular bilateral.",
    sintomas: [
      "Discreto sangramento na ferida operatória.",
      "Dor no local da cirurgia com necessidade de analgésicos.",
      "Sensação de dormência ou discreto prurido (coceira) no local de cicatrização dos pontos.",
      "Hematomas (mancha arroxeada) ou edema (inchaço) no local da cirurgia.",
      "Impactos emocionais decorrentes da cirurgia e das novas adaptações necessárias após a cirurgia.",
      "Presença de fogachos (ondas de calor), queda da libido, disfunção erétil, redução do volume dos órgãos genitais, queda de pelos, ginecomastia e sensação de fraqueza e/ou cansaço.",
    ],
    riscos: [
      "Suspensão do ato cirúrgico por impossibilidade anestésica.",
      "Deiscência (abertura) dos pontos de sutura e/ou infecção da ferida operatória com necessidade de tratamento com antibióticos ou reabordagem cirúrgica.",
      "Necessidade de analgésicos para controle da dor.",
      "Possibilidade de reintervenção cirúrgica por infecção, sangramento ou deiscência dos pontos.",
      "Possibilidade de infecção no trato urinário durante ou após o procedimento, requerendo tratamento com prioridade.",
      "Impacto na autoimagem, sexualidade e autoestima com necessidade de apoio multidisciplinar.",
      "Não há garantia absoluta que o câncer de próstata seja controlado apenas com este procedimento, podendo haver necessidade de outras formas de tratamento complementar.",
      "Disfunção sexual permanente (perda do desejo sexual e disfunção erétil).",
      "Infertilidade.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "30719026": {
    titulo: "ORQUIDOPEXIA",
    procedimento: "ORQUIDOPEXIA",
    lateralidade: "( ) Não se aplica",
    descricao: "Cirurgia para correção da criptorquidia (testículo não descido), com fixação do testículo na bolsa escrotal. Geralmente indicada em crianças, mas pode ser realizada em adultos jovens.",
    sintomas: [],
    riscos: [
      "Deiscência dos pontos da sutura.",
      "Possibilidade de infecção na incisão cirúrgica, requerendo futuro tratamento.",
      "Hematomas ou edema em região inguinal e/ou escrotal.",
      "Aparecimento posterior de hidrocele (água no escroto).",
      "Não desenvolvimento ou atrofia testicular posterior à cirurgia.",
      "Alterações da espermatogênese e ou infertilidade na idade adulta.",
      "Não modificar o risco do aparecimento futuro de neoplasias testiculares.",
      "Impossibilidade de fixação testicular escrotal em tempo único e necessidade futura de reabordagem.",
      "Identificação de testículo hipodesenvolvido/atrófico e indicação de retirada (orquiectomia).",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
  "31205070": {
    titulo: "VASECTOMIA BILATERAL",
    procedimento: "VASECTOMIA BILATERAL",
    lateralidade: "( ) Esquerdo  ( ) Direito  ( X ) Bilateral  ( ) Não se aplica",
    descricao: `VASECTOMIA BILATERAL é uma cirurgia de esterilização masculina permanente. Trata-se de um procedimento cirúrgico voluntário e eletivo, com o objetivo de impedir a reprodução humana, como método contraceptivo, tornando o homem incapaz de engravidar uma mulher através de relação sexual.

Trata-se de um procedimento irreversível ou de reversibilidade incerta e limitada. Por essa razão, deve ser uma escolha exercida pelo paciente de forma autônoma, consciente, responsável e isenta de dúvida; e só pode ser realizada 60 dias após ter sido solicitada pelo paciente à equipe médica.

Fui incentivado a considerar métodos contraceptivos reversíveis, como preservativos, pílulas, DIU, injeções, implantes e métodos comportamentais. Fui orientado a procurar um serviço de regulação da fecundidade, com equipe multidisciplinar, para esclarecimentos adicionais durante o período de reflexão obrigatório de 60 (sessenta) dias.

Tenho plena capacidade civil e preencho os critérios legais para realizar o procedimento (idade mínima de 21 anos ou dois filhos vivos – art. 10, da Lei nº 9.263/1996).

O procedimento de VASECTOMIA BILATERAL consiste na interrupção dos canais por onde passam os espermatozoides (canais deferentes), por meio de cortes no escroto, com anestesia a ser definida previamente, promovendo a interrupção permanente da passagem de espermatozoides.`,
    sintomas: [
      "Dor ou desconforto leve na bolsa escrotal nos primeiros dias.",
      "Inchaço leve e hematomas na região escrotal.",
      "Sensação de peso nos testículos.",
      "Desconforto ao caminhar ou sentar-se por longos períodos.",
      "Pequenas manchas roxas (equimoses) ao redor da incisão.",
      "Pode ocorrer presença de espermatozoides no sêmen por até 90 dias.",
    ],
    riscos: [
      "Sangramentos, hematomas e edema na região escrotal.",
      "Infecção na incisão, que pode requerer antibióticos ou drenagem.",
      "Dor persistente ou crônica escrotal (pós-vasectomia).",
      "Recanalização espontânea dos canais deferentes, podendo gerar gravidez.",
      "Falha do procedimento, com persistência de espermatozoides móveis no sêmen.",
      "Alterações inflamatórias ou infecciosas dos testículos ou epidídimos.",
      "Deiscência dos pontos cirúrgicos (abertura do corte).",
      "Cicatrização inadequada, incluindo formação de queloide ou cicatriz hipertrófica.",
      "Diminuição do volume testicular, com possível impacto na função hormonal.",
      "Reações alérgicas a anestésicos ou medicamentos usados durante a cirurgia.",
      "Complicações anestésicas, como queda de pressão, reações cardiovasculares ou respiratórias.",
      "A cirurgia não protege contra infecções sexualmente transmissíveis, sendo necessário uso de preservativo se houver risco.",
      "Suspensão do ato cirúrgico por intercorrência clínica ou dificuldade com o bloqueio anestésico.",
    ],
    cuidados: [
      "Ingerir líquidos conforme orientação médica.",
      "Utilizar as medicações prescritas, como analgésicos, antibióticos, seguindo de forma rigorosa e integral todas as orientações contidas nas prescrições do médico assistente.",
      "Em caso de febre, dor intensa, sangramento, saída de secreção com pus da ferida operatória, procure seu urologista ou serviço de emergência.",
      "Buscar o resultado do anatomopatológico e levar para seu urologista para informação sobre resultado.",
      "Agendar consulta com seu urologista conforme discutido e combinado durante a internação.",
      "Lembrar que há possibilidade de necessitar de tratamento complementar.",
    ],
  },
};
function getTCLE(tussCode) {
  return TCLE_DB[tussCode] || null;
}

async function gerarTCLE(dados) {
  const { paciente, medico, procPrincipal } = dados;
  const tcleBase = getTCLE(procPrincipal?.codigo);
  const dataHoje = new Date().toLocaleDateString("pt-BR", {day:"2-digit",month:"long",year:"numeric"});
  const cidadeData = `Recife, ${dataHoje}`;

  if (!tcleBase) {
    // Para procedimentos sem TCLE na base local, pede à IA gerar um
    const prompt = `Gere um Termo de Consentimento Livre e Esclarecido (TCLE) completo no padrão da SBU (Sociedade Brasileira de Urologia) em HTML para o procedimento: ${procPrincipal?.nome} (código TUSS ${procPrincipal?.codigo}).
Paciente: ${paciente.nome}
Médico: Dr. ${medico.nome} - ${medico.conselho} ${medico.numero}-${medico.uf} - RQE ${medico.rqe}
Data: ${cidadeData}

O HTML deve incluir: cabeçalho SBU, identificação do paciente, descrição do procedimento, sintomas pós-operatórios, riscos/complicações, cuidados pós-alta, seção de autorização com campos para assinatura do paciente, responsável, testemunhas e médico. CSS inline para A4. Retorne APENAS o HTML.`;
    const res = await fetch("/api/claude", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:4000,
        messages:[{role:"user",content:prompt}] })
    });
    const data = await res.json();
    return data.content?.map(b=>b.text||"").join("").replace(/```html|```/g,"").trim();
  }

  // Gera HTML com base no template local
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; background: #fff; padding: 20mm 20mm 15mm 20mm; max-width: 210mm; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; border-bottom:2px solid #003366; padding-bottom:10px; }
  .sbu-logo { font-size:11pt; font-weight:bold; color:#003366; text-align:right; }
  .sbu-logo span { display:block; font-size:8pt; font-weight:normal; color:#666; }
  h1 { font-size:11pt; font-weight:bold; text-align:center; margin:16px 0 10px; line-height:1.4; }
  h2 { font-size:10pt; font-weight:bold; text-align:center; margin:14px 0 8px; }
  h3 { font-size:10pt; font-weight:bold; margin:12px 0 6px; }
  .paciente-box { border:1px dashed #999; padding:12px 16px; margin:12px 0; line-height:1.8; }
  .aviso { border:1px solid #000; padding:8px 12px; margin:10px 0; font-weight:bold; font-size:9pt; line-height:1.5; }
  .procedimento-linha { margin:8px 0; font-size:10pt; }
  p { margin:6px 0; line-height:1.6; text-align:justify; font-size:9.5pt; }
  ol, ul { margin:6px 0 6px 20px; }
  li { margin:3px 0; line-height:1.5; font-size:9.5pt; }
  .rubrica-box { border:1px solid #000; padding:6px 12px; float:right; margin-top:10px; font-size:8pt; text-align:center; min-width:100px; min-height:35px; }
  .page-num { text-align:center; margin-top:16px; font-size:8.5pt; color:#555; }
  .auth-section { margin-top:20px; }
  .info-table { width:100%; border-collapse:collapse; margin:10px 0; }
  .info-table td, .info-table th { border:1px solid #000; padding:5px 8px; font-size:9pt; }
  .info-table th { background:#f0f0f0; font-weight:bold; width:35%; }
  .assinatura-linha { border-bottom:1px solid #000; margin:6px 0 4px; min-height:20px; }
  .assinatura-label { font-size:9pt; font-weight:bold; margin:10px 0 2px; }
  .resp-table { width:100%; border-collapse:collapse; margin:10px 0; }
  .resp-table td { border:1px solid #000; padding:5px 8px; font-size:9pt; width:50%; }
  .testemunha-row { display:flex; gap:20px; margin:16px 0 0; }
  .testemunha-col { flex:1; }
  .testemunha-linha { border-bottom:1px solid #000; margin:20px 0 4px; }
  .medico-section { margin-top:16px; border:1px solid #ccc; padding:10px; }
  .clearfix::after { content:""; display:table; clear:both; }
  .declaro-box { background:#f9f9f9; border-left:3px solid #003366; padding:8px 12px; margin:10px 0; font-size:9pt; line-height:1.6; }
  @page { margin: 0; size: A4; }
  @media print { body { padding:15mm 15mm 15mm 15mm; } }
</style>
</head>
<body>

<div class="header">
  <div>
    <strong>TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO (TCLE)</strong><br>
    <strong>${tcleBase.titulo}</strong>
  </div>
  <div class="sbu-logo">
    🏥 SBU<span>Sociedade Brasileira<br>de Urologia</span>
  </div>
</div>

<div class="paciente-box">
  <strong>Paciente:</strong> ${paciente.nome.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;<strong>Sexo:</strong> MASCULINO<br>
  <strong>CPF:</strong> ${paciente.cns||"___________________"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Data de Nascimento:</strong> ___/___/______
</div>

<div class="aviso">
  Caro paciente, você só deve assinar este documento após ter esclarecido plenamente todas as suas <strong>dúvidas</strong> a respeito dos procedimentos recomendados por seu médico, assim como compreender integralmente os riscos correspondentes.
</div>

<p class="procedimento-linha"><strong>Procedimento Proposto:&nbsp;&nbsp;&nbsp;&nbsp;${tcleBase.procedimento}</strong></p>
<p class="procedimento-linha"><strong>Lateralidade:</strong>&nbsp;&nbsp;&nbsp;&nbsp;${tcleBase.lateralidade}</p>

<p style="margin-top:10px;">Por este documento, eu (nome do paciente ou seu responsável), <strong>${paciente.nome.toUpperCase()}</strong>, DECLARO que fui devidamente informado pelo médico, em linguagem clara e objetiva, a respeito do seguinte procedimento <strong>${tcleBase.procedimento}</strong>.</p>

<p>${tcleBase.descricao}</p>

<h2>Sintomas comuns no pós-operatório:</h2>
<ol>${tcleBase.sintomas.map((s,i)=>`<li>${s}</li>`).join("")}</ol>

<div class="clearfix">
  <div class="rubrica-box">Rubrica do<br>paciente ou<br>rep. legal</div>
  <div style="clear:both; padding-top:4px;"></div>
</div>

<div style="border-top:1px solid #ddd; margin-top:20px; padding-top:16px;">
<h2>Riscos / Complicações:</h2>
<ol>${tcleBase.riscos.map(r=>`<li>${r}</li>`).join("")}</ol>

<h2>Cuidados após a alta hospitalar:</h2>
<p>Declaro também que fui informado (a) de todos os cuidados e orientações que devo seguir a fim de alcançar o melhor resultado, dentre os quais os especificados abaixo.</p>
<ol>${tcleBase.cuidados.map(c=>`<li>${c}</li>`).join("")}</ol>

<div class="declaro-box">
  Fui expressamente informado e estou perfeitamente ciente de que é absolutamente indispensável seguir rigorosamente cada uma das orientações especificadas acima, assim como quaisquer outras que venham a ser prescritas pelo médico assistente. Compreendi que <strong>não existe garantia sobre os resultados a serem obtidos</strong>, independentemente do tipo da cirurgia, da boa técnica cirúrgica e anestésica e da eficiência dos cuidados médicos. Estou ciente de que, durante o procedimento, poderão apresentar-se outras situações imprevisíveis ainda não diagnosticadas ou emergências que necessitem mudanças do procedimento proposto, além de procedimentos adicionais para tratamento de eventuais complicações.
</div>
</div>

<div class="auth-section" style="border-top:1px solid #ddd; margin-top:20px; padding-top:16px;">
<h2>AUTORIZAÇÃO DO PACIENTE OU RESPONSÁVEL</h2>
<p>Por livre iniciativa, ACEITO CORRER OS RISCOS SUPRAMENCIONADOS, AUTORIZO e DOU PERMISSÃO voluntária para que o(s) procedimento(s) seja(m) realizado(s) da forma como foi exposto no presente termo. Tive a oportunidade de esclarecer todas as minhas dúvidas relativas ao(s) procedimento(s), após ter lido e compreendido todas as informações deste documento, antes de sua assinatura. Fui informado que tenho o direito de revogar este consentimento antes que o(s) procedimento(s), objeto deste documento, se realize(m).</p>

<table class="info-table" style="margin-top:14px;">
  <tr><th>Local e data:</th><td>${cidadeData}</td></tr>
  <tr><th>Nome do paciente:</th><td><strong>${paciente.nome.toUpperCase()}</strong></td></tr>
  <tr><th>RG:</th><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>CPF:</strong>&nbsp;&nbsp;&nbsp;&nbsp;${paciente.cns||"___________________"}</td></tr>
</table>

<p class="assinatura-label">Assinatura do paciente:</p>
<div class="assinatura-linha"></div>

<table class="resp-table">
  <tr><td><strong>Responsável ou representante legal</strong><br>&nbsp;</td><td><strong>Parentesco</strong><br>&nbsp;</td></tr>
  <tr><td><strong>RG</strong><br>&nbsp;</td><td><strong>CPF</strong><br>&nbsp;</td></tr>
</table>

<p class="assinatura-label">Assinatura do responsável:</p>
<div class="assinatura-linha"></div>

<p style="text-align:center; font-weight:bold; margin-top:16px;">Testemunhas:</p>
<div class="testemunha-row">
  <div class="testemunha-col"><div class="testemunha-linha"></div><p>Nome:</p><p>CPF:</p></div>
  <div class="testemunha-col"><div class="testemunha-linha"></div><p>Nome:</p><p>CPF:</p></div>
</div>

<div class="medico-section" style="margin-top:20px;">
  <h3>DECLARAÇÃO DO MÉDICO RESPONSÁVEL</h3>
  <table class="info-table">
    <tr><th>Local e data:</th><td>${cidadeData}</td></tr>
    <tr><th>Nome do médico:</th><td>${medico.nome}</td></tr>
    <tr><th>${medico.conselho}:</th><td>${medico.numero}-${medico.uf}&nbsp;&nbsp;&nbsp;&nbsp;<strong>RQE:</strong>&nbsp;${medico.rqe}</td></tr>
  </table>
  <p class="assinatura-label">Assinatura e carimbo do médico:</p>
  <div class="assinatura-linha"></div>
</div>

<p style="margin-top:16px; font-size:8pt; color:#555; text-align:center;">
  AVISO LEGAL: Este documento foi elaborado com base nas diretrizes da Sociedade Brasileira de Urologia (SBU) e nas melhores evidências científicas disponíveis. A SBU rejeita qualquer responsabilidade pela forma como este documento venha a ser utilizado. É de exclusiva responsabilidade do médico exercer comunicação clara, precisa e suficiente com seus pacientes.
</p>
</div>

</body>
</html>`;
  return html;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Field({label,value,onChange,placeholder,multiline,readOnly}) {
  const cls=`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${readOnly?"bg-gray-50 text-gray-500":""}`;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {multiline ? <textarea className={cls+" resize-none"} rows={4} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}/> : <input className={cls} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}/>}
    </div>
  );
}

function SectionCard({title,icon,children,accent}) {
  const b={red:"border-red-500",blue:"border-blue-500",green:"border-green-500",purple:"border-purple-500",orange:"border-orange-500"};
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`px-5 py-3 border-b-2 ${b[accent]||"border-gray-200"} bg-gray-50 flex items-center gap-2`}>
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function TUSSSearch({onSelect,placeholder}) {
  const [q,setQ]=useState("");const [res,setRes]=useState([]);const [open,setOpen]=useState(false);
  const change=e=>{const v=e.target.value;setQ(v);const r=searchTUSS(v);setRes(r);setOpen(r.length>0);};
  const sel=item=>{onSelect(item);setQ("");setRes([]);setOpen(false);};
  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <span className="text-gray-400">🔍</span>
        <input className="flex-1 text-sm focus:outline-none" value={q} onChange={change}
          placeholder={placeholder||"Buscar por nome ou código TUSS..."}
          onFocus={()=>q.length>1&&setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),150)}/>
      </div>
      {open&&(
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {res.map(r=>(
            <button key={r.codigo} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 text-left border-b border-gray-50 last:border-0" onMouseDown={()=>sel(r)}>
              <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-0.5 shrink-0">{r.codigo}</span>
              <span className="text-sm text-gray-700 flex-1">{r.nome}</span>
              {r.hasTCLE&&<span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded shrink-0 font-medium">TCLE</span>}
            </button>
          ))}
          <div className="px-4 py-2 bg-gray-50 border-t"><span className="text-xs text-gray-400">💡 {TUSS_DB.length + TUSS_INDEX.length} procedimentos · Verde = TCLE disponível</span></div>
        </div>
      )}
    </div>
  );
}

// ─── CAMERA MODAL ─────────────────────────────────────────────────────────────
function CameraModal({onClose,onDataExtracted}) {
  const [mode,setMode]=useState("choose");
  const [img,setImg]=useState(null);const [mime,setMime]=useState("image/jpeg");
  const [extracted,setExtracted]=useState(null);const [errMsg,setErrMsg]=useState("");
  const videoRef=useRef(null);const streamRef=useRef(null);const fileRef=useRef(null);
  const stopCam=()=>{if(streamRef.current){streamRef.current.getTracks().forEach(t=>t.stop());streamRef.current=null;}};
  const startCam=async()=>{
    setMode("camera");
    try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1920}}});
      streamRef.current=s;if(videoRef.current)videoRef.current.srcObject=s;}
    catch{setErrMsg("Câmera indisponível. Use a galeria.");setMode("error");}
  };
  const capture=()=>{
    const v=videoRef.current;if(!v)return;
    const cv=document.createElement("canvas");cv.width=v.videoWidth;cv.height=v.videoHeight;
    cv.getContext("2d").drawImage(v,0,0);setImg(cv.toDataURL("image/jpeg",0.92));setMime("image/jpeg");
    stopCam();setMode("preview");
  };
  const fromFile=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
    r.onload=ev=>{setImg(ev.target.result);setMime(f.type||"image/jpeg");setMode("preview");};r.readAsDataURL(f);};
  const analyze=async()=>{
    setMode("loading");
    try{const result=await readInsuranceCard(img.split(",")[1],mime);
      if(result.erro){setErrMsg(result.erro);setMode("error");return;}
      setExtracted(result);setMode("result");}
    catch{setErrMsg("Erro ao analisar. Verifique conexão.");setMode("error");}
  };
  const confirm=()=>{onDataExtracted(extracted);handleClose();};
  const handleClose=()=>{stopCam();onClose();};
  const reset=()=>{stopCam();setImg(null);setExtracted(null);setErrMsg("");setMode("choose");};
  const FIELDS=[{label:"Nome",key:"nome",icon:"👤"},{label:"Carteira",key:"carteira",icon:"🪪"},
    {label:"Validade",key:"validade",icon:"📅"},{label:"Convênio",key:"convenio",icon:"🏥"},
    {label:"Plano",key:"plano",icon:"📋"},{label:"CNS",key:"cns",icon:"🆔"}];
  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-end sm:items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&handleClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">📷</div>
            <div><p className="font-bold text-gray-900 text-sm">Ler Carteira do Convênio</p><p className="text-xs text-gray-400">Preenchimento automático com IA</p></div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg text-xl">×</button>
        </div>
        <div className="p-5">
          {mode==="choose"&&(
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 text-center border border-blue-100">
                <div className="text-5xl mb-3">🪪</div>
                <p className="font-bold text-blue-900">Fotografe a carteirinha</p>
                <p className="text-xs text-blue-600 mt-1">Nome, número e validade extraídos automaticamente</p>
              </div>
              <button onClick={startCam} className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"><span className="text-2xl">📷</span>Abrir Câmera</button>
              <button onClick={()=>fileRef.current?.click()} className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-gray-300 text-gray-600 font-bold rounded-xl hover:border-blue-400 hover:bg-blue-50 transition"><span className="text-2xl">🖼️</span>Escolher da Galeria</button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={fromFile}/>
              <p className="text-xs text-center text-gray-400">🔒 A imagem não é armazenada</p>
            </div>
          )}
          {mode==="camera"&&(
            <div className="space-y-4">
              <div className="relative bg-black rounded-2xl overflow-hidden" style={{paddingBottom:"62%"}}>
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover"/>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-4/5 h-3/5 relative">
                    <div className="absolute inset-0 border-2 border-white/40 rounded-lg"></div>
                    {["top-0 left-0 border-t-4 border-l-4 rounded-tl","top-0 right-0 border-t-4 border-r-4 rounded-tr","bottom-0 left-0 border-b-4 border-l-4 rounded-bl","bottom-0 right-0 border-b-4 border-r-4 rounded-br"].map((cls,i)=>(
                      <div key={i} className={`absolute ${cls} w-5 h-5 border-yellow-400`}></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium">← Voltar</button>
                <button onClick={capture} className="flex-grow py-3 bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"><span>📸</span>Capturar</button>
              </div>
            </div>
          )}
          {mode==="preview"&&(
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border-2 border-gray-200"><img src={img} alt="Captura" className="w-full object-contain" style={{maxHeight:240}}/></div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2"><span>💡</span><p className="text-xs text-amber-800">Certifique-se que número da carteira, nome e validade estão visíveis.</p></div>
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium">🔄 Nova foto</button>
                <button onClick={analyze} className="flex-grow py-3 bg-blue-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"><span>🤖</span>Analisar com IA</button>
              </div>
            </div>
          )}
          {mode==="loading"&&(
            <div className="py-12 text-center space-y-5">
              <div className="relative inline-flex"><div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">🪪</div><div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div></div>
              <div><p className="font-bold text-gray-900">Analisando carteirinha...</p><p className="text-xs text-gray-400 mt-1">A IA está lendo os dados</p></div>
            </div>
          )}
          {mode==="result"&&extracted&&(
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3"><span className="text-3xl">✅</span><div><p className="font-bold text-green-800">Dados lidos!</p><p className="text-xs text-green-600">Confirme antes de preencher</p></div></div>
              <div className="space-y-2">{FIELDS.filter(f=>extracted[f.key]).map(f=>(
                <div key={f.key} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-lg">{f.icon}</span>
                  <div className="flex-1 min-w-0"><p className="text-xs text-gray-400">{f.label}</p><p className="text-sm font-semibold text-gray-800 truncate">{extracted[f.key]}</p></div>
                </div>
              ))}</div>
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium">🔄 Reler</button>
                <button onClick={confirm} className="flex-grow py-3 bg-green-600 text-white font-bold rounded-xl text-sm">✅ Usar estes dados</button>
              </div>
            </div>
          )}
          {mode==="error"&&(
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center"><p className="text-4xl mb-2">❌</p><p className="font-bold text-red-800">Não foi possível ler</p><p className="text-xs text-red-600 mt-1">{errMsg}</p></div>
              <button onClick={reset} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-sm">🔄 Tentar novamente</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PDF MODAL ────────────────────────────────────────────────────────────────
function PDFModal({htmlContent,convenio,titulo,pacienteNome,onClose,secondDoc,onOpenSecond}) {
  const [showSecond,setShowSecond]=useState(false);
  const current = showSecond && secondDoc ? secondDoc : {html:htmlContent,titulo:titulo||"Guia de Internação"};

  const handlePrint=()=>{
    const w=window.open("","_blank");
    w.document.write(current.html);
    w.document.close();
    setTimeout(()=>w.print(),600);
  };
  const handlePrintAll=()=>{
    // Print guia
    const w1=window.open("","_blank");
    w1.document.write(htmlContent);
    w1.document.close();
    setTimeout(()=>{
      w1.print();
      if(secondDoc){
        setTimeout(()=>{
          const w2=window.open("","_blank");
          w2.document.write(secondDoc.html);
          w2.document.close();
          setTimeout(()=>w2.print(),400);
        },800);
      }
    },600);
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-200 shrink-0">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{current.titulo} — {convenio}</p>
          <p className="text-xs text-gray-500">{pacienteNome}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handlePrint} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition">
            <span>🖨️</span> Imprimir
          </button>
          {secondDoc && (
            <button onClick={handlePrintAll} className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition">
              <span>📄</span> Imprimir Tudo
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg text-xl">×</button>
        </div>
      </div>

      {/* Doc tabs */}
      {secondDoc && (
        <div className="bg-gray-100 border-b border-gray-200 flex shrink-0">
          <button onClick={()=>setShowSecond(false)}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition ${!showSecond?"bg-white text-blue-600 border-b-2 border-blue-600":"text-gray-500 hover:bg-gray-50"}`}>
            <span>📄</span> Guia de Internação
          </button>
          <button onClick={()=>setShowSecond(true)}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition ${showSecond?"bg-white text-emerald-600 border-b-2 border-emerald-600":"text-gray-500 hover:bg-gray-50"}`}>
            <span>📋</span> TCLE – Consentimento
          </button>
        </div>
      )}

      {/* Preview */}
      <div className="flex-1 overflow-hidden bg-gray-300">
        <iframe key={showSecond?"tcle":"guia"} srcDoc={current.html} className="w-full h-full border-0" title={current.titulo}/>
      </div>

      {/* Footer */}
      <div className="bg-white px-4 py-2.5 border-t border-gray-100 flex items-center justify-between shrink-0">
        <p className="text-xs text-gray-400">💡 "Imprimir" → "Salvar como PDF" para baixar</p>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Fechar</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState("");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏥</div>
          <h1 className="text-2xl font-bold text-gray-800">GuiaFácil</h1>
          <p className="text-gray-500 text-sm mt-1">Dr. Guilherme Palitot • Urologia</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm text-blue-800">
          <p className="font-medium mb-1">⚙️ Configuração inicial</p>
          <p>Para usar as funções de IA (leitura de cartão, geração de PDF e TCLE), informe sua chave da API Anthropic.</p>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Chave API Anthropic</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          placeholder="sk-ant-..."
          value={key}
          onChange={e => setKey(e.target.value)}
        />
        <p className="text-xs text-gray-400 mb-4">
          Obtenha em <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">console.anthropic.com</a>. Salva só neste dispositivo.
        </p>
        <button
          onClick={() => { if (key.startsWith("sk-")) { localStorage.setItem("anthropic_key", key); onSave(key); } }}
          disabled={!key.startsWith("sk-")}
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Salvar e entrar →
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [apiKey] = useState(() => localStorage.getItem("anthropic_key") || "");
  const [showSetup, setShowSetup] = useState(!apiKey);
  const [convenio,setConvenio]=useState("");
  const [showCamera,setShowCamera]=useState(false);
  const [pdfHtml,setPdfHtml]=useState(null);
  const [gerando,setGerando]=useState(false);
  const [tcleHtml,setTcleHtml]=useState(null);
  const [gerarComTCLE,setGerarComTCLE]=useState(true);
  const [paciente,setPaciente]=useState({nome:"",carteira:"",validade:"",plano:"",cns:"",cid:"",hospital:""});
  const [procPrincipal,setProcPrincipal]=useState(null);
  const [procsSecundarios,setProcsSecundarios]=useState([]);
  const [justificativa,setJustificativa]=useState("");
  const [opmes,setOpmes]=useState([]);
  const [carater,setCarater]=useState("E");
  const [regime,setRegime]=useState("1");
  const [diarias,setDiarias]=useState("1");

  const handleCardData=useCallback((data)=>{
    setPaciente(p=>({...p,nome:data.nome||p.nome,carteira:data.carteira||p.carteira,
      validade:data.validade||p.validade,plano:data.plano||p.plano,cns:data.cns||p.cns}));
    if(data.convenio&&CONVENIOS.includes(data.convenio)&&!convenio){
      setConvenio(data.convenio);
      setPaciente(p=>({...p,hospital:getHospitais(data.convenio)[0]}));
    }
  },[convenio]);

  const selectPrincipal=item=>{
    setProcPrincipal(item);
    const newCid=getCID(item.codigo);
    setPaciente(p=>({...p,cid:newCid}));
    setJustificativa(getJustificativas(item.codigo,newCid)[0]);
    setOpmes(getOPME(item.codigo));
  };

  const handleGerarPDF=async()=>{
    setGerando(true);
    try {
      const [html, tcle] = await Promise.all([
        gerarPDF({convenio,paciente,medico:MEDICO,procPrincipal,
          procsSecundarios,justificativa,opmes,carater,regime,diarias,cid:paciente.cid}),
        gerarComTCLE && getTCLE(procPrincipal?.codigo) !== null
          ? gerarTCLE({paciente,medico:MEDICO,procPrincipal})
          : gerarComTCLE && getTCLE(procPrincipal?.codigo) === null
            ? gerarTCLE({paciente,medico:MEDICO,procPrincipal})
            : Promise.resolve(null),
      ]);
      setPdfHtml(html);
      if (tcle) setTcleHtml(tcle);
    } catch(e) {
      alert("Erro ao gerar documentos. Verifique a conexão e tente novamente.");
    } finally {
      setGerando(false);
    }
  };

  const reset=()=>{
    setConvenio("");setPdfHtml(null);
    setPaciente({nome:"",carteira:"",validade:"",plano:"",cns:"",cid:"",hospital:""});
    setProcPrincipal(null);setProcsSecundarios([]);setJustificativa("");setOpmes([]);
    setCarater("E");setRegime("1");setDiarias("1");setTcleHtml(null);setGerarComTCLE(true);
  };

  const cvMeta={
    "Bradesco Saúde": {icon:"🏥",sel:"border-red-500 bg-red-50 ring-2 ring-red-200",unsel:"border-gray-200 hover:border-red-300 hover:bg-red-50",bar:"bg-red-700",badge:"bg-red-100 text-red-700 border-red-200"},
    "SulAmérica":     {icon:"🔵",sel:"border-blue-500 bg-blue-50 ring-2 ring-blue-200",unsel:"border-gray-200 hover:border-blue-300 hover:bg-blue-50",bar:"bg-blue-700",badge:"bg-blue-100 text-blue-700 border-blue-200"},
    "Unimed Recife":  {icon:"🟢",sel:"border-green-500 bg-green-50 ring-2 ring-green-200",unsel:"border-gray-200 hover:border-green-300 hover:bg-green-50",bar:"bg-green-700",badge:"bg-green-100 text-green-700 border-green-200"},
    "Maximed":        {icon:"🟣",sel:"border-purple-500 bg-purple-50 ring-2 ring-purple-200",unsel:"border-gray-200 hover:border-purple-300 hover:bg-purple-50",bar:"bg-purple-700",badge:"bg-purple-100 text-purple-700 border-purple-200"},
    "Amil":           {icon:"🔷",sel:"border-blue-700 bg-blue-50 ring-2 ring-blue-300",unsel:"border-gray-200 hover:border-blue-500 hover:bg-blue-50",bar:"bg-blue-800",badge:"bg-blue-100 text-blue-800 border-blue-300"},
    "CASSI":          {icon:"🟡",sel:"border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200",unsel:"border-gray-200 hover:border-yellow-400 hover:bg-yellow-50",bar:"bg-yellow-600",badge:"bg-yellow-100 text-yellow-700 border-yellow-300"},
    "Camed":          {icon:"🩺",sel:"border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200",unsel:"border-gray-200 hover:border-emerald-400 hover:bg-emerald-50",bar:"bg-emerald-700",badge:"bg-emerald-100 text-emerald-700 border-emerald-300"},
    "Saúde Petrobras":{icon:"⛽",sel:"border-green-600 bg-green-50 ring-2 ring-green-300",unsel:"border-gray-200 hover:border-green-500 hover:bg-green-50",bar:"bg-green-800",badge:"bg-green-100 text-green-800 border-green-400"},
  };
  const cm=cvMeta[convenio]||{};

  if (showSetup) return <ApiKeySetup onSave={() => setShowSetup(false)} />;

  return (
    <div className="min-h-screen bg-slate-100 py-5 px-4">
      <div className="max-w-lg mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏥</span>
            <span className="font-bold text-gray-800 text-sm">GuiaFácil</span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">v2.0</span>
          </div>
          <p className="text-xs text-gray-400">{MEDICO.nome.split(" ").slice(0,2).join(" ")} · {MEDICO.especialidade}</p>
        </div>

        {/* Convênio */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Convênio *</label>
          <select className="w-full mt-2 border border-gray-200 rounded-xl px-3 py-3 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={convenio} onChange={e=>{setConvenio(e.target.value);setPaciente(p=>({...p,hospital:getHospitais(e.target.value)[0]}));}}>
            <option value="">Selecione o convênio...</option>
            {CONVENIOS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Paciente */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-sm">Paciente</h2>
            <button onClick={()=>setShowCamera(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
              <span>📷</span> Scan carteirinha
            </button>
          </div>
          <Field label="Nome completo *" value={paciente.nome} onChange={e=>setPaciente(p=>({...p,nome:e.target.value}))} placeholder="Nome do paciente"/>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Carteirinha" value={paciente.carteira} onChange={e=>setPaciente(p=>({...p,carteira:e.target.value}))} placeholder="0000000000"/>
            <Field label="Validade" value={paciente.validade} onChange={e=>setPaciente(p=>({...p,validade:e.target.value}))} placeholder="MM/AAAA"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Plano" value={paciente.plano} onChange={e=>setPaciente(p=>({...p,plano:e.target.value}))} placeholder="Nacional Flex"/>
            <Field label="CNS" value={paciente.cns} onChange={e=>setPaciente(p=>({...p,cns:e.target.value}))} placeholder="000 0000 0000 0000"/>
          </div>
        </div>

        {/* Procedimento */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800 text-sm">Procedimento</h2>

          {/* Principal */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Principal *</label>
            <div className="mt-2">
              <TUSSSearch onSelect={selectPrincipal} placeholder="Buscar por nome ou código TUSS..."/>
            </div>
            {procPrincipal?(
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
                <span className="font-mono text-xs bg-red-600 text-white px-2 py-1 rounded-lg shrink-0">{procPrincipal.codigo}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{procPrincipal.nome}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Tab. {procPrincipal.tabela}</p>
                </div>
                <button onClick={()=>setProcPrincipal(null)} className="text-red-400 hover:text-red-600 text-2xl leading-none shrink-0">×</button>
              </div>
            ):(
              <p className="text-center text-xs text-gray-400 py-3 border-2 border-dashed border-gray-200 rounded-xl mt-2">Nenhum selecionado</p>
            )}
          </div>

          {/* CID + Caráter */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="CID-10" value={paciente.cid} onChange={e=>{
              const newCid=e.target.value;
              setPaciente(p=>({...p,cid:newCid}));
              const templates=getJustificativas(procPrincipal?.codigo,newCid);
              if(!justificativa||justificativa===getJustificativas(procPrincipal?.codigo,paciente.cid)[0]){
                setJustificativa(templates[0]||"");
              }
            }} placeholder="Ex: Z30.2"/>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Caráter</label>
              <select className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={carater} onChange={e=>setCarater(e.target.value)}>
                <option value="E">Eletivo</option>
                <option value="U">Urgência/Emergência</option>
              </select>
            </div>
          </div>

          {/* Secundários */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Procedimentos Secundários</label>
            <div className="mt-2">
              <TUSSSearch onSelect={item=>{if(!procsSecundarios.find(p=>p.codigo===item.codigo))setProcsSecundarios(ps=>[...ps,item]);}} placeholder="Adicionar procedimento secundário..."/>
            </div>
            {procsSecundarios.length>0&&(
              <div className="space-y-2 mt-2">
                {procsSecundarios.map((p,i)=>(
                  <div key={p.codigo} className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                    <span className="font-mono text-xs bg-orange-500 text-white px-2 py-0.5 rounded-lg">{p.codigo}</span>
                    <span className="text-sm text-gray-700 flex-1 truncate">{p.nome}</span>
                    <button onClick={()=>setProcsSecundarios(ps=>ps.filter((_,j)=>j!==i))} className="text-orange-400 hover:text-red-500 text-xl leading-none">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Local e Internação */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="font-bold text-gray-800 text-sm">Local e Internação</h2>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hospital / Local Solicitado</label>
            <select className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={paciente.hospital||getHospitais(convenio)[0]} onChange={e=>setPaciente(p=>({...p,hospital:e.target.value}))}>
              {getHospitais(convenio).map(h=><option key={h}>{h}</option>)}
              <option value="__outro__">Outro...</option>
            </select>
            {paciente.hospital==="__outro__"&&(
              <div className="mt-2">
                <Field label="Nome do hospital" value={paciente.hospitalCustom||""} onChange={e=>setPaciente(p=>({...p,hospitalCustom:e.target.value}))} placeholder="Digite o nome"/>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Regime</label>
              <select className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={regime} onChange={e=>setRegime(e.target.value)}>
                <option value="1">Hospitalar</option>
                <option value="2">Hospital-dia</option>
                <option value="3">Domiciliar</option>
              </select>
            </div>
            <Field label="Diárias" value={diarias} onChange={e=>setDiarias(e.target.value)} placeholder="1"/>
          </div>
        </div>

        {/* Indicação Clínica */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="font-bold text-gray-800 text-sm">Indicação Clínica</h2>
          {procPrincipal&&getJustificativas(procPrincipal.codigo,paciente.cid).length>0&&(
            <div className="space-y-2">
              {getJustificativas(procPrincipal.codigo,paciente.cid).map((t,i)=>(
                <button key={i} onClick={()=>setJustificativa(t)}
                  className={`w-full text-left text-xs p-3 rounded-xl border-2 transition ${justificativa===t?"border-green-500 bg-green-50 text-green-800":"border-gray-200 bg-gray-50 text-gray-600 hover:border-green-400 hover:bg-green-50"}`}>
                  {t.length>120?t.slice(0,120)+"…":t}
                </button>
              ))}
            </div>
          )}
          <Field label="Texto da indicação" value={justificativa} onChange={e=>setJustificativa(e.target.value)} multiline placeholder="Digite a indicação clínica para a internação..."/>
        </div>

        {/* OPMEs */}
        {opmes.length>0&&(
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
            <h2 className="font-bold text-gray-800 text-sm">OPMEs</h2>
            <div className="space-y-2">
              {opmes.map((o,i)=>(
                <div key={i} className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2">
                  <span className="text-sm text-gray-700 flex-1">{o.descricao}</span>
                  <span className="text-xs text-gray-400 mr-2 shrink-0">{o.quantidade}</span>
                  <button onClick={()=>setOpmes(os=>os.filter((_,j)=>j!==i))} className="text-purple-400 hover:text-red-500 text-xl leading-none">×</button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">Sugeridas com base no procedimento. Remova as que não se aplicam.</p>
          </div>
        )}

        {/* TCLE toggle */}
        {procPrincipal&&(
          <div className={`flex items-center justify-between p-4 bg-white rounded-2xl border-2 shadow-sm transition cursor-pointer ${gerarComTCLE?"border-emerald-400 bg-emerald-50":"border-gray-200"}`}
            onClick={()=>setGerarComTCLE(v=>!v)}>
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Incluir TCLE</p>
                <p className="text-xs text-gray-500">{getTCLE(procPrincipal.codigo)!==null?"Pré-definido · padrão SBU":"Gerado pela IA"}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${gerarComTCLE?"bg-emerald-500":"bg-gray-300"}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${gerarComTCLE?"translate-x-6":"translate-x-0"}`}></div>
            </div>
          </div>
        )}

        {/* Botão Gerar */}
        <button onClick={handleGerarPDF} disabled={gerando||!convenio||!paciente.nome||!procPrincipal}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-40 transition text-base">
          {gerando?(
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Gerando{convenio==="Bradesco Saúde"?"":" com IA"}...</span>
            </>
          ):(
            <>
              <span className="text-xl">📄</span>
              <span>Gerar {gerarComTCLE&&procPrincipal?"Guia + TCLE":"Guia"}</span>
              <span className="opacity-60 text-sm">→ PDF</span>
            </>
          )}
        </button>

        <button onClick={reset}
          className="w-full py-3 border border-gray-200 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          🔄 Limpar formulário
        </button>

        <p className="text-center text-xs text-gray-400 pb-4">
          Dr. {MEDICO.nome.split(" ").slice(0,2).join(" ")} · {MEDICO.especialidade} · {MEDICO.conselho} {MEDICO.numero}-{MEDICO.uf}
        </p>
      </div>

      {showCamera&&(
        <CameraModal onClose={()=>setShowCamera(false)}
          onDataExtracted={data=>{handleCardData(data);setShowCamera(false);}}/>
      )}
      {pdfHtml&&(
        <PDFModal htmlContent={pdfHtml} convenio={convenio} titulo="Guia de Internação"
          pacienteNome={paciente.nome} onClose={()=>setPdfHtml(null)}
          secondDoc={tcleHtml?{html:tcleHtml,titulo:"TCLE – Termo de Consentimento"}:null}
          onOpenSecond={()=>{setPdfHtml(null);}}
        />
      )}
      {tcleHtml&&!pdfHtml&&(
        <PDFModal htmlContent={tcleHtml} convenio="SBU" titulo="TCLE – Termo de Consentimento"
          pacienteNome={paciente.nome} onClose={()=>setTcleHtml(null)}/>
      )}
    </div>
  );
}
