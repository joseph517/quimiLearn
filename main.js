// Imports
import loadElementList from './app/components/element-list/element-list.js'
import header from './app/components/header/header.js'
import experiments from './app/pages/experiments/experiments.js'

async function loadComponent(url, selector) {
    return new Promise((resolve, ) => {
        $(selector).load(url, () => {
            resolve();
        });
    })
}

async function loadHtmlComponents() {
    return new Promise(async resolve => {
        try {
            await Promise.all([
                loadComponent('./app/components/header/header.html', '#header'),
                loadComponent('./app/pages/home/home.html', '#home'),
                loadComponent('./app/pages/periodic-table/periodic-table.html', '#periodic-table'),
                loadComponent('./app/pages/about/about.html', '#about'),
                loadComponent('./app/pages/experiments/experiments.html', '#experiments'),
                loadComponent('./app/components/footer/footer.html', '#footer'),
                loadComponent('./app/pages/404/404.html', '#404')
            ]);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await Promise.all([
                loadComponent('./app/components/table/table.html', '#view-periodic-table'),
                loadComponent('./app/components/element-list/element-list.html', '#view-elements-list'),
                // loadComponent('./app/components/game-periodic-table/game-periodic-table.html', '#game-periodic-table')
            ]);
            hiddenLoader();
            resolve();
        } catch (error) {
            resolve();
        }
    });
}

// Paths
const routes = [{
        path: '/',
        id: 'home'
    },
    {
        path: '#/periodic-table/',
        id: 'periodic-table'
    },
    {
        path: '#/periodic-table/view-periodic-table',
        id: 'view-periodic-table',
        parent: 'periodic-table'
    },
    {
        path: '#/periodic-table/view-elements-list',
        id: 'view-elements-list',
        parent: 'periodic-table'
    },
    // {
    //     path: '#/periodic-table/game-periodic-table',
    //     id: 'game-periodic-table',
    //     parent: 'periodic-table'
    // },
    {
        path: '#/about/',
        id: 'about'
    },
    {
        path: '#/experiments/',
        id: 'experiments'
    },
    {
        path: '#/404/',
        id: '404'
    }
    
]

const contentIds = [
    'home',
    'periodic-table',
    'view-periodic-table',
    'view-elements-list',
    // 'game-periodic-table',
    'initial-periodic-table',
    'about',
    'experiments',
    '404'
];
const defaultRoute = '/';

function navigateTo(hash) {
    const route = routes.find(routeFound => routeFound.path === hash);
    if (!route) {
        console.log('Route not found');
        navigateTo("#/404/");
        return;
    }
    handlesContent(route.id, route.parent);
    window.history.pushState({}, route.path, window.location.origin + route.path);
}

// Handles the event fired when the user navigates the session history.
// This happens when the user clicks the browser's back or forward buttons.
// In this case, we just navigate to the current url.
window.onpopstate = () => {
    const currentHash = window.location.hash;
    navigateTo(currentHash || defaultRoute);
}

(async () => {
    await loadHtmlComponents();
    loadElementList();
    header();
    experiments();

    navigateTo(window.location.hash || defaultRoute);
})();

function handlesContent(elementId, parent) {
    
    contentIds.forEach(element => {
        const elementDom = document.getElementById(element);
        if (!elementDom) return;
        elementDom.classList.add('hidden');
    });
    
    if(elementId === '404') {
        document.getElementById('header').classList.add('hidden');
        document.getElementById('footer-container').classList.add('hidden');
    }

    if (parent) {
        const parentDom = document.getElementById(parent);
        if (!parentDom) return;
        parentDom.classList.remove('hidden');
    }

    if(elementId === 'periodic-table') {
        document.getElementById('initial-periodic-table').classList.remove('hidden');
    }

    const elementDom = document.getElementById(elementId);
    if (!elementDom) return console.error('Element not found', elementId);
    elementDom.classList.remove('hidden');
}

function hiddenLoader() {
    document.getElementById('loader-container').classList.add('hidden');
    document.getElementById('header-container').classList.remove('hidden');
    document.getElementById('main-container').classList.remove('hidden');
    document.getElementById('footer-container').classList.remove('hidden');
}