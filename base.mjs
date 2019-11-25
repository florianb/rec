import Ajv from 'ajv'
import merge from 'lodash.merge'

export default class Base {
	static get schema() {
		return null
	}

	static newFrom(obj) {
		if (this.schema !== null) {
			if (!this._validate) {
				this._validate = (new Ajv()).compile(this.schema)
			}

			if (this._validate(obj) === false) {
				const messages = this._validate.errors.map(e => `${e.dataPath}: ${e.message}`)

				throw new TypeError(
					`Schema validation for ${this.prototype.constructor.name} ` +
					`failed at: ${messages.join(', ')}`
				)
			}
		}

		const newInstance = Object.create(this.prototype)

		merge(newInstance, obj)

		return newInstance
	}
}
