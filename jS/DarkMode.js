// Configuração do tailwind para o dark mode
tailwind.config = {
    darkMode: 'class',
}

// Aplicar tema ao carregar a página
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Função para aplicar o tema baseado na preferência salva ou do sistema
function applyTheme() {
    const isDark = localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', isDark);
    updateThemeIcon(isDark);
}

// Atualiza o ícone do botão de tema
function updateThemeIcon(isDark) {
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    if (sunIcon && moonIcon) {
        if (isDark) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }
}

// Alterna entre modo claro e escuro
function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');

    if (isDark) {
        localStorage.theme = 'light';
        document.documentElement.classList.remove('dark');
    } else {
        localStorage.theme = 'dark';
        document.documentElement.classList.add('dark');
    }

    updateThemeIcon(!isDark);
}

// Aplicar tema ao carregar a página
applyTheme();

// Escutar mudanças na preferência do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!('theme' in localStorage)) {
        document.documentElement.classList.toggle('dark', e.matches);
        updateThemeIcon(e.matches);
    }
});