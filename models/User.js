module.exports = class User {
  constructor(id, name, surname, email, password) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }
};