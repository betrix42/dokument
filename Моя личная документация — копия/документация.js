const initialSnippets = [{
        id: 1,
        title: "Вывод сообщения",
        tag: "JS",
        code: "console.log('hello world)",
        description: "Вывод данных"
    },
    {
        id: 2,
        title: "Вывод сообщения",
        tag: "PYTHON",
        code: "Print('Hello world')",
        description: "Вывод данных"
    },
    {
        id: 3,
        title: "Вывод сообщения",
        tag: "C++",
        code: "std::cout << \"Привет, мир!\";",
        description: "Вывод данных"
    }
];
let snippets = JSON.parse(localStorage.getItem('my_vault_snippets')) || initialSnippets;
let currentActiveLang = 'ALL';

const container = document.getElementById('snippetsContainer');
const searchInput = document.getElementById('searchInput');
const tabButtons = document.querySelectorAll('.tab-btn');
const addForm = document.getElementById('addSnippetForm');

function saveToStorge() {
    localStorage.setItem('my_vault_snippets', JSON.stringify(snippets));
}

function renderSnippets(data) {
    container.innerHTML = '';
    if (data.length === 0) {
        container.inertHTML = `<p style="color: #94a3b8; text-align: center; grid-column: 1/-1">Здесь ничего нет</p>`;
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
        <div class="card-header">
            <h3>${item.title}</h3>
            <span class="tag">${item.tag}</span>
        </div>
        <p>${item.description}</p>
        <pre><code>${item.code}</code></pre>
        <button class="copy-btn" onclick="copyCode('${item.code}')">Копировать код</button>
        `;
        container.appendChild(card);
    });
}

function copyCode(btn) {
    const codeText = btn.parentElement.querySelector('code').innerText;
    navigator.clipboard.writeText(codeText);

    btn.textContent = 'Скопированно'
    setTimeout(() => {
        btn.textContent = 'Скопировать код';
    }, 1500);
}

function filterSnippets() {
    const searchText = searchInput.value.toLowerCase();

    const filtered = snippets.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchText) ||
            item.code.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText);
        const matchesTag = currentActiveLang === 'ALL' || item.tag.toUpperCase() === currentActiveLang.toUpperCase();
        return matchesSearch && matchesTag;
    });

    renderSnippets(filtered);
}

async function loadExternalDocumentation() {
    try {
        const response = await fetch('https://api.github.com/gists/pulic');
        const data = await response.json();

        const externalSnippets = data.map(item => ({
            id: item.id,
            title: item.description || 'Без названия',
            tag: 'GitHub',
            code: item.html_url,
            description: 'Публичный гист из общества'
        }));
        snippets = [...snippets, ...externalSnippets];
        filterSnippets();
    } catch (error) {
        console.error('Ошибка загрузки данных', error);
    }
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentActiveLang = btn.dataset.lang;
        filterSnippets();
    });
});

addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newSnippet = {
        id: Date.now(),
        title: document.getElementById('newTitle').value,
        tag: document.getElementById('newLang').value,
        code: document.getElementById('newCode').value,
        description: document.getElementById('newDesc').value
    };
    snippets.unshift(newSnippet);
    saveToStorge();
    filterSnippets();
    addForm.reset();
});

searchInput.addEventListener('input', filterSnippets);
filterSnippets();