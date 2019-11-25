const test = require('ava')
const isEqual = require('lodash.isequal')

test.before(async t => {
	t.context.Base = (await import('../base.mjs')).default

	t.context.SchemaLess = class extends t.context.Base {
		constructor() {
			super()

			this.a = 1
			this.b = 'b'
		}
	}

	t.context.SchemaFull = class extends t.context.Base {
		static get schema() {
			return {
				required: ['a', 'b'],
				properties: {
					a: {
						type: 'integer'
					},
					b: {
						type: 'string'
					}
				}
			}
		}

		constructor() {
			super()

			this.a = 1
			this.b = 'b'
		}
	}
})

test('should serialize and deserialize without schema', t => {
	const source = {
		a: 2,
		b: 'c',
		c: true
	}

	const derived = t.context.SchemaLess.newFrom(source)

	t.is(derived.a, 2)
	t.is(derived.b, 'c')
	t.is(derived.c, true)

	const serialized = JSON.parse(JSON.stringify(derived) + ' ')
	t.true(isEqual(source, serialized))
})

test('should deserialize with schema', t => {
	const source = {
		a: 2,
		b: 'c',
		c: true
	}

	const derived = t.context.SchemaFull.newFrom(source)

	t.is(derived.a, 2)
	t.is(derived.b, 'c')
	t.is(derived.c, true)
})

test('should not deserialize if source is not schema-conform', t => {
	const source = {
		a: 'c',
		b: 3,
		c: true
	}

	const error = t.throws(() => t.context.SchemaFull.newFrom(source), TypeError)

	t.is(error.message, 'Schema validation for Base failed at: .a: should be integer')
})

test('should pass the class-name in the TypeError for named classes', t => {
	const source = {
		nazgul: 1
	}

	class Morgul extends t.context.Base {
		static get schema() {
			return {
				properties: {
					nazgul: {
						type: 'boolean'
					}
				}
			}
		}
	}

	const error = t.throws(() => Morgul.newFrom(source), TypeError)

	t.is(error.message, 'Schema validation for Morgul failed at: .nazgul: should be boolean')
})
