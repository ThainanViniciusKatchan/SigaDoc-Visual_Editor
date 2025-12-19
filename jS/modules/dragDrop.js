
import { addComponent, moveComponent } from './crud.js';

export function initDragDrop() {
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
    // We attach them to window because they may be used in ondrop="" attributes or strictly needed global
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
}
