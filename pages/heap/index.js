const elements = {
  input: () => document.getElementById("syntax"),
  dialog: () => document.getElementById("dialog-id"),
  error: () => document.getElementById("error"),
  assignsWrapper: () => document.getElementById("assigns"),
  heapMethodMsg: () => document.getElementById("heap-method"),
  formBtn: () => document.getElementById("form-btn"),
  form: () => document.getElementById("formHeap"),
};

// ! Inicialização quando o usuário acessar o link ou recarrega a página
let errorMsg = null;
let heapMethod = null;
let lastNew = null;
let heapArray = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
let assigns = new Array();
let linkedlist = new LinkedList(new ListNode([0, 11]));

elements.form().addEventListener("submit", function (event) {
  event.preventDefault();
  readInput();
});

function showDialog() {
  elements.dialog().showModal();
}

function closeDialog() {
  elements.dialog().close();
}

function hideError() {
  let error = elements.error();
  if (error) error.innerText = "";
}

function showError() {
  let actualError = elements.error();
  actualError.innerText = errorMsg;
}

function isHeapValid(text) {
  let isValid = false;
  const regex = /^heap (first|best|worst|next)$/;
  if (regex.test(text)) {
    isValid = true;
  } else errorMsg = "Erro de sintaxe: heap { first | best | worst | next}.";
  return isValid;
}

function isNewValid(text) {
  let isValid = false;
  const regex = /^new \w+ \d+$/;
  if (regex.test(text)) isValid = true;
  else if (
    !(regex.test(text) && linkedlist.hasSpace(Number(text.split(" ")[2])))
  )
    isValid = false;
  else errorMsg = "Erro de sintaxe: new <id> <number>";
  return isValid;
}

function isDelValid(text) {
  let isValid = false;
  const regex = /^del \w+$/;
  if (regex.test(text)) isValid = true;
  else errorMsg = "Erro de sintaxe: del <id>.";
  return isValid;
}

function isAssignValid(text) {
  let isValid = false;
  const regex = /^\w+ = \w+$/;
  if (regex.test(text)) isValid = true;
  else errorMsg = "Erro de sintaxe: <id> = <id>.";
  return isValid;
}

function isInputValid(text) {
  let isValid = false;
  if (text.includes("heap")) isValid = isHeapValid(text);
  else if (text.includes("new")) isValid = isNewValid(text);
  else if (text.includes("del")) isValid = isDelValid(text);
  else if (text.includes("=")) isValid = isAssignValid(text);
  else errorMsg = "Erro: sintaxe não suportada.";

  return isValid;
}

function updateHeapView() {
  heapArray.forEach((value, index) => {
    let heapUnit = document.getElementById("heap-" + index);
    if (value != 0) {
      heapUnit.className = "";
      heapUnit.classList.add("heap__unit");
      heapUnit.classList.add("heap__unit--reserved");
      heapUnit.innerText = value;
    } else {
      heapUnit.className = "";
      heapUnit.classList.add("heap__unit");
      heapUnit.innerText = "";
    }
  });
}

function checkAssign(delId) {
  let exist = false;
  let pattern;
  assigns.forEach((pair) => {
    if (pair.includes(delId)) {
      exist = true;
      pattern = pair[0] + "=" + pair[1];
    }
  });

  if (exist) {
    let assignDeleted = document.getElementById(pattern);
    assignDeleted.remove();
  }
}

// * Setar o metodo da heap, pois em tese a heap ja esta criada
function createHeap(arrayText) {
  if (arrayText[1] === "first") heapMethod = "first";
  else if (arrayText[1] === "best") heapMethod = "best";
  else if (arrayText[1] === "worst") heapMethod = "worst";
  else if (arrayText[1] === "next") heapMethod = "next";
  else console.error("Erro não tratado detectado.");

  elements.heapMethodMsg().innerText = "heap: " + heapMethod;
}

// * Inserção na heap
function createVariable(arrayText) {
  const newId = arrayText[1]; // a
  const newNumber = Number(arrayText[2]) - 1; // 3

  if (linkedlist.hasSpace(newNumber)) {
    let availableNodes = linkedlist.findAvailableNodes(newNumber); // [ [init, final], [init, final], ... ]

    // * Insere no availableNodes[0]
    if (heapMethod === "first") {
      for (
        let i = availableNodes[0][0];
        i <= availableNodes[0][0] + newNumber;
        i++
      ) {
        console.log(i);
        heapArray[i] = newId;
      }
    }
    // * Insere no availableNodes com a diferença init - final de menor módulo
    else if (heapMethod === "best") {
      let indiceMenor = 0;
      let menor = availableNodes[0][1] - availableNodes[0][0];

      for (let i = 1; i < availableNodes.length; i++) {
        let valor = availableNodes[i][1] - availableNodes[i][0];
        if (valor < menor) {
          menor = valor;
          indiceMenor = i;
        }
      }

      for (
        let i = availableNodes[indiceMenor][0];
        i <= availableNodes[indiceMenor][0] + newNumber;
        i++
      )
        heapArray[i] = newId;
    }
    // * Insere no availableNodes com a diferença init - final de maior módulo
    else if (heapMethod === "worst") {
      let indiceMaior = 0;
      let maior = availableNodes[0][1] - availableNodes[0][0];

      for (let i = 1; i < availableNodes.length; i++) {
        let valor = availableNodes[i][1] - availableNodes[i][0];
        if (valor > maior) {
          maior = valor;
          indiceMaior = i;
        }
      }

      for (
        let i = availableNodes[indiceMaior][0];
        i <= availableNodes[indiceMaior][0] + newNumber;
        i++
      )
        heapArray[i] = newId;
    }
    // * Insere no availableNodes cujo init é igual ao lastNew
    else if (heapMethod === "next") {
      if (lastNew === null)
        for (
          let i = availableNodes[0][0];
          i <= availableNodes[0][0] + newNumber;
          i++
        )
          heapArray[i] = newId;
      else {
        let ultimaOcorrenciaId = heapArray.lastIndexOf(newId);

        let nodesAfter = new Array();
        let nodesBefore = new Array();

        availableNodes.forEach((pair) => {
          if (pair[0] > ultimaOcorrenciaId) nodesAfter.push(pair);
          else if (pair[0] < ultimaOcorrenciaId) nodesBefore.push(pair);
        });

        if (nodesAfter.length) {
          for (let i = nodesAfter[0][0]; i <= nodesAfter[0][0] + newNumber; i++)
            heapArray[i] = newId;
        } else {
          for (
            let i = nodesBefore[0][0];
            i <= nodesBefore[0][0] + newNumber;
            i++
          )
            heapArray[i] = newId;
        }
      }
      lastNew = newId;
    }

    linkedlist.update(heapArray);
    updateHeapView();
  } else {
    errorMsg = "Erro de alocação: overflow.";
    showError();
  }
}

// * Liberação na heap
function deleteVariable(arrayText) {
  const delId = arrayText[1];
  for (let i = 0; i < heapArray.length; i++) {
    if (heapArray[i] == delId) heapArray[i] = 0;
  }
  checkAssign(delId);
  linkedlist.update(heapArray);
  updateHeapView();
}

// * Criação de atribuição
function assignVariables(arrayText) {
  assigns.push([arrayText[0], arrayText[2]]);
  let newAssign = document.createElement("p");
  newAssign.id = arrayText[0] + "=" + arrayText[2];
  newAssign.classList.add("dialog-obs");
  newAssign.classList.add("heap__assign");
  newAssign.innerText = arrayText[0] + " = " + arrayText[2];
  elements.assignsWrapper().appendChild(newAssign);
}

function executeInput(text) {
  const splitedText = text.split(" ");
  if (text.includes("heap")) {
    createHeap(splitedText);
  } else if (text.includes("new")) {
    createVariable(splitedText);
  } else if (text.includes("del")) {
    deleteVariable(splitedText);
  } else if (text.includes("=")) {
    assignVariables(splitedText);
  }
}

function readInput() {
  if (isInputValid(elements.input().value)) {
    executeInput(elements.input().value);
    hideError();
    elements.input().value = "";
  } else {
    showError();
  }
}

function killHeap() {
  errorMsg = null;
  heapMethod = null;
  lastNew = null;
  heapArray = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  assigns = new Array();
  linkedlist.clear();
  linkedlist = new LinkedList(new ListNode([0, 11]));
  elements.heapMethodMsg().innerText = "";
  updateHeapView();
}
