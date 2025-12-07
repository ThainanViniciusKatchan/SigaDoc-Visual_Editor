const codeOutput = document.getElementById('code-output');
const lineNumbers = document.getElementById('line-numbers');
const lineCountDisplay = document.getElementById('line-count');

// Atualiza os números de linha
function atualizarNumerosLinha() {
    const texto = codeOutput.value || '';
    const linhas = texto.split('\n');
    const totalLinhas = linhas.length;

    // Gera os números de linha
    let numerosHtml = '';
    for (let i = 1; i <= totalLinhas; i++) {
        numerosHtml += i + '\n';
    }
    lineNumbers.innerText = numerosHtml.trim();

    // Atualiza contador no header
    lineCountDisplay.textContent = `Linhas: ${totalLinhas}`;
}

// Sincroniza o scroll do textarea com os números de linha
codeOutput.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeOutput.scrollTop;
});

// Carrega o código salvo no localStorage
function carregarCodigo() {
    const codigo = localStorage.getItem('sigadoc-freemarker-code');

    if (codigo) {
        // Remove tags HTML e decodifica entidades
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = codigo;
        codeOutput.value = tempDiv.textContent || tempDiv.innerText || '';
    } else {
        codeOutput.value = 'Nenhum código gerado ainda.\nCrie componentes no Editor Visual primeiro.';
    }

    atualizarNumerosLinha();
}

// Atualiza números quando o usuário digita e salva no localStorage
codeOutput.addEventListener('input', () => {
    atualizarNumerosLinha();

    // Salva o código editado no localStorage para sincronizar com o editor visual
    localStorage.setItem('sigadoc-freemarker-code', codeOutput.value);
    localStorage.setItem('sigadoc-code-source', 'codepage'); // Marca quem editou por último
});

// Escuta mudanças no localStorage de outras abas (sincronização em tempo real)
window.addEventListener('storage', (e) => {
    if (e.key === 'sigadoc-freemarker-code' && e.newValue) {
        // Só atualiza se a mudança veio de outra página
        const source = localStorage.getItem('sigadoc-code-source');
        if (source !== 'codepage') {
            codeOutput.value = e.newValue;
            atualizarNumerosLinha();
        }
    }
});

// Função para copiar código
function copiarCodigo() {
    const text = codeOutput.value;
    navigator.clipboard.writeText(text).then(() => alert("Código copiado!"));
}

// Atualiza o código a cada 1 segundo (fallback para mesma aba)
setInterval(() => {
    const source = localStorage.getItem('sigadoc-code-source');
    // Só recarrega se a última edição foi do editor visual
    if (source !== 'codepage') {
        carregarCodigo();
    }
}, 1000);

// Carrega ao abrir a página
carregarCodigo();