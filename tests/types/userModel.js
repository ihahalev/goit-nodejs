class userModel {
  constructor() {
    this._id = 1;
    this.token = 0;
  }

  set(token) {
    this.token = token;
    return this;
  }

  updateUser(id) {
    this.id = id;
  }
}

module.exports = userModel;
