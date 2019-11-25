# rec

Minimal ECMAScript-module facilitating model-framework to support a workflow without magic.

Features:

- Allows PlainObject instantiation as class
- Validates class at instantiation using (cached) AJV-validators

## Usage

```js
import Base from 'rec'

class FellowShipOfTheRing extends Base {
	static get schema() {
		return {
			properties: {
				boromir: {
					type: 'integer'
				}
			}
		}
	}
}

const sourceObject = {boromir: false}

let fellowship = FellowShipOfTheRing.newFrom(sourceObject)
// TypeError: Schema validation for FellowShipOfTheRing failed at: .boromir: should be integer

fellowship = FellowShipOfTheRing.newFrom({boromir: 0})
// success! 
```

Instantiate a class from a plain object using the static method `newFrom()`. If the `schema`-property is defined, its value is used as JSONSchema and the plain object is validated against it. If the validation fails a TypeError is raised.

## Base API

### `static newFrom(Object source) -> Object`

Returns a new instance of the class having the `source` merged in. If the `schema` property is defined, the source wil be validated before being merged.

- returns: `Object` - instantiated class with merged in properties from `source`
- throws: `TypeError` - if `schema` is set and validation fails

### `get static schema() -> Object`

Overrride to provide a [JSONSchema](https://jsonschema.net/) for the class. If set the schema will be used to validate any new instantiation of the Class.

- returns: `Object` - JSONSchema object according to the schema-version 7

