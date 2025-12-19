
import { componentConfig } from './config.js';
import { state, saveComponents, setSelectedId } from './state.js';
import { renderCanvas, renderProperties } from './render.js';
import { updateCode } from './generator.js';

export function addComponent(type, parentId) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const config = componentConfig[type];

    // Clona propriedades padrão
    const props = JSON.parse(JSON.stringify(config.defaultProps));

    // Ajuste inteligente para componentes dentro de Input Dinâmico (loopinput)
    if (parentId) {
        const parent = findComponentById(state.components, parentId);
        if (parent && parent.type === 'loopinput') {
            if (props.titulo) {
                props.titulo = '${i}º ' + props.titulo;
            }
            if (props.var) {
                props.var = props.var + '${i}';
            }
        }
    }

    // Garante unicidade da variável
    if (props.var && checkVarExists(props.var, state.components)) {
        props.var = props.var + '_' + Math.floor(Math.random() * 100);
    }

    const newComponent = { id, type, props, children: [] };

    if (parentId) {
        const parent = findComponentById(state.components, parentId);
        if (parent && parent.children) {
            parent.children.push(newComponent);
        }
    } else {
        state.components.push(newComponent);
    }

    renderCanvas();
    selectComponent(id);
    updateCode();
    saveComponents();
}

export function deleteComponent(id) {
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

    removeRecursive(state.components, id);

    if (state.selectedId === id) {
        selectComponent(null);
    }
    renderCanvas();
    updateCode();
    saveComponents();
}

export function updateComponentProps(id, newProps) {
    const comp = findComponentById(state.components, id);
    if (comp) {
        comp.props = { ...comp.props, ...newProps };
        renderCanvas();
        updateCode();
        if (newProps.tipo) renderProperties(id);
        updateCode();
        saveComponents();
    }
}

export function moveComponent(componentId, targetParentId, targetIndex) {
    const component = findComponentById(state.components, componentId);
    if (!component) return;

    if (componentId === targetParentId) return;
    if (isDescendant(component, targetParentId)) return;

    removeComponentById(state.components, componentId);

    if (targetParentId) {
        const targetParent = findComponentById(state.components, targetParentId);
        if (targetParent && targetParent.children) {
            if (targetIndex !== null) {
                targetParent.children.splice(targetIndex, 0, component);
            } else {
                targetParent.children.push(component);
            }
        }
    } else {
        if (targetIndex !== null) {
            state.components.splice(targetIndex, 0, component);
        } else {
            state.components.push(component);
        }
    }

    renderCanvas();
    updateCode();
    saveComponents();
}

export function reorderComponent(draggedId, targetId, position) {
    const draggedComp = findComponentById(state.components, draggedId);
    const targetComp = findComponentById(state.components, targetId);

    if (!draggedComp || !targetComp) return;

    const draggedParentInfo = findParentById(state.components, draggedId);
    const targetParentInfo = findParentById(state.components, targetId);

    if (draggedParentInfo.parentId !== targetParentInfo.parentId) {
        moveComponent(draggedId, targetParentInfo.parentId, null);
        return;
    }

    const parentList = draggedParentInfo.parentId ?
        findComponentById(state.components, draggedParentInfo.parentId).children :
        state.components;

    const draggedIndex = parentList.findIndex(c => c.id === draggedId);
    if (draggedIndex === -1) return;

    parentList.splice(draggedIndex, 1);

    const targetIndex = parentList.findIndex(c => c.id === targetId);
    if (targetIndex === -1) return;

    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
    parentList.splice(insertIndex, 0, draggedComp);

    renderCanvas();
    updateCode();
    saveComponents();
}

export function selectComponent(id) {
    setSelectedId(id);
    document.querySelectorAll('.canvas-item').forEach(el => el.classList.remove('selected'));
    const el = document.getElementById('comp-' + id);
    if (el) el.classList.add('selected');

    renderProperties(id);
}

// === Helpers ===

function isDescendant(parent, childId) {
    if (!parent.children) return false;

    for (let child of parent.children) {
        if (child.id === childId) return true;
        if (isDescendant(child, childId)) return true;
    }
    return false;
}

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

export function findComponentById(list, id) {
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
