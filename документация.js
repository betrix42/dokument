// Начальные примеры кода
const initialSnippets = [
    {
        id: 1,
        title: "Вывод текста в консоль",
        tag: "JS",
        code: "console.log('Hello, World!');",
        description: "Базовый вывод сообщения в консоль браузера."
    },
    {
        id: 2,
        title: "Вывод текста в консоль",
        tag: "PYTHON",
        code: "print('Hello, World!')",
        description: "Базовый вывод сообщения в консоль Python."
    },
    {
        id: 3,
        title: "Вывод текста в консоль",
        tag: "C++",
        code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}',
        description: "Базовый вывод в поток std::cout."
    },
];

// Документация DevDocs.io
const devDocsArticles = [
    {
        id: 'devdocs-js',
        title: 'JavaScript — Справочник MDN',
        tag: 'JS',
        description: 'Официальная документация: синтаксис, функции, DOM, async/await и Web API.',
        url: 'https://devdocs.io/javascript/'
    },
    {
        id: 'devdocs-cpp',
        title: 'C++ — Справочник по языку и STL',
        tag: 'C++',
        description: 'Полная документация по стандартам C++, контейнерам STL, указателям и алгоритмам.',
        url: 'https://devdocs.io/cpp/'
    },
    {
        id: 'devdocs-python',
        title: 'Python 3 — Документация',
        tag: 'PYTHON',
        description: 'Справочник по встроенным функциям, типам данных и стандартной библиотеке Python.',
        url: 'https://devdocs.io/python~3.12/'
    },
    {
        id: 'devdocs-ts',
        title: 'TypeScript — Руководство по типам',
        tag: 'TYPESCRIPT',
        description: 'Справочник по интерфейсам, дженерикам (Generics), типизации и компилятору TS.',
        url: 'https://devdocs.io/typescript/'
    },
    {
        id: 'devdocs-html',
        title: 'HTML5 — Элементы и атрибуты',
        tag: 'HTML',
        description: 'Полный перечень тегов HTML5, семантическая разметка и структура веб-страниц.',
        url: 'https://devdocs.io/html/'
    },
    {
        id: 'devdocs-css',
        title: 'CSS3 — Свойства, Flexbox и Grid',
        tag: 'CSS',
        description: 'Справочник по стилям, селекторам, Flexbox, CSS Grid Layout и анимациям.',
        url: 'https://devdocs.io/css/'
    }
    {
        id: 'devdocs-YouTube',
        title: 'YouTube — для отдыха и рагрузки мозга',
        tag: 'YouTube',
        description: 'Отдохни',
        url: 'https://www.youtube.com/'
    }
];

// Получение элементов DOM
const container = document.getElementById('snippetsContainer');
const searchInput = document.getElementById('searchInput');
const tabButtons = document.getElementById('tabButtons');
const addForm = document.getElementById('addForm');

// Загрузка сохранённых данных из localStorage
let snippets = JSON.parse(localStorage.getItem('my_vault_snippets')) || initialSnippets;
let currentActiveLang = 'ALL';

// Сохранение в localStorage
function saveToStorage() {
    localStorage.setItem('my_vault_snippets', JSON.stringify(snippets));
}

// Загрузка DevDocs
function loadDevDocs() {
    devDocsArticles.forEach(article => {
        if (!snippets.some(s => s.id === article.id)) {
            snippets.push(article);
        }
    });
}

// Отрисовка карточек
function renderSnippets(data) {
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = `<p style="color: #94a3b8; text-align: center; grid-column: 1/-1;">Ничего не найдено...</p>`;
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const actionButton = item.url 
            ? `<a href="${item.url}" target="_blank" class="card-btn link-btn">📖 Открыть в DevDocs</a>`
            : `<button class="card-btn copy-btn" onclick="copyCode(this)">📋 Скопировать код</button>`;

        card.innerHTML = `
            <div class="card-header">
                <h3>${item.title}</h3>
                <span class="tag">${item.tag}</span>
            </div>
            <p>${item.description}</p>
            ${item.code ? `<pre><code>${escapeHtml(item.code)}</code></pre>` : ''}
            ${actionButton}
        `;

        container.appendChild(card);
    });
}

// Фильтрация и поиск
function filterSnippets() {
    const query = searchInput.value.toLowerCase().trim();

    const filtered = snippets.filter(item => {
        const matchesLang = (currentActiveLang === 'ALL') || (item.tag.toUpperCase() === currentActiveLang.toUpperCase());
        const matchesSearch = item.title.toLowerCase().includes(query) || 
                              item.description.toLowerCase().includes(query) ||
                              (item.code && item.code.toLowerCase().includes(query));

        return matchesLang && matchesSearch;
    });

    renderSnippets(filtered);
}

// Экранирование HTML
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Копирование кода
function copyCode(btn) {
    const codeText = btn.parentElement.querySelector('code').innerText;
    navigator.clipboard.writeText(codeText).then(() => {
        const originalText = btn.innerText;
        btn.innerText = '✅ Скопировано!';
        setTimeout(() => btn.innerText = originalText, 2000);
    });
}

// Обработчик формы
addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newSnippet = {
        id: Date.now(),
        title: document.getElementById('newTitle').value,
        tag: document.getElementById('newLang').value,
        description: document.getElementById('newDesc').value,
        code: document.getElementById('newCode').value
    };

    snippets.unshift(newSnippet);
    saveToStorage();
    filterSnippets();
    addForm.reset();
});

// Обработчик вкладок
tabButtons.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-btn')) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        currentActiveLang = e.target.getAttribute('data-lang');
        filterSnippets();
    }
});

// Поиск по вводу
searchInput.addEventListener('input', filterSnippets);

// Инициализация
loadDevDocs();
filterSnippets();
