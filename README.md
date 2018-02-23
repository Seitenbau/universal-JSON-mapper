# universal-JSON-mapper
A tool to map JSON to JSON, using a Schema.

# run example
1. clone repo
2. npm-install
3. node example.index.js

## install
coming soon

## how to

1. Create a scheme

  ```
                  //output side : input side
  const scheme = { 'output.key': 'input.key' };```

2. Import mapper

  ``` const Mapper = require('universal-JSON-mapper'); ```

3. Create instance

  ``` const mapper = new Mapper(scheme); ```

4. Use mapper

  ``` const ountput = mapper.map(inpuData); ```


### Create a JSON Array like [{key: value}, {key: value}];

```const scheme = {'output.key': { 'subKey': 'input.key..' }}; ```

generates: ``` {output: {key: [{subKey: '/* some thing from input */'}]}} ```

NOTE: on Output side just use nested keys, on input side you need to go from root

### Jump in to json arrays
``` const data = { input: {keyWithValueIsArray: [{keyInObjectArray: 'FOO'}, {keyInObjectArray: 'BAR'}]}}; ```

``` const scheme = {'output.key': 'input.keyWithValueIsArray.[].keyInObjectArray'}; ```

generates: ```{output: {key: ['FOO', 'BAR']}}```
