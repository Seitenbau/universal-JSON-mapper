class PathNotFound {
  constructor(path, where) {
    this.name= "PathNotFound";
    this.path = path;
    this.where = where;
  }

  toString() {
    return `${this.name} [${this.path.join('/')}] in "${this.where}"`;
  }
}



module.exports = PathNotFound;
