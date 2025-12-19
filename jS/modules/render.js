
import { state, setDraggedItemId } from './state.js';
import { componentConfig } from './config.js';
import { deleteComponent, selectComponent, reorderComponent, moveComponent, updateComponentProps } from './crud.js';

// 5. RENDERIZAÇÃO (VISUAL)
export function renderCanvas() {
    const rootEl = document.getElementById('canvas-root-container');
    const emptyEl = document.getElementById('empty-state');

    if (state.components.length === 0) {
        emptyEl.classList.remove('hidden');
        rootEl.innerHTML = '';
        return;
    }
    emptyEl.classList.add('hidden');

    // Limpa e reconstrói a árvore
    rootEl.innerHTML = '';
    renderComponentList(state.components, rootEl, null);

    if (window.lucide) lucide.createIcons();
}

// Exported handlers for drag events (used in innerHTML)
window.handleContainerDragOver = function (e, containerId) {
    e.preventDefault();
    e.stopPropagation();

    const containerEl = document.getElementById('comp-' + containerId);
    if (containerEl) {
        containerEl.classList.add('container-drag-over');
    }
}

window.handleContainerDragLeave = function (e, containerId) {
    const relatedTarget = e.relatedTarget;
    const containerEl = document.getElementById('comp-' + containerId);
    // Verifica se realmente saiu do container
    if (containerEl && (!relatedTarget || relatedTarget === containerEl || !containerEl.contains(relatedTarget))) {
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

    // We need to import addComponent, but avoiding cyclic dependency in top-level. 
    // We can use a dynamic import or assuming 'crud.js' exports are available if we are careful.
    // However, for cleaner code, we might move these global handlers to dragDrop.js entirely.
    // For now, let's dispatch an event or use the imported function (circular dependency warning).
    // The safest way here is to use the imported 'addComponent' from crud.

    // NOTE: This creates a circular dependency: main -> render -> crud -> render. 
    // ES Modules handle this fine for function hoisting.
    import('./crud.js').then(module => {
        if (source === 'palette' && type) {
            module.addComponent(type, containerId);
        } else if (source === 'canvas' && draggedId) {
            module.moveComponent(draggedId, containerId, null);
        }
    });
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

        itemEl.className = `canvas-item p-4 rounded-md cursor-pointer group relative border transition-all ${borderClass} ${bgClass} ${state.selectedId === comp.id ? 'selected' : ''}`;

        // Tornar o item arrastável
        itemEl.draggable = true;
        itemEl.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            setDraggedItemId(comp.id);
            e.dataTransfer.setData('itemId', comp.id);
            e.dataTransfer.setData('source', 'canvas');
            e.dataTransfer.effectAllowed = 'move';
            itemEl.classList.add('opacity-50');
        });

        itemEl.addEventListener('dragend', (e) => {
            itemEl.classList.remove('opacity-50');
            setDraggedItemId(null);
        });

        // Criar zonas de reordenação APENAS para elementos NÃO-CONTAINERS
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
                    document.querySelectorAll('.canvas-item').forEach(el => {
                        el.classList.remove('reorder-before', 'reorder-after');
                    });
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
                    document.querySelectorAll('.canvas-item').forEach(el => {
                        el.classList.remove('reorder-before', 'reorder-after');
                    });
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

        // Evento de clique para seleção
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

            // Adicionar drag over no container inteiro
            itemEl.addEventListener('dragover', (e) => {
                const target = e.target;
                const isReorderZone = target.classList.contains('reorder-drop-zone');
                const isDropZone = target.classList.contains('drop-zone');

                if (!isReorderZone && !isDropZone) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.handleContainerDragOver) window.handleContainerDragOver(e, comp.id);
                }
            });

            itemEl.addEventListener('dragleave', (e) => {
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || relatedTarget === itemEl || !itemEl.contains(relatedTarget)) {
                    if (window.handleContainerDragLeave) window.handleContainerDragLeave(e, comp.id);
                }
            });

            itemEl.addEventListener('drop', (e) => {
                const target = e.target;
                const isDropZone = target.classList.contains('drop-zone');
                const isReorderZone = target.classList.contains('reorder-drop-zone');

                if (!isDropZone && !isReorderZone) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.handleContainerDrop) window.handleContainerDrop(e, comp.id);
                }
            });

            const dropZoneEl = document.createElement('div');
            dropZoneEl.className = 'drop-zone mt-4 border border-dashed border-gray-300 rounded bg-white p-4 dark:bg-gray-700 dark:text-white';
            dropZoneEl.style.minHeight = '60px';

            dropZoneEl.setAttribute('ondragover', 'handleDragOver(event)');
            dropZoneEl.setAttribute('ondragleave', 'handleDragLeave(event)');
            // Using global handlers for drag drop on HTML attributes requires them to be on window
            // In main.js we attached them to window OR we could use addEventListener here which is cleaner.
            // But to preserve the original logic structure (which used attributes), we need global functions.
            // Let's rely on main.js exposing them or addEventListener here. 
            // Better: addEventListener here and remove attributes.

            // Clean approach:
            dropZoneEl.addEventListener('dragover', (e) => window.handleDragOver(e));
            dropZoneEl.addEventListener('dragleave', (e) => window.handleDragLeave(e));
            dropZoneEl.addEventListener('drop', (e) => window.handleDrop(e, comp.id));

            renderComponentList(comp.children, dropZoneEl, comp.id);

            if (comp.children.length === 0) {
                dropZoneEl.innerHTML = '<div class="text-center text-xs text-gray-400 py-2 pointer-events-none">Arraste itens para dentro deste grupo</div>';
            }

            itemEl.appendChild(dropZoneEl);
        }

        containerEl.appendChild(itemEl);
    });
}

//PAINEL DE PROPRIEDADES
export function renderProperties(id) {
    const panel = document.getElementById('properties-panel');
    if (!id) {
        panel.innerHTML = '<p class="text-sm text-gray-500 italic text-center mt-10">Selecione um componente no canvas para editar.</p>';
        return;
    }

    const comp = findComponentById(state.components, id);
    if (!comp) return;

    let html = `<div class="mb-4 pb-2 border-b border-gray-100 font-bold text-gray-700">${componentConfig[comp.type].label}</div>`;

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
        if (key === 'tipo' && comp.type === 'condicional') return;
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

    panel.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', (e) => {
            updateComponentProps(id, { [e.target.name]: e.target.value });
        });
    });
}

// Helpers duplicated here to avoid cyclic dependency issues with crud.js for simple reads,
// OR we can export them from utils and import here.
// For now, let's keep findComponentById local or import it if we move it to utils.
// Importing from crud.js is safe if crud.js exports them.
import { findComponentById } from './crud.js';
