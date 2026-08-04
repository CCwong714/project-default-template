import { readFile, writeFile } from 'node:fs/promises'

import { parse } from 'acorn'

const INPUT_PATH = '/private/tmp/pacome-entry-current.js'
const OUTPUT_DIRECTORY = 'public/assets/pacome/ui'
const dependencyPattern =
  /^(?:assets|ddd|fr|h|ip|layers|markers|nm|op|props|v|w)\$[1-5]$/
const facePattern = /^face[1-5]$/

const source = await readFile(INPUT_PATH, 'utf8')
const program = parse(source, {
  ecmaVersion: 'latest',
  sourceType: 'module',
})
const values = new Map()

function evaluateStatic(node) {
  if (node.type === 'Literal') {
    return node.value
  }
  if (node.type === 'Identifier') {
    if (!values.has(node.name)) {
      throw new Error(`Unknown static identifier: ${node.name}`)
    }
    return values.get(node.name)
  }
  if (node.type === 'UnaryExpression') {
    const argument = evaluateStatic(node.argument)
    if (node.operator === '-') {
      return -argument
    }
    if (node.operator === '+') {
      return +argument
    }
    if (node.operator === '!') {
      return !argument
    }
    throw new Error(`Unsupported static unary operator: ${node.operator}`)
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map((element) => {
      if (element == null) {
        return null
      }
      return evaluateStatic(element)
    })
  }
  if (node.type === 'ObjectExpression') {
    const result = {}
    for (const property of node.properties) {
      if (property.type !== 'Property' || property.computed) {
        throw new Error('Unsupported object property in Lottie data')
      }
      const key =
        property.key.type === 'Identifier'
          ? property.key.name
          : String(evaluateStatic(property.key))
      result[key] = evaluateStatic(property.value)
    }
    return result
  }
  const isJsonParse =
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'JSON' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'parse'
  if (isJsonParse) {
    const [argument] = node.arguments
    if (argument == null || argument.type === 'SpreadElement') {
      throw new Error('Invalid JSON.parse call in Lottie data')
    }
    return JSON.parse(evaluateStatic(argument))
  }
  throw new Error(`Unsupported static node: ${node.type}`)
}

for (const statement of program.body) {
  if (statement.type !== 'VariableDeclaration') {
    continue
  }
  for (const declaration of statement.declarations) {
    if (declaration.id.type !== 'Identifier' || declaration.init == null) {
      continue
    }
    const { name } = declaration.id
    if (!dependencyPattern.test(name) && !facePattern.test(name)) {
      continue
    }
    values.set(name, evaluateStatic(declaration.init))
  }
}

for (const faceNumber of [1, 3, 4, 5]) {
  const animation = values.get(`face${faceNumber}`)
  if (animation == null) {
    throw new Error(`face${faceNumber} was not found in the production bundle`)
  }
  await writeFile(
    `${OUTPUT_DIRECTORY}/face${faceNumber}.json`,
    `${JSON.stringify(animation)}\n`,
  )
}
