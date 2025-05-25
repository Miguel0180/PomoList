let ButtonAdicionar = document.getElementById("adicionar"); 
let Tarefa = document.getElementById("Tarefa");
let TarefaTabela = document.getElementById("TarefaTabela");

// Carrega as tarefas do localStorage ou cria array vazio
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Normaliza tarefas para garantir que sejam objetos
tarefas = tarefas.map(t => {
    if (typeof t === "string") {
        return { texto: t, completa: false };
    }
    return t;
});

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
}

// Modal bootstrap e botão confirmar exclusão
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
let tarefaIndexParaExcluir = null;

function renderTarefa(tarefaObj, index) {
    const tarefa_item = createElement("div", "tarefa_item");

    // Checkbox para marcar a tarefa como completa
    const checkbox = createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefaObj.completa || false;
    checkbox.addEventListener("change", () => {
        tarefas[index].completa = checkbox.checked;
        RegistraLocal();
        renderLista();
    });

    const textoTarefa = createElement("p", "texto_tarefa");
    textoTarefa.textContent = tarefaObj.texto;
    if (tarefaObj.completa) {
        textoTarefa.classList.add("tarefa-completa");
    }

    const TarefaGroup = createElement("div", "tarefa-left")
    const btnGeralGroup = createElement("div", "tarefa-right");

    const btnEditar = createElement("button", "btn_editar btn-geral");
    btnEditar.innerHTML = '<i class="fa-solid white-t fa-pen"></i>';

    const btnExcluir = createElement("button", "btn_excluir btn-geral");
    btnExcluir.innerHTML = '<i class="fa-solid white-t fa-trash"></i>';

    btnEditar.addEventListener("click", () => {
        const inputEditar = createElement("input", "inputEditar");
        inputEditar.type = "text";
        inputEditar.value = tarefaObj.texto;

        const btnSalvar = createElement("button", "btn_salvar btn-geral");
        btnSalvar.innerHTML = '<i class="fa-solid white-t fa-check"></i>';

        tarefa_item.innerHTML = "";
        tarefa_item.appendChild(checkbox);
        tarefa_item.appendChild(inputEditar);
        btnGeralGroup.innerHTML = "";
        btnGeralGroup.appendChild(btnSalvar);
        tarefa_item.appendChild(btnGeralGroup);

        btnSalvar.addEventListener("click", () => {
            const novoTexto = inputEditar.value.trim();
            if (novoTexto !== "") {
                tarefas[index].texto = novoTexto;
                RegistraLocal();
                renderLista();
            } else {
                alert("O texto da tarefa não pode estar vazio.");
            }
        });
    });

    btnExcluir.addEventListener("click", () => {
        tarefaIndexParaExcluir = index;
        confirmDeleteModal.show();
    });

    btnGeralGroup.appendChild(btnEditar);
    btnGeralGroup.appendChild(btnExcluir);

    TarefaGroup.appendChild(checkbox);
    TarefaGroup.appendChild(textoTarefa);
    tarefa_item.appendChild(TarefaGroup);

    tarefa_item.appendChild(btnGeralGroup);

    TarefaTabela.appendChild(tarefa_item);
}

confirmDeleteBtn.addEventListener("click", () => {
    if (tarefaIndexParaExcluir !== null) {
        tarefas.splice(tarefaIndexParaExcluir, 1);
        RegistraLocal();
        renderLista();
        tarefaIndexParaExcluir = null;
        confirmDeleteModal.hide();
    }
});

function renderLista() {
    TarefaTabela.innerHTML = "";
    tarefas.forEach((tarefa, index) => renderTarefa(tarefa, index));
}

function verificarTarefa(textoTarefa) {
    return textoTarefa.trim().length > 0;
}

function RegistraLocal() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

ButtonAdicionar.addEventListener("click", (event) => {
    event.preventDefault();

    if (verificarTarefa(Tarefa.value)) {
        const texto = Tarefa.value.trim();
        tarefas.push({ texto, completa: false });
        RegistraLocal();
        renderLista();
        Tarefa.value = '';
    } else {
        alert("Digite uma tarefa válida.");
    }
});

// Renderiza lista ao carregar a página
renderLista();
