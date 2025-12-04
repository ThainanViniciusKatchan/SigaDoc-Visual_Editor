// Inicializa ícones
lucide.createIcons();

// Estado da Aplicação
let components = []; // Array de objetos {id, type, props}
let selectedId = null;

// Configuração dos Tipos de Componentes (Mapeamento para FreeMarker)
const componentConfig = {
    texto: {
        label: 'Texto Curto',
        icon: 'type',
        defaultProps: { titulo: 'Título do Campo', var: 'variavel_texto', largura: '', maxcaracteres: '' },
        renderPreview: (props) => `<div class="flex flex-col gap-1"><label class="text-sm font-bold text-gray-700">${props.titulo}:</label><input type="text" disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="\${${props.var}}"></div>`,
        generateFM: (props) => `[@texto titulo="${props.titulo}" var="${props.var}" largura="${props.largura}" maxcaracteres="${props.maxcaracteres}" /]`
    },
    memo: {
        label: 'Texto Longo',
        icon: 'align-left',
        defaultProps: { titulo: 'Observações', var: 'variavel_memo', linhas: '3', colunas: '60' },
        renderPreview: (props) => `<div class="flex flex-col gap-1"><label class="text-sm font-bold text-gray-700">${props.titulo}:</label><textarea disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 h-20"></textarea></div>`,
        generateFM: (props) => `[@memo titulo="${props.titulo}" var="${props.var}" linhas="${props.linhas}" colunas="${props.colunas}" /]`
    },
    data: {
        label: 'Data',
        icon: 'calendar',
        defaultProps: { titulo: 'Data do Evento', var: 'dt_evento' },
        renderPreview: (props) => `<div class="flex flex-col gap-1"><label class="text-sm font-bold text-gray-700">${props.titulo}:</label><div class="relative"><input type="text" disabled class="w-32 border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="dd/mm/aaaa"><i data-lucide="calendar" class="absolute right-2 top-1.5 w-4 h-4 text-gray-400"></i></div></div>`,
        generateFM: (props) => `[@data titulo="${props.titulo}" var="${props.var}" /]`
    },
    selecao: {
        label: 'Seleção',
        icon: 'list',
        defaultProps: { titulo: 'Escolha uma opção', var: 'variavel_sel', opcoes: 'Opção A;Opção B;Opção C' },
        renderPreview: (props) => `<div class="flex flex-col gap-1"><label class="text-sm font-bold text-gray-700">${props.titulo}:</label><select disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50"><option>Selecione...</option></select></div>`,
        generateFM: (props) => `[@selecao titulo="${props.titulo}" var="${props.var}" opcoes="${props.opcoes}" /]`
    },
    checkbox: {
        label: 'Checkbox',
        icon: 'check-square',
        defaultProps: { titulo: 'Confirmo os dados', var: 'chk_confirma' },
        renderPreview: (props) => `<div class="flex items-center gap-2 mt-4"><input type="checkbox" disabled><label class="text-sm font-bold text-gray-700">${props.titulo}</label></div>`,
        generateFM: (props) => `[@checkbox titulo="${props.titulo}" var="${props.var}" /]`
    },
    pessoa: {
        label: 'Pessoa',
        icon: 'user',
        defaultProps: { titulo: 'Servidor', var: 'p_servidor' },
        renderPreview: (props) => `<div class="flex flex-col gap-1"><label class="text-sm font-bold text-gray-700">${props.titulo}:</label><div class="flex gap-1"><input type="text" disabled class="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="Matrícula/Nome"><button disabled class="px-2 bg-gray-200 rounded">...</button></div></div>`,
        generateFM: (props) => `[@pessoa titulo="${props.titulo}" var="${props.var}" /]`
    },
    lotacao: {
        label: 'Lotação',
        icon: 'building',
        defaultProps: { titulo: 'Unidade', var: 'l_unidade' },
        renderPreview: (props) => `<div class="flex flex-col gap-1"><label class="text-sm font-bold text-gray-700">${props.titulo}:</label><div class="flex gap-1"><input type="text" disabled class="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="Sigla/Nome"><button disabled class="px-2 bg-gray-200 rounded">...</button></div></div>`,
        generateFM: (props) => `[@lotacao titulo="${props.titulo}" var="${props.var}" /]`
    }
};

// Referências DOM
const canvasEl = document.getElementById('canvas');
const canvasContentEl = document.getElementById('canvas-content');
const emptyStateEl = document.getElementById('empty-state');
const codeOutputEl = document.getElementById('code-output');
const propertiesPanelEl = document.getElementById('properties-panel');

// Lógica de Drag and Drop
document.querySelectorAll('.draggable-source').forEach(el => {
    el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', el.dataset.type);
        e.dataTransfer.effectAllowed = 'copy';
    });
});

canvasEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvasEl.classList.add('drag-over');
});

canvasEl.addEventListener('dragleave', () => {
    canvasEl.classList.remove('drag-over');
});

canvasEl.addEventListener('drop', (e) => {
    e.preventDefault();
    canvasEl.classList.remove('drag-over');
    const type = e.dataTransfer.getData('type');
    if (type) {
        addComponent(type);
    }
});

// Gerenciamento de Componentes
function addComponent(type) {
    const id = Date.now().toString();
    const config = componentConfig[type];

    // Clone profundo das propriedades padrão para evitar referência
    const props = JSON.parse(JSON.stringify(config.defaultProps));

    // Gera nome de variável único se já existir
    if (components.some(c => c.props.var === props.var)) {
        props.var = props.var + '_' + Math.floor(Math.random() * 100);
    }

    components.push({ id, type, props });
    renderCanvas();
    selectComponent(id);
    updateCode();
}

function deleteComponent(id) {
    components = components.filter(c => c.id !== id);
    if (selectedId === id) {
        selectedId = null;
        renderProperties(null);
    }
    renderCanvas();
    updateCode();
}

function updateComponentProps(id, newProps) {
    const comp = components.find(c => c.id === id);
    if (comp) {
        comp.props = { ...comp.props, ...newProps };
        renderCanvas();
        updateCode();
    }
}

function selectComponent(id) {
    selectedId = id;
    renderCanvas(); // Para atualizar a borda de seleção
    renderProperties(id);
}

// Renderização
function renderCanvas() {
    if (components.length === 0) {
        emptyStateEl.classList.remove('hidden');
        canvasContentEl.classList.add('hidden');
        return;
    }

    emptyStateEl.classList.add('hidden');
    canvasContentEl.classList.remove('hidden');
    canvasContentEl.innerHTML = '';

    components.forEach(comp => {
        const config = componentConfig[comp.type];
        const el = document.createElement('div');
        el.className = `canvas-item p-4 rounded-md cursor-pointer group relative ${selectedId === comp.id ? 'selected' : 'hover:border-blue-300'}`;
        el.onclick = () => selectComponent(comp.id);

        // Botão de excluir
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1';
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteComponent(comp.id);
        };

        // Tag do tipo
        const typeTag = document.createElement('div');
        typeTag.className = 'absolute top-2 left-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded tracking-wide pointer-events-none';
        typeTag.innerText = config.label;

        const content = document.createElement('div');
        content.className = 'mt-2 pointer-events-none'; // Impede interação com inputs do preview
        content.innerHTML = config.renderPreview(comp.props);

        el.appendChild(typeTag);
        el.appendChild(deleteBtn);
        el.appendChild(content);
        canvasContentEl.appendChild(el);
    });

    // Reinicializa ícones novos
    lucide.createIcons();
}

function renderProperties(id) {
    if (!id) {
        propertiesPanelEl.innerHTML = '<p class="text-sm text-gray-500 italic text-center mt-10">Selecione um componente no canvas para editar.</p>';
        return;
    }

    const comp = components.find(c => c.id === id);
    if (!comp) return;

    let html = '';

    // Campo Variável (Comum a todos)
    html += createInput('var', 'Nome da Variável', comp.props.var, 'Identificador único (sem espaços)');

    // Campos específicos
    Object.keys(comp.props).forEach(key => {
        if (key !== 'var') {
            html += createInput(key, capitalize(key), comp.props[key]);
        }
    });

    propertiesPanelEl.innerHTML = html;

    // Listeners para inputs
    propertiesPanelEl.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            updateComponentProps(id, { [e.target.name]: e.target.value });
        });
    });
}

function createInput(name, label, value, helpText = '') {
    return `
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-bold text-gray-600 uppercase">${label}</label>
                    <input type="text" name="${name}" value="${value}" class="border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                    ${helpText ? `<span class="text-[10px] text-gray-400">${helpText}</span>` : ''}
                </div>
            `;
}

// Geração de Código
function updateCode() {
    let code = '[#-- Início da Entrevista --]\n[@entrevista]\n\n';

    // Gera o grupo principal (simulando estrutura de documento Siga)
    if (components.length > 0) {
        code += '\t[@grupo]\n';
        components.forEach(comp => {
            const config = componentConfig[comp.type];
            const macro = config.generateFM(comp.props);
            // Colorização simples
            code += `\t\t${colorizeMacro(macro)}\n`;
        });
        code += '\t[/@grupo]\n';
    }

    code += '\n[/@entrevista]\n';

    // Adiciona um bloco de documento básico
    code += '\n[#-- Bloco do Documento (Visualização) --]\n[@documento]\n';
    code += '\t<p>Conteúdo do documento aqui...</p>\n';
    components.forEach(comp => {
        code += `\t<p><b>${comp.props.titulo}:</b> \${${comp.props.var}!}</p>\n`;
    });
    code += '[/@documento]';

    codeOutputEl.innerHTML = code;
}

function colorizeMacro(text) {
    // Simples colorização de syntax para exibição
    return text.replace(/(\[@\w+)/g, '<span class="cm-tag">$1</span>')
        .replace(/(\s\w+=)/g, '<span class="cm-attr">$1</span>')
        .replace(/(".*?")/g, '<span class="cm-string">$1</span>');
}

// Utilitários
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function limparCanvas() {
    if (confirm("Deseja limpar todo o documento?")) {
        components = [];
        selectedId = null;
        renderCanvas();
        renderProperties(null);
        updateCode();
    }
}

function copiarCodigo() {
    const text = codeOutputEl.innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Código FreeMarker copiado para a área de transferência!");
    });
}

// Inicialização
updateCode();
