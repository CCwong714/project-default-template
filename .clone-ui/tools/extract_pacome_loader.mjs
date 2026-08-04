import fs from 'node:fs'
import ts from 'typescript'

const sourcePath = '/private/tmp/pacome-rgzkqdZW.js'
const outputPath = new URL(
  '../../public/assets/pacome/ui/loader.json',
  import.meta.url,
)
const sourceText = fs.readFileSync(sourcePath, 'utf8')
const sourceFile = ts.createSourceFile(
  sourcePath,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.JS,
)
const declarations = new Map()

function collectDeclarations(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
    declarations.set(node.name.text, node.initializer)
  }
  ts.forEachChild(node, collectDeclarations)
}

function readPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text
  }
  throw new Error(`Unsupported property name: ${name.getText(sourceFile)}`)
}

function readNode(node, stack = new Set()) {
  if (node == null) {
    return undefined
  }
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return ts.isStringLiteral(node) ? node.text : Number(node.text)
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true
  }
  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false
  }
  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null
  }
  if (ts.isPrefixUnaryExpression(node)) {
    const operand = readNode(node.operand, stack)
    if (node.operator === ts.SyntaxKind.ExclamationToken) {
      return !operand
    }
    if (node.operator === ts.SyntaxKind.MinusToken) {
      return -Number(operand)
    }
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => readNode(element, stack))
  }
  if (ts.isObjectLiteralExpression(node)) {
    const value = {}
    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property)) {
        value[readPropertyName(property.name)] = readNode(
          property.initializer,
          stack,
        )
        continue
      }
      if (ts.isShorthandPropertyAssignment(property)) {
        value[property.name.text] = readIdentifier(property.name.text, stack)
        continue
      }
      throw new Error(
        `Unsupported object property: ${property.getText(sourceFile)}`,
      )
    }
    return value
  }
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.getText(sourceFile) === 'JSON' &&
    node.expression.name.text === 'parse' &&
    node.arguments.length === 1 &&
    ts.isStringLiteral(node.arguments[0])
  ) {
    return JSON.parse(node.arguments[0].text)
  }
  if (ts.isIdentifier(node)) {
    return readIdentifier(node.text, stack)
  }
  throw new Error(
    `Unsupported syntax: ${node.getText(sourceFile).slice(0, 120)}`,
  )
}

function readIdentifier(name, stack) {
  if (stack.has(name)) {
    throw new Error(`Circular declaration: ${name}`)
  }
  const initializer = declarations.get(name)
  if (initializer == null) {
    throw new Error(`Missing declaration: ${name}`)
  }
  const nextStack = new Set(stack)
  nextStack.add(name)
  return readNode(initializer, nextStack)
}

collectDeclarations(sourceFile)
const animation = readIdentifier('loader', new Set())
fs.writeFileSync(outputPath, `${JSON.stringify(animation)}\n`)
console.log(
  JSON.stringify({
    bytes: fs.statSync(outputPath).size,
    fr: animation.fr,
    frames: animation.op - animation.ip,
    name: animation.nm,
    outputPath: outputPath.pathname,
  }),
)
