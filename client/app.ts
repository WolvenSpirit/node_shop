const doc: Document = document;

class app {;

    constructor() {
        this.load();
    }
    load() {
        if(document !== null) {
            // @ts-ignore: Object is possibly 'null'.
            document.getElementById('1').innerHTML += `Hello TS!`;
        }
    }
}

let myApp = new app();
