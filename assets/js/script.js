document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');
    const links = document.querySelectorAll('.nav-link-toggle');

    function activateSection(hash) {
        const target = hash ? hash.substring(1) : 'home'; // Define 'home' como padrão
        const targetSection = document.getElementById(target);

        sections.forEach(section => {
            section.classList.remove('active'); // Remove 'active' de todas as seções
            section.style.left = '-100%'; // Move todas as seções para fora
        });

        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.left = '0'; // Move a seção selecionada para dentro da tela
        }

        // Verifica se estamos na seção "home" para controlar a posição da nav-bar
        const navBar = document.querySelector('.nav-bar');
        if (target === 'home') {
            navBar.classList.remove('fixed');
        } else {
            navBar.classList.add('fixed');
        }
    }

    // Inicializa na seção correta se houver hash
    activateSection(window.location.hash);

    // Atualiza a seção quando o hash muda
    window.addEventListener('hashchange', function () {
        activateSection(window.location.hash);
    });

    // Atualiza o hash ao clicar nos links
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            window.location.hash = target;
        });
    });
});

require('dotenv').config();

const token = process.env.GITHUB_TOKEN;

async function fetchAllPublicRepos() {
    const username = 'matheusbatista103';
    const url = `https://api.github.com/users/${username}/repos`;
    const headers = {
        Authorization: `token ${token}`
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
        }
        const repos = await response.json();
        return repos;
    } catch (error) {
        console.error(error);
    }
}

async function getTotalCommits() {
    const repos = await fetchAllPublicRepos();
    if (!repos) return 0;
    let totalCommits = 0;

    for (const repo of repos) {
        const commitsUrl = `https://api.github.com/repos/${repo.full_name}/commits`;
        const headers = {
            Authorization: `token ${token}`
        };

        try {
            const response = await fetch(commitsUrl, { headers });
            if (!response.ok) {
                throw new Error(`Failed to fetch commits for repo ${repo.name}: ${response.status} ${response.statusText}`);
            }
            const commits = await response.json();
            totalCommits += commits.length; // Soma o número de commits
        } catch (error) {
            console.error(error);
        }
    }

    return totalCommits; // Retorna o total de commits
}

// Atualiza o card com o total de commits
async function updateCommitCard() {
    const commitCount = await getTotalCommits();
    const commitCountElement = document.getElementById('commit-count');
    commitCountElement.textContent = commitCount !== 0 ? commitCount : 'Erro ao carregar'; // Atualiza o elemento
}

// Chama a função para atualizar o card ao carregar a página
updateCommitCard();

