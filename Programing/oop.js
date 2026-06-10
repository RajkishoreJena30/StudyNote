class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    encryptPassword() {
        return `${this.password}123`
    }

    lowerCaseUserName() {
        return `${this.username.toLowerCase()}`
    }
}

const chai = new User('Rajkishroe', 'raj@gmail.com', "1234");
console.log(chai.encryptPassword());
console.log(chai.lowerCaseUserName());

class Teacher extends User {
    constructor(username, email, password, subject) {
        super(username, email, password);
        this.subject = subject
    }

    addCourse() {
        console.log(`A new course was added by ${this.username}`);
    }
}

const tea = new Teacher("Chai", "tea@teacher.com", "456", "JavaScript");
tea.addCourse();
console.log(tea.lowerCaseUserName());    // chai (inherited from User)
console.log(tea.encryptPassword());

console.log(tea instanceof Teacher); // true
console.log(tea instanceof User);    // true