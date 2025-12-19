
import { state, setComponents, saveComponents, setSelectedId } from './state.js';
import { renderCanvas, renderProperties } from './render.js';
import { updateCode } from './generator.js';

export function limparCanvas() {
    if (confirm("Limpar tudo?")) {
        setComponents([]);
        setSelectedId(null);
        renderCanvas();
        renderProperties(null);
        updateCode();
        saveComponents();
    }
}

export function copiarCodigo() {
    const text = document.getElementById('code-output').innerText;
    navigator.clipboard.writeText(text).then(() => alert("Copiado!"));
}