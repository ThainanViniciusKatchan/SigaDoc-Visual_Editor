
import { loadComponents, syncCodeToComponents } from './modules/state.js';
import { renderCanvas } from './modules/render.js';
import { limparCanvas, copiarCodigo } from './modules/utils.js';
import { initDragDrop } from './modules/dragDrop.js';
import { updateCode } from './modules/generator.js';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Data
    loadComponents();

    // 2. Initial Render
    renderCanvas();
    updateCode(); // Ensure code view is synced

    // 3. Initialize Drag & Drop Handlers
    initDragDrop();

    // 4. Expose Global Functions for HTML Buttons (onclick="...")
    window.copiarCodigo = copiarCodigo;
    window.limparCanvas = limparCanvas;

    // 5. Check for CodePage Sync
    const codeSource = localStorage.getItem('sigadoc-code-source');
    if (codeSource === 'codepage') {
        syncCodeToComponents(renderCanvas);
    }
});