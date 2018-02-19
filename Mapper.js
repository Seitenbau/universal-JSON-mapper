const Map = require('immutable').Map;
const List = require('immutable').List;
const fromJS = require('immutable').fromJS;

class Mapper {
  constructor (scheme) {
    this.orignal = scheme;
    this.scheme = this.analyzescheme(scheme);
  }

  get orignal() {
    return this.orignal
  }

  get scheme() {
    return this.scheme.toJS(),
  }

  get immutablescheme() {
    return this.scheme;
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
    return this._mapWithImmutable(fromJS(input), this.scheme.toJS()).toJS();
  }

  /**
  interface for immutable -immutable Mapping
  @param input immutable Map an immutable Map which will be mapped
  @param scheme immutable JSON the scheme, this is optional
  */
  _mapWithImmutable(input, scheme = this.scheme.toJS()) {
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

          if(Map.isMap(sub)) {
            object = object.setIn([i].concat(p.model), sub.toList());
          } else {
            object = object.setIn([i].concat(p.model), sub);
          }
        }
        return;
      }
      object = object.setIn(p.model, data.getIn(p.values));

    });
    return object;
  }

}

module.exports = Mapper;
