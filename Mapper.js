const Map = require('immutable').Map;
const List = require('immutable').List;
const fromJS = require('immutable').fromJS;
const PathNotFound = require('./exceptions').PathNotFound;

class Mapper {
  constructor (scheme) {
    this.orignal = scheme;
    this.scheme = this.analyzescheme(scheme).toJS();
    this.errors = [];
  }

  get error() {
    return this.errors;
  }

  set error(error) {
    this.errors.push(error)
  }

  /**
  Creates a scheme used to map the Data in to a Model.
  @param scheme JSON
  @return analysedscheme
  */
  analyzescheme(scheme) {
    const Mapscheme = fromJS(scheme);
    return Mapscheme.map((v, k) => {
      if(typeof v === 'object') {
        return Map({
          type: 'ARRAY',
          model: List(k.split('.')),
          values: this.analyzescheme(v),
        });
      } else {
        return Map({
          type: 'OBJECT',
          model: List(k.split('.')),
          values: List(v.split('.'))
        });
      }
    }).toList();
  }
  /**
  interface for JSON-to-JSON Mapping
  @param input JSON the data which will be mapped
  @return JSON the DataObject wich is genarated
  */
  map(input) {
    try {
      this.validateMap(input);
    } catch (e) {
      this.error = e.toString()
      console.error(e.toString());
    }
    return this._mapWithImmutable(fromJS(input), this.scheme).toJS();
  }

  /**
  interface for immutable -immutable Mapping
  @param input immutable Map an immutable Map which will be mapped
  @param scheme immutable JSON the scheme, this is optional
  */
  _mapWithImmutable(input, scheme = this.scheme) {
    let object = Map();
    scheme.forEach(p => {
      if(p.type === 'ARRAY') {
        object = object.setIn(p.model, this._mapWithImmutable(input, p.values).toList());
        return
      }

      if(p.values.indexOf('[]') > -1) {
        const pathBefore = p.values.slice(0, p.values.indexOf('[]')),
        pathBehind = p.values.slice(p.values.indexOf('[]') + 1),
        size = input.getIn(pathBefore).size;

        for(let i = 0; i < size; i++) {
          const partialData = input.getIn(pathBefore.concat(i)),
                sub = this._mapWithImmutable(partialData, [{
                        model: [],
                        values: pathBehind,
                        type: 'OBJECT'
                      }]);

          if(Map.isMap(sub) && sub.keySeq().get(0) === 0) {
            object = object.setIn([i].concat(p.model), sub.toList());
          } else {
            object = object.setIn([i].concat(p.model), sub);
          }
        }
        return;
      }
      object = object.setIn(p.model, input.getIn(p.values));

    });
    return object;
  }

  validateMap(data, scheme = this.scheme) {
    scheme.forEach(p => {
      if(typeof p.values[0] === 'string') {
        this.validatePath(data, p.values, 1);
      } else {
        this.validateMap(data, p.values);
      }
    })
  }

  validatePath(data, paths, end) {
    const map = fromJS(data);
    const path = List(paths);
    if(paths.length >= end) {
      if(path.slice(0, end).last() === '[]') {
        this.validatePath(map.getIn(path.slice(0, end - 1)),path.slice(end + 1), 1);
        return;
      }
      if(map.hasIn(path.slice(0, end).toJS())) {
        this.validatePath(data, paths, end + 1)
      } else {
        throw new PathNotFound(path.slice(0, end).toJS(), 'input data');
      }
    }
  }

}

module.exports = Mapper;
