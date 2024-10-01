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
