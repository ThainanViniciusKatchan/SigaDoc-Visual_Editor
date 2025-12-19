
import { state } from './state.js';
import { componentConfig } from './config.js';

export function updateCode() {
    let code = '[#-- Início da Entrevista --]\n[@entrevista]\n\n';
    code += generateListCode(state.components, 1);
    code += '\n[/@entrevista]\n';

    const outputEl = document.getElementById('code-output');
    if (outputEl) outputEl.innerHTML = code;

    // Salva o código no localStorage para compartilhar com outras páginas
    localStorage.setItem('sigadoc-freemarker-code', code);
    localStorage.setItem('sigadoc-code-source', 'visual');
}

// Sincroniza os códigos do editor visual e editor de código
window.addEventListener('storage', (e) => {
    if (e.key === 'sigadoc-freemarker-code' && e.newValue) {
        const source = localStorage.getItem('sigadoc-code-source');
        if (source === 'codepage') {
            const outputEl = document.getElementById('code-output');
            if (outputEl) outputEl.innerHTML = e.newValue;
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

function colorizeMacro(text) {
    return text.replace(/(\[@\w+)/g, '<span>$1</span>')
        .replace(/(\[\/@\w+\])/g, '<span>$1</span>')
        .replace(/(\[#\w+)/g, '<span>$1</span>')
        .replace(/(\[\/#\w+\])/g, '<span>$1</span>')
        .replace(/(\s\w+=)/g, '<span>$1</span>')
        .replace(/(\".*?\")/g, '<span>$1</span>');
}
