lucide.createIcons();

// CONFIGURAÇÃO DOS COMPONENTES
export const componentConfig = {
    // Componentes prontos
    DadosServidor: {
        label: 'Dados do Servidor',
        icon: 'people',
        isContainer: false,
        defaultProps: { Comentario: '' },
        renderPreview: (props, childrenCode) => `
        <div class="font-bold text-blue-700 dark:text-blue-500 mb-2">
        ${props.Comentario ? `[#--${props.Comentario}--]` : ''}
        </div>
        <p class="text-90 font-bold text-blue-700 dark:text-blue-500">[#--Input pronto que recebe automaticamente as informações do servidor--]</p>
        <div class="font-bold text-gray-700 dark:text-yellow-500 mb-2">Dados do Servidor<br>
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
