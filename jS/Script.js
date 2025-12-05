lucide.createIcons();

// CONFIGURAÇÃO DOS COMPONENTES
const componentConfig = {
    condicional: {
        label: 'Condição (If/Else)',
        icon: 'git-branch', // Ícone de ramificação
        isContainer: true,  // Permite arrastar itens para dentro
        defaultProps: { titulo: 'Bloco Lógico', tipo: 'if', expressao: 'variavel == "valor"' },
        renderPreview: (props) => {
            let colorClass = props.tipo === 'else' ? 'text-orange-600' : 'text-blue-600';
            let labelTipo = props.tipo.toUpperCase();
            let desc = props.tipo === 'else' ? '(Senão)' : `(${props.expressao})`;
            return `
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-bold px-2 py-1 rounded bg-gray-200 ${colorClass}">${labelTipo}</span>
                    <span class="text-sm font-medium text-gray-700 truncate">${desc}</span>
                </div>
                <div class="text-[10px] text-gray-400">Arraste o conteúdo para dentro</div>
            `;
        },
        generateFM: (props, childrenCode) => {
            // Lógica de Geração do FreeMarker
            const expr = props.expressao ? ` ${props.expressao}` : '';

            if (props.tipo === 'if') {
                // Se for IF, abre e fecha o bloco
                return `[#if${expr}]\n${childrenCode}\n\t[/#if]`;
            } else if (props.tipo === 'elseif') {
                // Elseif apenas injeta a tag, o fechamento depende do IF pai
                return `[#elseif${expr}]\n${childrenCode}`;
            } else {
                // Else não tem expressão e não fecha tag própria
                return `[#else]\n${childrenCode}`;
            }
        }
    },
    grupo: {
        label: 'Grupo',
        icon: 'box',
        // "children" será o array que conterá os itens aninhados
        isContainer: true,
        defaultProps: { titulo: 'Título do Grupo', depende: '' },
        renderPreview: (props) => `<div class="font-bold text-gray-700 mb-2">${props.titulo}</div><div class="text-xs text-gray-400">${props.depende ? 'Depende de: ' + props.depende : ''}</div>`,
        // O generateFM recebe "childrenCode" que é o código já processado dos filhos
        generateFM: (props, childrenCode) => {
            let attr = `titulo="${props.titulo}"`;
            if (props.depende) attr += ` depende="${props.depende}"`;
            return `[@grupo ${attr}]\n${childrenCode}\t[/@grupo]`;
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
        defaultProps: { titulo: 'Campo Texto', var: 'txt_var', largura: '', maxcaracteres: '' },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><input type="text" disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="\${${props.var}}">`,
        generateFM: (props) => `[@texto titulo="${props.titulo}" var="${props.var}" largura="${props.largura}" maxcaracteres="${props.maxcaracteres}" /]`
    },
    numero: {
        label: 'Campo Número',
        icon: 'binary',
        defaultProps: { titulo: 'Campo numero', var: 'number_var', largura: '', maxcaracteres: '' },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><input type="text" disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="\${${props.var}}">`,
        generateFM: (props) => `[@numero titulo="${props.titulo}" var="${props.var}" largura="${props.largura}" maxcaracteres="${props.maxcaracteres}" /]`
    },
    editor: {
        label: 'Campo Editor',
        icon: 'text-initial',
        defaultProps: { titulo: 'Editor', var: 'editor_var' },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><textarea disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 h-16"></textarea>`,
        generateFM: (props) => `[@editor titulo="${props.titulo}" var="${props.var}" /]`
    },
    memo: {
        label: 'Campo Texto Longo',
        icon: 'align-left',
        defaultProps: { titulo: 'Observações', var: 'memo_var', linhas: '3', colunas: '60' },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><textarea disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50 h-16"></textarea>`,
        generateFM: (props) => `[@memo titulo="${props.titulo}" var="${props.var}" linhas="${props.linhas}" colunas="${props.colunas}" /]`
    },
    data: {
        label: 'Data',
        icon: 'calendar',
        defaultProps: { titulo: 'Data', var: 'dt_var' },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><div class="relative"><input type="text" disabled class="w-32 border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="__/__/____"><i data-lucide="calendar" class="absolute right-2 top-1.5 w-4 h-4 text-gray-400"></i></div>`,
        generateFM: (props) => `[@data titulo="${props.titulo}" var="${props.var}" /]`
    },
    horaMinuto: {
        label: 'Hora Minuto',
        icon: 'clock',
        defaultProps: { titulo: 'Hora Minuto', var: 'hr_var' },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><div class="relative"><input type="text" disabled class="w-32 border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="__:__"><i data-lucide="clock" class="absolute right-2 top-1.5 w-4 h-4 text-gray-400"></i></div>`,
        generateFM: (props) => `[@horaMinuto titulo="${props.titulo}" var="${props.var}" /]`
    },
    selecao: {
        label: 'Seleção',
        icon: 'list',
        defaultProps: { titulo: 'Selecione', var: 'sel_var', opcoes: 'A;B;C', idAjax: 'Idêntificador do Ajax', reler: true },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><select disabled class="w-full border border-gray-300 rounded px-2 py-1 bg-gray-50"><option>Selecione...</option></select>`,
        generateFM: (props) => `[@selecao titulo="${props.titulo}" var="${props.var}" opcoes="${props.opcoes}" idAjax="${props.idAjax}" reler="${props.reler}" /]`
    },
    checkbox: {
        label: 'Checkbox',
        icon: 'check-square',
        defaultProps: { titulo: 'Confirmação', var: 'chk_var', reler: "" },
        renderPreview: (props) => `<div class="flex items-center gap-2 mt-2"><input type="checkbox" disabled><label class="text-sm font-bold text-gray-700">${props.titulo}</label></div>`,
        generateFM: (props) => `[@checkbox titulo="${props.titulo}" var="${props.var}" reler="${props.reler}" /]`
    },
    pessoa: {
        label: 'Pesquisa de Pessoa',
        icon: 'user',
        defaultProps: { titulo: 'Servidor', var: 'p_servidor' },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><div class="flex gap-1"><input type="text" disabled class="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="Matrícula/Nome"><button disabled class="px-2 bg-gray-200 rounded">...</button></div>`,
        generateFM: (props) => `[@pessoa titulo="${props.titulo}" var="${props.var}" /]`
    },
    lotacao: {
        label: 'Pesquisa de Lotação',
        icon: 'building',
        defaultProps: { titulo: 'Unidade', var: 'l_unidade' },
        renderPreview: (props) => `<label class="block text-sm font-bold text-gray-700">${props.titulo}:</label><div class="flex gap-1"><input type="text" disabled class="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-50" placeholder="Sigla/Nome"><button disabled class="px-2 bg-gray-200 rounded">...</button></div>`,
        generateFM: (props) => `[@lotacao titulo="${props.titulo}" var="${props.var}" /]`
    }
};

// 2. ESTADO (ÁRVORE DE COMPONENTES)
let components = [];
let selectedId = null;
let draggedItemId = null; // Para reordenação

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
}

function updateComponentProps(id, newProps) {
    const comp = findComponentById(components, id);
    if (comp) {
        comp.props = { ...comp.props, ...newProps };
        renderCanvas(); // Atualiza visual (ex: título mudou)
        updateCode();   // Atualiza código gerado
        if (newProps.tipo) renderProperties(id);
        updateCode();
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
            dropZoneEl.className = 'drop-zone mt-4 border border-dashed border-gray-300 rounded bg-white p-4';
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

    // Input especial para o Tipo de Condição (Select)
    if (comp.type === 'condicional') {
        html += `
            <div class="flex flex-col gap-1 mb-3">
                <label class="text-xs font-bold text-gray-600 uppercase">Tipo de Condição</label>
                <select name="tipo" class="border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="if" ${comp.props.tipo === 'if' ? 'selected' : ''}>IF (Se)</option>
                    <option value="elseif" ${comp.props.tipo === 'elseif' ? 'selected' : ''}>ELSE IF (Senão Se)</option>
                    <option value="else" ${comp.props.tipo === 'else' ? 'selected' : ''}>ELSE (Senão)</option>
                </select>
            </div>
        `;
    }

    Object.keys(comp.props).forEach(key => {
        // Pula 'tipo' pois já criamos o select acima
        if (key === 'tipo' && comp.type === 'condicional') return;

        // Esconde o campo 'expressão' se for do tipo ELSE
        if (key === 'expressao' && comp.props.tipo === 'else') return;

        let label = key.charAt(0).toUpperCase() + key.slice(1);
        let helpText = '';

        if (key === 'var') { label = 'Nome da Variável (var)'; helpText = 'Identificador único.'; }
        if (key === 'depende') { label = 'Dependência Ajax'; helpText = 'ID do campo Ajax.'; }
        if (key === 'expressao') { label = 'Condição Lógica'; helpText = 'Ex: variavel == "valor"'; }

        html += `
            <div class="flex flex-col gap-1 mb-3">
                <label class="text-xs font-bold text-gray-600 uppercase">${label}</label>
                <input type="text" name="${key}" value="${comp.props[key]}" 
                    class="border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                ${helpText ? `<span class="text-[10px] text-gray-400">${helpText}</span>` : ''}
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

    // Bloco documento
    code += '\n[#-- Bloco do Documento --]\n[@documento]\n';
    code += '\t<p>Conteúdo do documento...</p>\n';
    code += generateDocPreview(components);
    code += '[/@documento]';

    document.getElementById('code-output').innerHTML = code;
}

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
            // Se for condicional, mostramos a lógica no preview do documento também
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
        .replace(/(\[#\w+)/g, '<span>$1</span>') // Cor para lógica [#if]
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
    }
}

function copiarCodigo() {
    const text = document.getElementById('code-output').innerText;
    navigator.clipboard.writeText(text).then(() => alert("Copiado!"));
}

// Inicializa
updateCode();
renderCanvas();