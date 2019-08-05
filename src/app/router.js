export class Router {
    constructor(defaultPage) {
        this.routes = {};
        this.defaultPage = defaultPage;
        this.firsTimePage = '/first-time';
    }

    load(path) {
        if (this.routes[path]) {
            this.routes[path].render();
        } else {
            this.routes[this.defaultPage].render();
        }
    }

    clearSlashes(href) {
        return href.toString().replace(/.+\/\//, '').replace(/.+\//, '/');
    };

    add(path, construct) {
        this.routes[path] = construct;
    }

    navigate(href) {
        const path = this.clearSlashes(href);
        this.load(path);
    }

    innit() {
        if (!window.sessionStorage.getItem('isNew')) {
            window.sessionStorage.setItem('isNew', true);
            this.load(this.firsTimePage);
        } else {
            this.load(window.location.pathname);
        }
    }
}
