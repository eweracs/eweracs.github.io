class App {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'en';
        this.currentPage = 'home';
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.translations = {};
        this.pages = {};
        this.clients = [];
        this.lastScrollTop = 0;

        this.init();
    }

    async init() {
        await this.loadTranslations();
        await this.loadPages();
        await this.loadClients();
        this.initTheme();
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.updateLanguage();
        this.navigateTo(this.getPageFromURL());
        this.hideLoading();
    }

    initTheme() {
        // Set theme based on stored preference or system preference
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme) {
            this.currentTheme = storedTheme;
        } else if (systemPrefersDark) {
            this.currentTheme = 'dark';
        }

        this.applyTheme();
    }

    applyTheme() {
        if (this.currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        localStorage.setItem('theme', this.currentTheme);
    }

    // Toggle theme
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    setupScrollBehavior() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const header = document.querySelector('header');
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Use different threshold based on screen width
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const threshold = isMobile ? 20 : 100;

        if (currentScrollTop > threshold) {
            header.classList.add('faded');
        } else {
            header.classList.remove('faded');
        }

        this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }

    async loadTranslations() {
        try {
            const response = await fetch('/assets/data/translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    async loadPages() {
        try {
            const response = await fetch('/assets/data/pages.json');
            this.pages = await response.json();
        } catch (error) {
            console.error('Failed to load pages:', error);
        }
    }

    async loadClients() {
        try {
            const response = await fetch('/assets/data/clients.json');
            this.clients = await response.json();
        } catch (error) {
            console.error('Failed to load clients:', error);
        }
    }

    setupEventListeners() {
        // Navigation links - ONLY target elements with data-page attribute
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateTo(page);
            });
        });


        // Language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });

        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                this.toggleTheme();
            });
        }


        // Browser back/forward
        window.addEventListener('popstate', (e) => {
            this.navigateTo(e.state?.page || 'home', false);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });


    }

    navigateTo(page, pushState = true) {
        if (!this.pages[page]) page = 'home';

        this.currentPage = page;

        // Update URL - preserve query parameters for download page
        if (pushState) {
            let url = page === 'home' ? '/' : `/${page}`;

            // Preserve query parameters for download page
            if (page === 'download' && window.location.search) {
                url += window.location.search;
            }

            history.pushState({page}, '', url);
        }

        // Update navigation - only target navigation links with data-page attribute
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            const shouldBeActive = link.dataset.page === page && page !== 'download';
            link.classList.toggle('active', shouldBeActive);
        });

        // Load page content
        this.loadPageContent(page);

        // Update page title
        this.updatePageTitle(page);
    }

    loadPageContent(page) {
        const app = document.getElementById('app');
        const pageData = this.pages[page];

        if (!pageData) {
            app.innerHTML = '<div class="error">Page not found</div>';
            return;
        }

        let content = pageData.template || '';

        // Replace placeholders with translated content
        const pageContent = this.translations[this.currentLang]?.pages?.[page] || {};

        Object.keys(pageContent).forEach(key => {
            if (key !== 'services') {
                const placeholder = `{{${key}}}`;
                content = content.replace(new RegExp(placeholder, 'g'), pageContent[key]);
            }
        });

        app.innerHTML = content;

        // Trigger any page-specific JavaScript
        this.initPageScripts(page);
    }

    initPageScripts(page) {
        this.setSpacerHeight();

        // Page-specific initialization
        if (page === 'projects') {
            this.initProjectsPage();
        } else if (page === 'download') {
            this.initDownloadPage();
        } else if (page === 'expertise') {
            this.initExpertisePage();
        }

    }

    initDownloadPage() {
        // Initialize download functionality directly
        this.setupFileDownload();
    }

    setupFileDownload() {
        // Get the file ID and name from URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const fileId = urlParams.get('id');
        const fileName = urlParams.get('name') || 'Download File';

        const fileNameElement = document.getElementById('file-name');
        const downloadButton = document.getElementById('download-button');
        const errorMessage = document.getElementById('error-message');

        // If no file ID is provided, show an error
        if (!fileId) {
            if (fileNameElement) fileNameElement.textContent = 'File Download';
            if (downloadButton) downloadButton.style.display = 'none';
            if (errorMessage) errorMessage.textContent = 'No file ID provided.';
            return;
        }

        // Direct Google Drive download link
        const driveDownloadLink = `https://drive.google.com/uc?id=${fileId}&export=download`;

        // Set file name
        if (fileNameElement) fileNameElement.textContent = fileName;

        if (downloadButton) {
            downloadButton.href = driveDownloadLink;
            downloadButton.style.display = 'inline-block';
        }
    }

    initExpertisePage() {
        // Load services list
        const servicesList = document.getElementById('services-list');
        const services = this.translations[this.currentLang]?.pages?.expertise?.services || [];

        if (servicesList && services.length) {
            servicesList.innerHTML = services
                .map(service => `<li>${service}</li>`)
                .join('');
        } else {
            console.log('Services list element not found or no services data');
        }
    }


    initProjectsPage() {
        if (!this.clients.length) {
            console.log('No clients data available');
            return;
        }

        this.renderTableOfContents();
        this.renderProjectsList();
        this.setupScrollObserver();
    }

    renderTableOfContents() {
        const tocList = document.getElementById('toc-list');
        if (!tocList) return;

        // Only show clients that have projects
        //const clientsWithProjects = this.clients.filter(client => client.projects && client.projects.length > 0);
        const sortedClients = [...this.clients].sort((a, b) => a.name.localeCompare(b.name));

        const tocHTML = sortedClients
            .map(client => `
                <div class="toc-item" data-client="${client.name}">
                    <span class="toc-name">${client.name}</span>
                </div>
            `)
            .join('');

        tocList.innerHTML = tocHTML;
    }




    renderProjectsList() {
        const projectsList = document.getElementById('projects-list');
        if (!projectsList) return;

        const sortedClients = [...this.clients].sort((a, b) => a.name.localeCompare(b.name));

        const projectsHTML = sortedClients
            .map(client => {
                return `
                    <section class="client-section" data-client="${client.name}" id="client-${client.name.replace(/\s+/g, '-').toLowerCase()}">
                        <div class="client-header">
                            <a href="${client.url}" target="_blank" rel="noopener noreferrer" class="client-name-link">
                                <img src="${client.logo}" alt="${client.name}" class="client-icon">
                                <h2 class="client-name">${client.name}</h2>
                                <h2 class="client-name">→</h2>
                            </a>
                        </div>
                        <div class="projects-grid">
                            ${client.projects.map(project => {
                                const projectContent = `
                                    <div class="project-card">
                                        <h3 class="project-title">${project.name}</h3>
                                        <p class="project-description">${project.description}</p>
                                        <div class="project-meta">
                                            <span class="project-year">${project.year}</span>
                                            <div class="project-types">
                                                ${this.renderProjectTypes(project.type)}
                                            </div>
                                        </div>
                                    </div>
                                `;

                                // Only wrap in anchor tag if URL exists
                                if (project.url) {
                                    return `
                                        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-name-link">
                                            ${projectContent}
                                        </a>
                                    `;
                                } else {
                                    return projectContent;
                                }
                            }).join('')}
                        </div>
                    </section>
                `;
            })
            .join('');

        projectsList.innerHTML = projectsHTML;
    }


    renderProjectTypes(types) {
        // Handle both array and string cases
        const typeArray = Array.isArray(types) ? types : [types];

        return typeArray
            .map(type => `<span class="project-type-chip">${type}</span>`)
            .join('');
    }


    setupScrollObserver() {
        const tocItems = document.querySelectorAll('.toc-item');
        const clientSections = document.querySelectorAll('.client-section');

        if (!tocItems.length || !clientSections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const clientName = entry.target.dataset.client;

                    // Remove active class from all toc items
                    tocItems.forEach(item => item.classList.remove('active'));

                    // Add active class to current toc item
                    const activeTocItem = document.querySelector(`.toc-item[data-client="${clientName}"]`);
                    if (activeTocItem) {
                        activeTocItem.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '-10% 0px -90% 0px',
            threshold: 0
        });

        clientSections.forEach(section => {
            observer.observe(section);
        });

        // Add click handlers to TOC items for smooth scrolling
        tocItems.forEach(item => {
            item.addEventListener('click', () => {
                const clientName = item.dataset.client;
                const targetSection = document.querySelector(`.client-section[data-client="${clientName}"]`);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setSpacerHeight() {
        const nav = document.getElementById('nav');
        const spacer = document.getElementById('spacer');
        const header = document.querySelector('header');

        if (nav && spacer && !header.classList.contains('scrollable')) {
            spacer.style.height = nav.offsetHeight + 'px';
        }
    }

    setLanguage(lang) {
        if (!this.translations[lang]) return;

        this.currentLang = lang;
        localStorage.setItem('lang', lang);

        this.updateLanguage();
        this.loadPageContent(this.currentPage);
        this.updatePageTitle(this.currentPage);
    }

    updateLanguage() {
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });

        // Update elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update document language
        document.documentElement.lang = this.currentLang;
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    }

    updatePageTitle(page) {
        const pageTitle = this.getTranslation(`pages.${page}.title`) || 'Sebastian Carewe';
        document.title = `${pageTitle} – Sebastian Carewe`;
    }

    getPageFromURL() {
        const path = window.location.pathname.slice(1);
        return path || 'home';
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.style.display = 'none', 300);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});