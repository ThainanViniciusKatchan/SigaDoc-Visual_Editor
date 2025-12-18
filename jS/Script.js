lucide.createIcons();

// CONFIGURAÇÃO DOS COMPONENTES
const componentConfig = {
    // Componentes prontos
    DadosServidor: {
        label: 'Dados do Servidor',
        icon: 'people',
        isContainer: false,
        defaultProps: { Comentario: '' },
        renderPreview: (props) => `
        <div class="font-bold text-blue-700 dark:text-blue-500 mb-2">
        ${props.Comentario ? `[#--${props.Comentario}--]` : ''}
        </div>
        <p class="text-90 font-bold text-blue-700 dark:text-blue-500">[#--Input pronto que recebe automaticamente as informações do servidor--]</p>
        <div class="font-bold text-gray-700 dark:text-yellow-500 mb-2">Dados do Servidor
        </div>`,
        generateFM: (props) => {
            const SigaVar = {
                Cadastrante: '${(doc.cadastrante.descricao)!}',
                MatriculaCadastrante: '${(doc.cadastrante.sigla)!}',
                CPFCadastrante: '${(doc.cadastrante.cpfFormatado)!}',
                telefone_contato: '${(doc.cadastrante.telefone_contato)!}',
                lotacao_manual: '${(doc.cadastrante.lotacao.orgaoUsuario.descricao)!}',
                cargo_manual: '${(doc.cadastrante.cargo.descricao)!}',
            }
            return `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n 
        [@grupo titulo="Dados do Cadastrante"]
        &lt;div style="display: inline-flex; gap: 10px; flex-wrap: wrap;">
            &lt;div style="width: 350px;">
                [@texto titulo="Nome" var="NomeCadastrante" default="${SigaVar.Cadastrante}" obrigatorio="Sim"/]
            &lt;/div>
            	[@texto titulo="Matrícula" var="MatriculaCadastrante" default="${SigaVar.MatriculaCadastrante}" obrigatorio="Sim"/]
            	[@campo tipo="cpf" titulo="CPF" var="CPFCadastrante" default="${SigaVar.CPFCadastrante}" obrigatorio=true/]
            &lt;div class="col-2" style="margin-left: -30px;">
            	[@field kind="telefone" var="telefone_contato" title="Telefone de Contato" required=true/]
            &lt;/div>
            &lt;div style="width: 480px; margin-left: -30px;">
            	[@texto var="lotacao_manual" titulo="Lotação" obrigatorio="Sim" default="${SigaVar.lotacao_manual}" /]
            &lt;/div>
            &lt;div style="display: inline-flex; gap: 10px; margin-top: -15px;">
            	[@texto var="cargo_manual" titulo="Cargo" largura="50" maxcaracteres="100" obrigatorio="Sim" default="${SigaVar.cargo_manual}" /]
            	[#assign horahoje = doc.getData()?substring(0,16)/]
            	[@texto var="horahoje" titulo="Data Solicitação" atts={'readonly':'readonly'}/]
        	&lt;/div>
        &lt;/div>
        &lt;p style="background: red; padding: 2px; width: 45%; text-align: center; color: white; margin-top: 10px;">
        Os campos acima são <strong>obrigatórios</strong> | Confira todas as informações antes de prosseguir
        &lt;/p>
    [/@grupo]`
        },
    },
    loopinput: {
        label: 'Input Dinâmico',
        icon: 'form',
        // "children" será o array que conterá os itens aninhados
        isContainer: true,
        defaultProps: { titulo: 'Título do Grupo', depende: '', varQuantidade: 'numItens', varAjax: 'numItensAjax', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div ><div class="font-bold text-gray-700 dark:text-yellow-500 mb-2">${props.titulo}</div><div class="text-xs text-gray-400 dark:text-gray-400">${props.depende ? 'Depende de: ' + props.depende : ''}</div><div class="text-xs text-purple-500 mt-1">Loop: ${props.varQuantidade} (Ajax: ${props.varAjax})</div>`,
        // O generateFM recebe "childrenCode" que é o código já processado dos filhos
        generateFM: (props, childrenCode) => {
            let attrGrupo = `titulo = "${props.titulo}"`;
            if (props.depende) attrGrupo += ` depende = "${props.depende}"`;

            return `${props.Comentario ? `[#--${props.Comentario}--]\n` : ''} [#-- Variável com a quantidade de opções da seleção--]
[#assign tamanhoOpcoes = "0;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15" /]
[@grupo ${attrGrupo}]
[@selecao titulo = "Quantidade" var="${props.varQuantidade}" reler = true idAjax = "${props.varAjax}" opcoes = tamanhoOpcoes /]
[@grupo depende = "${props.varAjax}"]
[#if ${props.varQuantidade} ! != '0']
[#list 1..(${props.varQuantidade}) ? number as i]
[@grupo]
    // TODO 
    **
    Adicionar uma forma de passar o valor de i do list 
                freeMarker para o childrenCode
    **
    ${childrenCode}
[/@grupo]
[/#list]
[/#if]
[/@grupo]
[/@grupo]`;
        }
    },
    condicional: {
        label: 'Condição (If/Else)',
        icon: 'git-branch', // Ícone de ramificação
        isContainer: true,  // Permite arrastar itens para dentro
        defaultProps: { tipo: 'if', expressao: 'variável == "valor"', Comentario: '' },
        renderPreview: (props) => {
            let colorClass = props.tipo === 'else' ? 'text-orange-600' : 'text-blue-600';
            let labelTipo = props.tipo.toUpperCase();
            let desc = props.tipo === 'else' ? '(Senão)' : `(${props.expressao})`;
            return `< div class="font-bold text-blue-700 dark:text-blue-500 mb-2" > ${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div >
    <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-bold px-2 py-1 rounded bg-gray-200 ${colorClass}">${labelTipo}</span>
        <span class="text-sm font-medium text-gray-700 truncate dark:text-orange-400">${desc}</span>
    </div>
`;
        },
        generateFM: (props, childrenCode) => {
            // Lógica de Geração do FreeMarker
            const expr = props.expressao ? ` ${props.expressao} ` : '';

            if (props.tipo === 'if') {
                // Se for IF, abre e fecha o bloco
                return `${props.Comentario ? `[#--${props.Comentario}--]` : ''} \n[#if${expr}]\n${childrenCode} \n\t[/#if]`;
            } else if (props.tipo === 'elseif') {
                // Elseif apenas injeta a tag, o fechamento depende do IF pai
                return `${props.Comentario ? `[#--${props.Comentario}--]` : ''} \n[#elseif${expr}]\n${childrenCode} `;
            } else {
                // Else não tem expressão e não fecha tag própria
                return `${props.Comentario ? `[#--${props.Comentario}--]` : ''} \n[#else]\n${childrenCode} `;
            }
        }
    },
    variavelFreeMarker: {
        label: 'Variável FreeMarker',
        icon: 'type',
        defaultProps: { var: 'Nome', valor: 'Valor', Comentario: '' },
        renderPreview: (props) => `< div class="font-bold text-blue-700 dark:text-blue-500 mb-2" > ${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div > <div style="display: flex; flex-direction: row; gap: 5px; justify-content: center; align-items: center;"><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.var}:</label><input type="text" disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700" placeholder="\${${props.var}}">${props.valor}:<input type="text" disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700" placeholder="\${${props.valor}}"></div>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[#assign ${props.var} = ${props.valor}]`
    },
    grupo: {
        label: 'Grupo',
        icon: 'box',
        // "children" será o array que conterá os itens aninhados
        isContainer: true,
        defaultProps: { titulo: 'Título do Grupo', depende: '', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><div class="font-bold text-gray-700 dark:text-yellow-500 mb-2">${props.titulo}</div><div class="text-xs text-gray-400 dark:text-gray-400">${props.depende ? 'Depende de: ' + props.depende : ''}</div>`,
        // O generateFM recebe "childrenCode" que é o código já processado dos filhos
        generateFM: (props, childrenCode) => {
            let attr = `titulo="${props.titulo}"`;
            if (props.depende) attr += ` depende="${props.depende}"`;
            return `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n
    [@grupo  ${attr}]\n${childrenCode}\t[/@grupo]`;
        }
    },
    separador: {
        label: 'Separador',
        icon: 'minus',
        defaultProps: {},
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700"><hr></label>`,
        generateFM: (props) => `[@separador /]`
    },
    texto: {
        label: 'Campo Texto',
        icon: 'type',
        defaultProps: { titulo: 'Campo Texto', var: 'txt_var', largura: '', maxcaracteres: '', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><input type="text" disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700" placeholder="\${${props.var}}">`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@texto titulo="${props.titulo}" var="${props.var}" largura="${props.largura}" maxcaracteres="${props.maxcaracteres}" /]`
    },
    numero: {
        label: 'Campo Número',
        icon: 'binary',
        defaultProps: { titulo: 'Campo numero', var: 'number_var', largura: '', maxcaracteres: '', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><input type="text" disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700" placeholder="\${${props.var}}">`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@numero titulo="${props.titulo}" var="${props.var}" largura="${props.largura}" maxcaracteres="${props.maxcaracteres}" /]`
    },
    editor: {
        label: 'Campo Editor',
        icon: 'text-initial',
        defaultProps: { titulo: 'Editor', var: 'editor_var', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><textarea disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 h-16"></textarea>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@editor titulo="${props.titulo}" var="${props.var}" /]`
    },
    memo: {
        label: 'Campo Texto Longo',
        icon: 'align-left',
        defaultProps: { titulo: 'Observações', var: 'memo_var', linhas: '3', colunas: '60', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><textarea disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 h-16"></textarea>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@memo titulo="${props.titulo}" var="${props.var}" linhas="${props.linhas}" colunas="${props.colunas}" /]`
    },
    data: {
        label: 'Data',
        icon: 'calendar',
        defaultProps: { titulo: 'Data', var: 'dt_var', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><div class="relative"><input type="text" disabled class="w-32 border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700" placeholder="__/__/____"><i data-lucide="calendar" class="absolute right-2 top-1.5 w-4 h-4 text-gray-400"></i></div>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@data titulo="${props.titulo}" var="${props.var}" /]`
    },
    horaMinuto: {
        label: 'Hora Minuto',
        icon: 'clock',
        defaultProps: { titulo: 'Hora Minuto', var: 'hr_var', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><div class="relative"><input type="text" disabled class="w-32 border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700" placeholder="__:__"><i data-lucide="clock" class="absolute right-2 top-1.5 w-4 h-4 text-gray-400"></i></div>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@horaMinuto titulo="${props.titulo}" var="${props.var}" /]`
    },
    selecao: {
        label: 'Seleção',
        icon: 'list',
        defaultProps: { titulo: 'Selecione', var: 'sel_var', opcoes: 'A;B;C', idAjax: 'Idêntificador do Ajax', reler: true, Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><select disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700"><option>Selecione...</option></select>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@selecao titulo="${props.titulo}" var="${props.var}" opcoes="${props.opcoes}" idAjax="${props.idAjax}" reler="${props.reler}" /]`
    },
    checkbox: {
        label: 'Checkbox',
        icon: 'check-square',
        defaultProps: { titulo: 'Confirmação', var: 'chk_var', reler: "", Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><div class="flex items-center gap-2 mt-2"><input type="checkbox" disabled><label class="text-sm font-bold text-gray-700 dark:text-white">${props.titulo}</label></div>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@checkbox titulo="${props.titulo}" var="${props.var}" reler="${props.reler}" /]`
    },
    pessoa: {
        label: 'Pesquisa de Pessoa',
        icon: 'user',
        defaultProps: { titulo: 'Servidor', var: 'p_servidor', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><div class="flex gap-1"><input type="text" disabled class="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700" placeholder="Matrícula/Nome"><button disabled class="px-2 bg-gray-200 dark:bg-gray-700 rounded">...</button></div>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@pessoa titulo="${props.titulo}" var="${props.var}" /]`
    },
    lotacao: {
        label: 'Pesquisa de Lotação',
        icon: 'building',
        defaultProps: { titulo: 'Unidade', var: 'l_unidade', Comentario: '' },
        renderPreview: (props) => `<div class="font-bold text-blue-700 dark:text-blue-500 mb-2">${props.Comentario ? `[#--${props.Comentario}--]` : ''}</div><label class="block text-sm font-bold text-gray-700 dark:text-white">${props.titulo}:</label><div class="flex gap-1"><input type="text" disabled class="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-50 dark:bg-gray-700" placeholder="Sigla/Nome"><button disabled class="px-2 bg-gray-200 dark:bg-gray-700 rounded">...</button></div>`,
        generateFM: (props) => `${props.Comentario ? `[#--${props.Comentario}--]` : ''}\n[@lotacao titulo="${props.titulo}" var="${props.var}" /]`
    }
};

// 2. ESTADO (ÁRVORE DE COMPONENTES)
let components = [];
let selectedId = null;
let draggedItemId = null; // Para reordenação

// Função para salvar componentes no localStorage
function saveComponents() {
    localStorage.setItem('sigadoc-components', JSON.stringify(components));
    mostrarMensagemSalvo();
}

// Função para mostrar mensagem de salvamento
function mostrarMensagemSalvo() {
    // Remove mensagem anterior se existir
    const msgAnterior = document.getElementById('msg-salvo');
    if (msgAnterior) msgAnterior.remove();

    // Cria nova mensagem
    const msg = document.createElement('div');
    msg.id = 'msg-salvo';
    msg.textContent = 'Seu código foi salvo';
    msg.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: fadeIn 0.3s ease;';
    document.body.appendChild(msg);

    // Remove após 2 segundos
    setTimeout(() => msg.remove(), 2000);
}

// Função para carregar componentes do localStorage
function loadComponents() {
    const saved = localStorage.getItem('sigadoc-components');
    if (saved) {
        try {
            components = JSON.parse(saved);
            return true;
        } catch (e) {
            console.error('Erro ao carregar componentes salvos:', e);
            components = [];
            return false;
        }
    }
    return false;
}

// Parser de código FreeMarker para componentes visuais
function parseCodeToComponents(code) {
    const newComponents = [];

    // Regex para macros simples
    const simpleMacroRegex = /\[@(\w+)\s+([^\]]*?)\/\]/g;

    // Regex para extrair atributos
    const attrRegex = /(\w+)="([^"]*)"/g;

    // Tipos de componentes suportados
    const supportedTypes = ['texto', 'numero', 'editor', 'memo', 'data', 'horaMinuto', 'selecao', 'checkbox', 'pessoa', 'lotacao', 'separador'];

    let match;
    while ((match = simpleMacroRegex.exec(code)) !== null) {
        const macroType = match[1];
        const attrString = match[2];

        // Verifica se é um tipo suportado
        if (!supportedTypes.includes(macroType)) continue;

        // Extrai atributos
        const props = {};
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attrString)) !== null) {
            props[attrMatch[1]] = attrMatch[2];
        }
        attrRegex.lastIndex = 0; // Reset regex

        // Preenche props padrão se não existirem
        const config = componentConfig[macroType];
        if (config && config.defaultProps) {
            Object.keys(config.defaultProps).forEach(key => {
                if (props[key] === undefined) {
                    props[key] = config.defaultProps[key];
                }
            });
        }

        // Cria componente
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        newComponents.push({
            id,
            type: macroType,
            props,
            children: []
        });
    }

    return newComponents;
}

// Sincroniza código do CodePage com componentes visuais
function syncCodeToComponents() {
    const savedCode = localStorage.getItem('sigadoc-freemarker-code');
    if (!savedCode) return;

    const parsedComponents = parseCodeToComponents(savedCode);
    if (parsedComponents.length > 0) {
        components = parsedComponents;
        saveComponents();
        renderCanvas();
    }

    // Exibe o código no painel
    document.getElementById('code-output').innerHTML = savedCode;
}

// 3. LÓGICA DE DRAG AND DROP

// Configura os itens da paleta
document.querySelectorAll('.draggable-source').forEach(el => {
    el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', el.dataset.type);
        e.dataTransfer.setData('source', 'palette');
        e.dataTransfer.effectAllowed = 'copy';
        e.stopPropagation();
    });
});

// Funções globais para eventos HTML (ondrop, ondragover)
window.handleDragOver = function (e) {
    e.preventDefault();
    e.stopPropagation();
    // Adiciona classe visual apenas ao alvo direto
    e.currentTarget.classList.add('drag-over');
}

window.handleDragLeave = function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

window.handleDrop = function (e, parentId) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');

    const type = e.dataTransfer.getData('type');
    const source = e.dataTransfer.getData('source');
    const draggedId = e.dataTransfer.getData('itemId');

    if (source === 'palette' && type) {
        // Adicionar novo componente da paleta
        addComponent(type, parentId);
    } else if (source === 'canvas' && draggedId) {
        // Reordenar ou mover componente existente
        moveComponent(draggedId, parentId, null);
    }
}

// Nova função para lidar com drag sobre containers (grupos/condições)
window.handleContainerDragOver = function (e, containerId) {
    e.preventDefault();
    e.stopPropagation();

    const containerEl = document.getElementById('comp-' + containerId);
    if (containerEl) {
        containerEl.classList.add('container-drag-over');
    }
}

window.handleContainerDragLeave = function (e, containerId) {
    e.preventDefault();
    e.stopPropagation();

    const containerEl = document.getElementById('comp-' + containerId);
    if (containerEl) {
        containerEl.classList.remove('container-drag-over');
    }
}

window.handleContainerDrop = function (e, containerId) {
    e.preventDefault();
    e.stopPropagation();

    const containerEl = document.getElementById('comp-' + containerId);
    if (containerEl) {
        containerEl.classList.remove('container-drag-over');
    }

    const type = e.dataTransfer.getData('type');
    const source = e.dataTransfer.getData('source');
    const draggedId = e.dataTransfer.getData('itemId');

    if (source === 'palette' && type) {
        // Adicionar novo componente da paleta ao container
        addComponent(type, containerId);
    } else if (source === 'canvas' && draggedId) {
        // Mover componente existente para o container
        moveComponent(draggedId, containerId, null);
    }
}

// 4. CRUD DE COMPONENTES

function addComponent(type, parentId) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const config = componentConfig[type];

    // Clona propriedades padrão
    const props = JSON.parse(JSON.stringify(config.defaultProps));

    // Garante unicidade da variável
    if (props.var && checkVarExists(props.var, components)) {
        props.var = props.var + '_' + Math.floor(Math.random() * 100);
    }

    const newComponent = { id, type, props, children: [] };

    if (parentId) {
        // Adiciona dentro de um grupo existente
        const parent = findComponentById(components, parentId);
        if (parent && parent.children) {
            parent.children.push(newComponent);
        }
    } else {
        // Adiciona na raiz
        components.push(newComponent);
    }

    renderCanvas();
    selectComponent(id);
    updateCode();
    saveComponents();
}

function deleteComponent(id) {
    // Função recursiva para remover
    function removeRecursive(list, idToRemove) {
        const index = list.findIndex(c => c.id === idToRemove);
        if (index > -1) {
            list.splice(index, 1);
            return true;
        }
        for (let c of list) {
            if (c.children && removeRecursive(c.children, idToRemove)) return true;
        }
        return false;
    }

    removeRecursive(components, id);

    if (selectedId === id) {
        selectedId = null;
        renderProperties(null);
    }
    renderCanvas();
    updateCode();
    saveComponents();
}

function updateComponentProps(id, newProps) {
    const comp = findComponentById(components, id);
    if (comp) {
        comp.props = { ...comp.props, ...newProps };
        renderCanvas(); // Atualiza visual (ex: título mudou)
        updateCode();   // Atualiza código gerado
        if (newProps.tipo) renderProperties(id);
        updateCode();
        saveComponents();
    }
}

// Nova função para mover componente
function moveComponent(componentId, targetParentId, targetIndex) {
    // Encontra e remove o componente da posição atual
    const component = findComponentById(components, componentId);
    if (!component) return;

    // Não permitir mover para dentro de si mesmo
    if (componentId === targetParentId) return;

    // Não permitir mover para dentro de seus próprios filhos
    if (isDescendant(component, targetParentId)) return;

    // Remove da posição atual
    removeComponentById(components, componentId);

    // Adiciona na nova posição
    if (targetParentId) {
        const targetParent = findComponentById(components, targetParentId);
        if (targetParent && targetParent.children) {
            if (targetIndex !== null) {
                targetParent.children.splice(targetIndex, 0, component);
            } else {
                targetParent.children.push(component);
            }
        }
    } else {
        if (targetIndex !== null) {
            components.splice(targetIndex, 0, component);
        } else {
            components.push(component);
        }
    }

    renderCanvas();
    updateCode();
    saveComponents();
}

// Nova função para reordenar componentes
function reorderComponent(draggedId, targetId, position) {
    const draggedComp = findComponentById(components, draggedId);
    const targetComp = findComponentById(components, targetId);

    if (!draggedComp || !targetComp) return;

    // Encontra os pais de ambos
    const draggedParentInfo = findParentById(components, draggedId);
    const targetParentInfo = findParentById(components, targetId);

    // Se não estão no mesmo nível, não permitir reordenação direta
    if (draggedParentInfo.parentId !== targetParentInfo.parentId) {
        // Mover para o mesmo nível do target
        moveComponent(draggedId, targetParentInfo.parentId, null);
        return;
    }

    // Estão no mesmo nível, reordenar
    const parentList = draggedParentInfo.parentId ?
        findComponentById(components, draggedParentInfo.parentId).children :
        components;

    // Remove da posição atual
    const draggedIndex = parentList.findIndex(c => c.id === draggedId);
    if (draggedIndex === -1) return;

    parentList.splice(draggedIndex, 1);

    // Encontra nova posição do target (após remoção)
    const targetIndex = parentList.findIndex(c => c.id === targetId);
    if (targetIndex === -1) return;

    // Insere antes ou depois
    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
    parentList.splice(insertIndex, 0, draggedComp);

    renderCanvas();
    updateCode();
    saveComponents();
}

// Helper para verificar se é descendente
function isDescendant(parent, childId) {
    if (!parent.children) return false;

    for (let child of parent.children) {
        if (child.id === childId) return true;
        if (isDescendant(child, childId)) return true;
    }
    return false;
}

// Helper para encontrar o pai de um componente
function findParentById(list, childId, parentId = null) {
    for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (c.id === childId) {
            return { parentId, index: i };
        }
        if (c.children) {
            const found = findParentById(c.children, childId, c.id);
            if (found.parentId !== undefined) return found;
        }
    }
    return { parentId: undefined, index: -1 };
}

// Helper para remover componente sem retorná-lo
function removeComponentById(list, id) {
    const index = list.findIndex(c => c.id === id);
    if (index > -1) {
        list.splice(index, 1);
        return true;
    }
    for (let c of list) {
        if (c.children && removeComponentById(c.children, id)) return true;
    }
    return false;
}

// Helper Recursivo para achar componente
function findComponentById(list, id) {
    for (let c of list) {
        if (c.id === id) return c;
        if (c.children) {
            const found = findComponentById(c.children, id);
            if (found) return found;
        }
    }
    return null;
}

function checkVarExists(varName, list) {
    for (let c of list) {
        if (c.props.var === varName) return true;
        if (c.children && checkVarExists(varName, c.children)) return true;
    }
    return false;
}

function selectComponent(id) {
    selectedId = id;
    // Atualiza classes de seleção visualmente sem re-renderizar tudo se possível
    document.querySelectorAll('.canvas-item').forEach(el => el.classList.remove('selected'));
    const el = document.getElementById('comp-' + id);
    if (el) el.classList.add('selected');

    renderProperties(id);
}

// 5. RENDERIZAÇÃO (VISUAL)

function renderCanvas() {
    const rootEl = document.getElementById('canvas-root-container');
    const emptyEl = document.getElementById('empty-state');

    if (components.length === 0) {
        emptyEl.classList.remove('hidden');
        rootEl.innerHTML = '';
        return;
    }
    emptyEl.classList.add('hidden');

    // Limpa e reconstrói a árvore
    rootEl.innerHTML = '';
    renderComponentList(components, rootEl, null);

    lucide.createIcons();
}

// Função recursiva para desenhar os componentes
function renderComponentList(list, containerEl, parentId) {
    list.forEach((comp, index) => {
        const config = componentConfig[comp.type];

        // Cria o elemento wrapper
        const itemEl = document.createElement('div');
        itemEl.id = 'comp-' + comp.id;
        let borderClass = 'border-gray-200 hover:border-blue-300';
        let bgClass = 'bg-white';

        if (comp.type === 'condicional') {
            borderClass = 'border-orange-300 hover:border-orange-500 border-2';
            bgClass = 'bg-orange-50';
        } else if (config.isContainer) {
            bgClass = 'bg-gray-50';
        }

        itemEl.className = `canvas-item p-4 rounded-md cursor-pointer group relative border transition-all ${borderClass} ${bgClass} ${selectedId === comp.id ? 'selected' : ''}`;

        // Tornar o item arrastável
        itemEl.draggable = true;
        itemEl.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            draggedItemId = comp.id;
            e.dataTransfer.setData('itemId', comp.id);
            e.dataTransfer.setData('source', 'canvas');
            e.dataTransfer.effectAllowed = 'move';
            itemEl.classList.add('opacity-50');
        });

        itemEl.addEventListener('dragend', (e) => {
            itemEl.classList.remove('opacity-50');
            draggedItemId = null;
        });

        // Criar zonas de reordenação APENAS para elementos NÃO-CONTAINERS
        // Containers (grupos/condições) não têm zonas de reordenação para não bloquear o drop
        if (!config.isContainer) {
            // Criar wrapper para as zonas de reordenação
            const reorderWrapper = document.createElement('div');
            reorderWrapper.style.position = 'absolute';
            reorderWrapper.style.top = '0';
            reorderWrapper.style.left = '0';
            reorderWrapper.style.right = '0';
            reorderWrapper.style.bottom = '0';
            reorderWrapper.style.pointerEvents = 'none';
            reorderWrapper.style.zIndex = '10';

            // Área de drop para reordenação (ANTES - metade superior)
            const dropBeforeEl = document.createElement('div');
            dropBeforeEl.className = 'reorder-drop-zone reorder-drop-before';
            dropBeforeEl.style.position = 'absolute';
            dropBeforeEl.style.top = '0';
            dropBeforeEl.style.left = '0';
            dropBeforeEl.style.right = '0';
            dropBeforeEl.style.height = '50%';
            dropBeforeEl.style.pointerEvents = 'all';
            dropBeforeEl.style.zIndex = '20';

            dropBeforeEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const draggedId = e.dataTransfer.getData('itemId');
                if (draggedId && draggedId !== comp.id) {
                    // Remove classes de outros elementos
                    document.querySelectorAll('.canvas-item').forEach(el => {
                        el.classList.remove('reorder-before', 'reorder-after');
                    });
                    // Adiciona classe ao elemento atual
                    itemEl.classList.add('reorder-before');
                }
            });

            dropBeforeEl.addEventListener('dragleave', (e) => {
                e.stopPropagation();
                itemEl.classList.remove('reorder-before');
            });

            dropBeforeEl.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                itemEl.classList.remove('reorder-before');
                const draggedId = e.dataTransfer.getData('itemId');
                if (draggedId && draggedId !== comp.id) {
                    reorderComponent(draggedId, comp.id, 'before');
                }
            });

            // Área de drop para reordenação (DEPOIS - metade inferior)
            const dropAfterEl = document.createElement('div');
            dropAfterEl.className = 'reorder-drop-zone reorder-drop-after';
            dropAfterEl.style.position = 'absolute';
            dropAfterEl.style.bottom = '0';
            dropAfterEl.style.left = '0';
            dropAfterEl.style.right = '0';
            dropAfterEl.style.height = '50%';
            dropAfterEl.style.pointerEvents = 'all';
            dropAfterEl.style.zIndex = '20';

            dropAfterEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const draggedId = e.dataTransfer.getData('itemId');
                if (draggedId && draggedId !== comp.id) {
                    // Remove classes de outros elementos
                    document.querySelectorAll('.canvas-item').forEach(el => {
                        el.classList.remove('reorder-before', 'reorder-after');
                    });
                    // Adiciona classe ao elemento atual
                    itemEl.classList.add('reorder-after');
                }
            });

            dropAfterEl.addEventListener('dragleave', (e) => {
                e.stopPropagation();
                itemEl.classList.remove('reorder-after');
            });

            dropAfterEl.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                itemEl.classList.remove('reorder-after');
                const draggedId = e.dataTransfer.getData('itemId');
                if (draggedId && draggedId !== comp.id) {
                    reorderComponent(draggedId, comp.id, 'after');
                }
            });

            reorderWrapper.appendChild(dropBeforeEl);
            reorderWrapper.appendChild(dropAfterEl);
            itemEl.appendChild(reorderWrapper);
        }

        // Evento de clique para seleção (Stop propagation para não selecionar o pai ao clicar no filho)
        itemEl.onclick = (e) => {
            e.stopPropagation();
            selectComponent(comp.id);
        };

        // Cabeçalho do Item (ícone e label)
        const headerEl = document.createElement('div');
        headerEl.className = 'absolute top-2 left-2 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded tracking-wide pointer-events-none z-10';
        headerEl.innerText = config.label;
        itemEl.appendChild(headerEl);

        // Botão de Excluir
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 z-20';
        deleteBtn.innerHTML = '<i data-lucide="trash-2" width="14" height="14"></i>';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteComponent(comp.id);
        };
        itemEl.appendChild(deleteBtn);

        // Conteúdo Principal
        const contentEl = document.createElement('div');
        contentEl.className = 'mt-3 pointer-events-none';
        contentEl.innerHTML = config.renderPreview(comp.props);
        itemEl.appendChild(contentEl);

        // SE FOR GRUPO (Container)
        if (config.isContainer) {
            itemEl.classList.add('bg-gray-50'); // Fundo diferente para grupos

            // Adicionar drag over no container inteiro - permite drop em qualquer área
            itemEl.addEventListener('dragover', (e) => {
                const target = e.target;
                const isReorderZone = target.classList.contains('reorder-drop-zone');
                const isDropZone = target.classList.contains('drop-zone');

                // Se não for zona de reordenação nem drop zone interna
                if (!isReorderZone && !isDropZone) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleContainerDragOver(e, comp.id);
                }
            });

            itemEl.addEventListener('dragleave', (e) => {
                const relatedTarget = e.relatedTarget;
                // Verifica se realmente saiu do container
                if (!relatedTarget || relatedTarget === itemEl || !itemEl.contains(relatedTarget)) {
                    handleContainerDragLeave(e, comp.id);
                }
            });

            itemEl.addEventListener('drop', (e) => {
                const target = e.target;
                const isDropZone = target.classList.contains('drop-zone');
                const isReorderZone = target.classList.contains('reorder-drop-zone');

                // Se droppou direto no container (não na zona de drop interna ou de reordenação)
                if (!isDropZone && !isReorderZone) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleContainerDrop(e, comp.id);
                }
            });

            const dropZoneEl = document.createElement('div');
            dropZoneEl.className = 'drop-zone mt-4 border border-dashed border-gray-300 rounded bg-white p-4 dark:bg-gray-700 dark:text-white';
            dropZoneEl.style.minHeight = '60px';

            // Configura eventos de drop para este container específico
            dropZoneEl.setAttribute('ondragover', 'handleDragOver(event)');
            dropZoneEl.setAttribute('ondragleave', 'handleDragLeave(event)');
            dropZoneEl.setAttribute('ondrop', `handleDrop(event, '${comp.id}')`);

            // Renderiza os filhos recursivamente dentro desta zona
            renderComponentList(comp.children, dropZoneEl, comp.id);

            // Se estiver vazio, mostra dica
            if (comp.children.length === 0) {
                dropZoneEl.innerHTML = '<div class="text-center text-xs text-gray-400 py-2 pointer-events-none">Arraste itens para dentro deste grupo</div>';
            }

            itemEl.appendChild(dropZoneEl);
        }

        containerEl.appendChild(itemEl);
    });
}

// 6. PAINEL DE PROPRIEDADES

function renderProperties(id) {
    const panel = document.getElementById('properties-panel');
    if (!id) {
        panel.innerHTML = '<p class="text-sm text-gray-500 italic text-center mt-10">Selecione um componente no canvas para editar.</p>';
        return;
    }

    const comp = findComponentById(components, id);
    if (!comp) return;

    let html = `<div class="mb-4 pb-2 border-b border-gray-100 font-bold text-gray-700">${componentConfig[comp.type].label}</div>`;

    // Input para o Tipo de Condição
    if (comp.type === 'condicional') {
        html += `
            <div class="flex flex-col gap-1 mb-3">
                <label class="text-xs font-bold text-gray-600 uppercase">Tipo de Condição</label>
                <select name="tipo" class="border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white">
                    <option value="if" ${comp.props.tipo === 'if' ? 'selected' : ''}>IF (Se)</option>
                    <option value="elseif" ${comp.props.tipo === 'elseif' ? 'selected' : ''}>ELSE IF (Senão Se)</option>
                    <option value="else" ${comp.props.tipo === 'else' ? 'selected' : ''}>ELSE (Senão)</option>
                </select>
            </div>
        `;
    }

    Object.keys(comp.props).forEach(key => {
        // esconde o tipo de condicional para selecionar no DropDown
        if (key === 'tipo' && comp.type === 'condicional') return;

        // Esconde o campo 'expressão' se for do tipo ELSE
        if (key === 'expressao' && comp.props.tipo === 'else') return;

        let label = key.charAt(0).toUpperCase() + key.slice(1);
        let helpText = '';

        if (key === 'var') { label = 'Nome da Variável (var)'; helpText = 'Identificador único.'; }
        if (key === 'depende') { label = 'Dependência Ajax'; helpText = 'ID do campo Ajax.'; }
        if (key === 'expressao') { label = 'Condição Lógica'; helpText = 'Ex: variavel == "valor"'; }
        if (key === 'Valor') { label = 'Valor'; helpText = 'Valor da variável'; }

        html += `
            <div class="flex flex-col gap-1 mb-3">
                <label class="text-xs font-bold text-gray-600 uppercase dark:text-gray-400">${label}</label>
                <input type="text" name="${key}" value="${comp.props[key]}" autocomplete="off"
                    class="border border-gray-300 rounded px-2 py-1.5 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    ${helpText ? `<span class="text-[10px] text-gray-400 dark:text-gray-600">${helpText}</span>` : ''}
            </div>
            `;
    });

    panel.innerHTML = html;

    // Listeners
    panel.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', (e) => {
            updateComponentProps(id, { [e.target.name]: e.target.value });
        });
    });
}


// 7. GERAÇÃO DE CÓDIGO FREEMARKER (RECURSIVA)

function updateCode() {
    let code = '[#-- Início da Entrevista --]\n[@entrevista]\n\n';
    code += generateListCode(components, 1);
    code += '\n[/@entrevista]\n';

    document.getElementById('code-output').innerHTML = code;

    // Salva o código no localStorage para compartilhar com outras páginas
    localStorage.setItem('sigadoc-freemarker-code', code);
    localStorage.setItem('sigadoc-code-source', 'visual');
}

// Sincroniza os códigos do editor visual e editor de código
window.addEventListener('storage', (e) => {
    if (e.key === 'sigadoc-freemarker-code' && e.newValue) {
        const source = localStorage.getItem('sigadoc-code-source');
        if (source === 'codepage') {
            document.getElementById('code-output').innerHTML = e.newValue;
        }
    }
});

function generateListCode(list, indentLevel) {
    let fm = '';
    const indent = '\t'.repeat(indentLevel);

    list.forEach(comp => {
        const config = componentConfig[comp.type];

        if (config.isContainer) {
            const childrenCode = generateListCode(comp.children, indentLevel + 1);
            const blockFM = config.generateFM(comp.props, childrenCode);
            fm += `${indent}${blockFM}\n`;
        } else {
            fm += `${indent}${colorizeMacro(config.generateFM(comp.props))}\n`;
        }
    });
    return fm;
}

function generateDocPreview(list) {
    let docHtml = '';
    function traverse(items) {
        items.forEach(c => {
            if (c.type === 'condicional') {
                docHtml += `[#${c.props.tipo} ${c.props.tipo !== 'else' ? c.props.expressao : ''}]\n`;
                if (c.children) traverse(c.children);
                if (c.props.tipo === 'if') docHtml += `[/#if]\n`;
            } else if (c.type !== 'grupo') {
                docHtml += `\t<p><b>${c.props.titulo}:</b> \${${c.props.var}!}</p>\n`;
            } else {
                if (c.children) traverse(c.children);
            }
        });
    }
    traverse(list);
    return docHtml;
}

function colorizeMacro(text) {
    return text.replace(/(\[@\w+)/g, '<span>$1</span>')
        .replace(/(\[\/@\w+\])/g, '<span>$1</span>')
        .replace(/(\[#\w+)/g, '<span>$1</span>')
        .replace(/(\[\/#\w+\])/g, '<span>$1</span>')
        .replace(/(\s\w+=)/g, '<span>$1</span>')
        .replace(/(\".*?\")/g, '<span>$1</span>');
}

// 8. UTILITÁRIOS

function limparCanvas() {
    if (confirm("Limpar tudo?")) {
        components = [];
        selectedId = null;
        renderCanvas();
        renderProperties(null);
        updateCode();
        saveComponents();
    }
}

function copiarCodigo() {
    const text = document.getElementById('code-output').innerText;
    navigator.clipboard.writeText(text).then(() => alert("Copiado!"));
}

// Inicializa
loadComponents(); // Carrega componentes se existirem
renderCanvas();

// Verifica se o código foi editado manualmente no CodePage
const codeSource = localStorage.getItem('sigadoc-code-source');
if (codeSource === 'codepage') {
    // Sincroniza código do CodePage com componentes visuais
    syncCodeToComponents();
} else {
    // Regenera o código a partir dos componentes
    updateCode();
}