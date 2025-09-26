class App {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'en';
        this.currentPage = 'home';
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
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.updateLanguage();
        this.navigateTo(this.getPageFromURL());
        this.hideLoading();
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

        if (currentScrollTop > 100) {
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
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
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

        // Browser back/forward
        window.addEventListener('popstate', (e) => {
            this.navigateTo(e.state?.page || 'home', false);
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

        // Update navigation - don't highlight download page in nav
        document.querySelectorAll('.nav-link').forEach(link => {
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
        // Set spacer height (from your original main.js)
        this.setSpacerHeight();

        // Page-specific initialization
        if (page === 'projects') {
            this.initProjectsPage();
        } else if (page === 'download') {
            this.initDownloadPage();
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

    initProjectsPage() {
        // Load services list
        const servicesList = document.getElementById('services-list');
        const services = this.translations[this.currentLang]?.pages?.projects?.services || [];

        if (servicesList && services.length) {
            servicesList.innerHTML = services
                .map(service => `<li>${service}</li>`)
                .join('');
        } else {
            console.log('Services list element not found or no services data');
        }

        // Load clients gallery
        const clientsGallery = document.getElementById('clients-gallery');

        if (clientsGallery && this.clients.length) {
            const galleryHTML = this.clients
                .map(client => {
                    return `
                        <div class="gallery-img">
                            <img src="${client.logo}" alt="${client.name}" class="clientimg" onerror="console.error('Failed to load image:', '${client.logo}')">
                            <a href="${client.url}" target="_blank" rel="noopener">
                                <div class="overlay">
                                    <div class="overlaytext">${client.name}</div>
                                </div>
                            </a>
                        </div>
                    `;
                })
                .join('');

            clientsGallery.innerHTML = galleryHTML;
        } else {
            console.log('Clients gallery element not found or no clients data');
        }
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