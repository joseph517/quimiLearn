export default function header() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
        const navMenu = document.querySelector('.nav-menu');

        // Toggle del menú
        hamburgerBtn.addEventListener('click', () => {
            console.log('click');
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un enlace (opcional)
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Cerrar menú al hacer click fuera (opcional)
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
}