const schema = {
  "berichte.metadata.headline": "api.data.title",
  "berichte.metadata.extrapages": "api.data.information",
  "berichte.pages": {
    "headline": "api.data.values.[].title",
    "value": "api.data.values.[].msg.[]"
  }

};

const apiData = {
  api: {
    data: {
      title: "Hallo Welt",
      values: [
        {
          title: "Best",
          msg: [{
            head: "Dies ist eine Test nachricht"
          }]
        },
        {
          title: "Best2",
          msg: [{
            head: "Dies ist eine Test nachricht2"
          },{
            head: "Weiter Testnachticht2"
          }]
        }
      ]
    }
  }
};


const Mapper = require('./Mapper');
const fromJS = require('immutable').fromJS;

const map = new Mapper(schema);
// console.log(JSON.stringify(map.schema));
console.log(JSON.stringify(map.map(apiData)));
console.log(map.error);
// console.log(map.map().berichte.pages);
