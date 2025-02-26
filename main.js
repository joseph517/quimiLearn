// Imports

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
                loadComponent('./app/components/footer/footer.html', '#footer')
            ]);
            await Promise.all([
                loadComponent('./app/components/table/table.html', '#view-periodic-table'),
                // loadComponent('./app/components/element-list/element-list.html', '#view-elements-list')
            ]);
            console.log('All components loaded successfully');
            hiddenLoader();
            resolve();
        } catch (error) {
            console.error('Error loading components:', error);
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
]

const contentIds = ['home', 'periodic-table', 'view-periodic-table'];
const defaultRoute = '/';

function navigateTo(hash) {
    const route = routes.find(routeFound => routeFound.path === hash);
    if (!route) {
        navigateTo("#/error");
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
    console.log('currentHash', currentHash);

    navigateTo(currentHash || defaultRoute);
}

(async () => {
    await loadHtmlComponents();
    navigateTo(window.location.hash || defaultRoute);
})();

function handlesContent(elementId, parent) {

    contentIds.forEach(element => {
        const elementDom = document.getElementById(element);
        if (!elementDom) return;
        elementDom.classList.add('hidden');
    });

    if (parent) {
        const parentDom = document.getElementById(parent);
        if (!parentDom) return;
        parentDom.classList.remove('hidden');
    }

    const elementDom = document.getElementById(elementId);
    if (!elementDom) return console.error('Element not found', elementId);
    elementDom.classList.remove('hidden');
}

function hiddenLoader() {
    document.getElementById('loader-container').classList.add('hidden');
}