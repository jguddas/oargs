const oargs = require('./')
const minimist = require('minimist')

// cli
it('cli: create', () => {
  const cli = oargs()

  expect(cli).toBeTruthy()
})

// command
it('command: empty', () => {
  const cli = oargs()

  expect(() => cli.command())
    .toThrow()
})

it('command: basic', () => {
  const cli = oargs()
  cli.command('first')
  cli.command('second')

  expect(cli.parse(minimist([])))
    .toBe(false)
  expect(cli.parse(minimist(['other'])))
    .toBe(false)
  expect(cli.parse(minimist(['first'])))
    .toBeTruthy()
})

it('command: alias', () => {
  const cli = oargs()
  cli.command('command', { alias: 'other' })

  expect(cli.parse(minimist(['other'])))
    .toBeTruthy()
})

it('command: aliases', () => {
  const cli = oargs()
  cli.command('command', { alias: ['first', 'second'] })

  expect(cli.parse(minimist(['command'])))
    .toEqual(cli.parse(minimist(['first'])))
  expect(cli.parse(minimist(['command'])))
    .toEqual(cli.parse(minimist(['second'])))
})

it('command: default', () => {
  const cli = oargs()
  cli.command('command')

  expect(cli.parse(minimist(['command'])).mapped)
    .toEqual({ default: {}  })
  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({ default: { option: true } })
})

it('command: filter', () => {
  const cli = oargs()
  cli.command('command', { filter: 'custom' })

  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({ custom: { option: true } })
})

it('command: filters', () => {
  const cli = oargs()
  cli.command('command', { filter: ['first', 'second'] })

  expect(cli.parse(minimist(['command'])).mapped)
    .toEqual({ first: {}, second: {} })
  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({ first: { option: true }, second: { option: true } })
})

// TODO callback checks

// option
it('option: empty', () => {
  const cli = oargs()

  expect(() => cli.command('command').option())
    .toThrow()
})

it('option: basic', () => {
  const cli = oargs()
  cli.command('command').option('option')

  expect(cli.parse(minimist(['command'])))
    .toBeTruthy()
})

it('option: alias', () => {
  const cli = oargs()
  cli.command('command').option('option', { alias: 'other' })

  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({ default: { option: true } })
  expect(cli.parse(minimist(['command', '--other'])).mapped)
    .toEqual({ default: { option: true } })
})

it('option: aliases', () => {
  const cli = oargs()
  cli.command('command').option('option', { alias: ['first', 'second'] })

  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({ default: { option: true } })
  expect(cli.parse(minimist(['command', '--first'])).mapped)
    .toEqual({ default: { option: true } })
  expect(cli.parse(minimist(['command', '--second'])).mapped)
    .toEqual({ default: { option: true } })
})

it('option: filter', () => {
  const cli = oargs()
  cli.command('command').option('option', { filter: 'custom' })

  expect(cli.parse(minimist(['command'])).mapped)
    .toEqual({ custom: {}, default: {} })
  expect(cli.parse(minimist(['command', '--other'])).mapped)
    .toEqual({ custom: {}, default: { other: true } })
  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({ custom: { option: true }, default: {} })
  expect(cli.parse(minimist(['command', '--option', '--other'])).mapped)
    .toEqual({ custom: { option: true }, default: { other: true } })
})

it('option: filters', () => {
  const cli = oargs()
  cli.command('command').option('option', { filter: ['first', 'second'] })

  expect(cli.parse(minimist(['command'])).mapped)
    .toEqual({ default: {}, first: {}, second: {} })
  expect(cli.parse(minimist(['command', '--other'])).mapped)
    .toEqual({ default: { other: true }, first: {}, second: {} })
  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({ default: {}, first: { option: true }, second: { option: true } })
})

it('option: default', () => {
  const cli = oargs()
  cli.command('command').option('option', { default: 'default' })

  expect(cli.parse(minimist(['command'])).mapped)
    .toEqual({ default: { option: 'default' } })
  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({default: {option: true}})
})

it('option: defaults', () => {
  const cli = oargs()
  cli.command('command').option('option', { defaults: { first: 'first', second: 'second' }, filter:['first', 'second'] })

  expect(cli.parse(minimist(['command'])).mapped)
    .toEqual({
      default: {},
      first: { option: 'first' },
      second: { option: 'second' }
    })
  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({
      default: {},
      first: { option: true },
      second: { option: true }
    })
})

it('option: overide', () => {
  const cli = oargs()
  cli.command('command').option('option', { overide: 'default' })

  expect(cli.parse(minimist(['command'])).mapped)
    .toEqual({ default: { option: 'default' } })
  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({ default: { option: 'default' } })
})

it('option: overides', () => {
  const cli = oargs()
  cli.command('command').option('option', { overides: { first: 'first', second: 'second' }, filter:['first', 'second'] })

  expect(cli.parse(minimist(['command'])).mapped)
    .toEqual({
      default: {},
      first: { option: 'first' },
      second: { option: 'second' }
    })
  expect(cli.parse(minimist(['command', '--option'])).mapped)
    .toEqual({
      default: {},
      first: { option: 'first' },
      second: { option: 'second' }
    })
})
