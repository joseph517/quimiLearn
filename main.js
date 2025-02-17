// imports

function loadHtmlComponents() {
    function loadComponent(url, selector) {
        return new Promise((resolve) => {
            $(selector).load(url, () => resolve());
        });
    }
    setTimeout(() => {
        Promise.all([
            loadComponent('./app/componets/header/header.html', '#header'),
            loadComponent('./app/componets/footer/footer.html', '#footer'),
            loadComponent('./app/pages/home/home.html', '#home')
        ]).then(() => {
            console.log('All components loaded successfully');
            hiddenLoader();
        }).catch((error) => {
            console.error(error);
        });
    }, 1000);
}

// Paths
const routes = [{
    path: '/', id: 'home'
}, ]

const contentIds = ['home'];
const defaultRoute = '/';

function navigateTo(hash) {
    const route = routes.find((routeFound) => routeFound.path === hash);
    const idRoute = route.id;
    handlesContent(idRoute);
    if (route) {
        window.history.pushState({},
            route.path,
            window.location.origin + route.path
        );
    } else {
        navigateTo("#/error")
    }
}

// Handles the event fired when the user navigates the session history.
// This happens when the user clicks the browser's back or forward buttons.
// In this case, we just navigate to the current url.
window.onpopstate = () => {
    const currentHash = window.location.hash;
    navigateTo(currentHash || defaultRoute);
}
navigateTo(window.location.hash || defaultRoute);

/**
 * Handles the visibility of the content based on the given elementId.
 * @param {string} elementId - The id of the element to be shown.
 * @description
 * It iterates over the contentIds array and adds the 'hidden' class to all of them.
 * Then, it removes the 'hidden' class from the element with the given id.
 */
function handlesContent(elementId) {
    contentIds.forEach((element) => {
        document.getElementById(element).classList.add('hidden');
    })
    document.getElementById(elementId).classList.remove('hidden');
}

function hiddenLoader() {
    console.log('hidden loader');
    document.getElementById('loader-container').classList.add('hidden');
}

loadHtmlComponents();