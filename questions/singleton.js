class Singleton {
    static instance;

    constructor(name) {
        if (Singleton.instance) {
            return Singleton.instance; // if an object is returned from a constructor, it becomes 'this'
        }

        this.name = name;
        Singleton.instance = this;
    }

    getName() {
        return this.name;
    }
}

const inst1 = new Singleton('John');
const inst2 = new Singleton('Jane');

console.log(inst1 === inst2); // true
console.log(inst2.getName()); // John
