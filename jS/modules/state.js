
import { componentConfig } from './config.js'; // Needed for parsing

export const state = {
    components: [],
    selectedId: null,
    draggedItemId: null,
}

export function setComponents(newComponents) {
    state.components = newComponents;
}

export function setSelectedId(id) {
    state.selectedId = id;
}

export function setDraggedItemId(id) {
    state.draggedItemId = id;
}

// === Storage Logic ===

// Função para salvar componentes no localStorage
export function saveComponents() {
    localStorage.setItem('sigadoc-components', JSON.stringify(state.components));
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
export function loadComponents() {
    const saved = localStorage.getItem('sigadoc-components');
    if (saved) {
        try {
            state.components = JSON.parse(saved);
            return true;
        } catch (e) {
            console.error('Erro ao carregar componentes salvos:', e);
            state.components = [];
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
// NOTE: This function needs renderCanvas to be full effective, 
// usually we might want to return the data and let the caller render.
// But to keep it close to original logic, we will need to handle this.
// For now, let's export it and let the importer call render.
export function syncCodeToComponents(renderCallback) {
    const savedCode = localStorage.getItem('sigadoc-freemarker-code');
    if (!savedCode) return;

    const parsedComponents = parseCodeToComponents(savedCode);
    if (parsedComponents.length > 0) {
        state.components = parsedComponents;
        saveComponents();
        if (renderCallback) renderCallback();
    }

    // Exibe o código no painel
    const codeOutput = document.getElementById('code-output');
    if (codeOutput) codeOutput.innerHTML = savedCode;
}
