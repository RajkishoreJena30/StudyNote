Object.prototype.rajkishore = function () {
    console.log(`Rajkishore Present in the all objects`)
}

const emp = ["raj", "ramesh"];
console.log(emp.length);
emp.rajkishore();

String.prototype.truelength = function () {
    return this.trim().length;
}

let anotherUsername = "Hello Rajkishore    ";
console.log(anotherUsername.truelength())


const User = { name: "Rajkishore", age: "28" };
const Employe = { makeProject: true };

Object.setPrototypeOf(Employe, User)

console.log(Employe.name);
console.log(Employe.makeProject);