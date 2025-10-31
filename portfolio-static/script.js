
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const desktopMenu = document.getElementById('desktop-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOpenIcon = document.getElementById('menu-open-icon');
    const menuCloseIcon = document.getElementById('menu-close-icon');

    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuOpenIcon.classList.toggle('hidden');
        menuCloseIcon.classList.toggle('hidden');
    });

    // Smooth scroll
    document.querySelectorAll('button[data-section]').forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    menuOpenIcon.classList.remove('hidden');
                    menuCloseIcon.classList.add('hidden');
                }
            }
        });
    });

    // Scrollspy
    const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
    const navButtons = document.querySelectorAll('#desktop-menu button');

    window.addEventListener('scroll', () => {
        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('bg-gray-900/95', 'backdrop-blur-md', 'shadow-lg', 'shadow-cyan-500/10');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-gray-900/95', 'backdrop-blur-md', 'shadow-lg', 'shadow-cyan-500/10');
            navbar.classList.add('bg-transparent');
        }

        // Active section highlighting
        let current = '';
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    current = sectionId;
                }
            }
        });

        navButtons.forEach(button => {
            const sectionId = button.getAttribute('data-section');
            if (sectionId === current) {
                button.classList.add('bg-[#888888]/20', 'text-white');
                button.classList.remove('text-[#E0E0E0]', 'hover:text-white', 'hover:bg-gray-800/50');
            } else {
                button.classList.remove('bg-[#888888]/20', 'text-white');
                button.classList.add('text-[#E0E0E0]', 'hover:text-white', 'hover:bg-gray-800/50');
            }
        });
    });
});
