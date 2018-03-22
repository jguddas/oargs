const minimist = require('minimist')
const table = require('text-table')
const assert = require('assert')
const path = require('path')

module.exports = function Cli() {

  this.commands = {}
  this.aliases = {}

  const command = (name, opts, callback) => {
    assert(typeof name === 'string', 'command name is required')
    const { filter = 'default', alias = [], ...options } = opts || {}
    const cmd = {
      aliases: {},
      options: {},
      callback,
      ...options,
      name,
      alias: [].concat(alias),
      filter: [].concat(filter || [])
    }
    this.commands[name] = cmd
    ;[].concat(alias).forEach(val => this.aliases[val] = name)
    const option = (name, opts = {}) => {
      assert(typeof name === 'string', 'option name is required')
      cmd.options[name] = opts;
      [].concat(opts.alias || []).forEach(val => cmd.aliases[val] = name)
      return { option }
    }
    return { option }
  }

  const parse = (argv = minimist(process.argv.slice(2))) => {
    const { _: [name, ..._], ...flags } = argv
    const command = this.commands[this.aliases[name] || name]
    if (!command) return false
    const { callback, options, aliases, filter } = command

    const mapped = Object.keys(options)
      .reduce((acc, key) => acc.concat(options[key].filter || []), [])
      .concat(filter)
      .reduce((acc, val) => ((acc[val] = {}), acc), {})

    for (let key in { ...options, ...flags }) {
      const opt = options[aliases[key] || key] || {}
      ;[].concat(opt.filter || filter).forEach(flt => {
        const val = [
          (opt.overides || {})[flt],
          opt.overide,
          flags[key],
          (opt.defaults || {})[flt],
          opt.default,
        ].find(val => val !== undefined)
        if (val !== undefined) {
          mapped[flt][aliases[key] || key] = val
        }
      })
    }
    if (callback) callback({command, mapped, argv: { ...flags, _ }})
    return { command, mapped, argv: { ...flags, _ } }
  }

  const help = (opts = {}) => {
    let bin
    if (opts.bin === 'string') {
      bin = opts.bin
    } else {
      bin = Object.keys(opts.bin || {})
        .find(key => path.resolve(opts.bin[key]) === process.argv[1])
        || path.basename(process.argv[1])
    }

    let out = '\n'

    if (opts.name && opts.version)
      out += `  ${opts.name} ${opts.version}\n\n`

    if (opts.description)
      out += `  ${opts.description}\n\n`

    out += `  ${bin} <command> [options]\n\n`

    out += table(Object.keys(this.commands)
      .reduce((acc, name) => {
        const cmd = this.commands[name]
        return acc.concat([[
          `  ${[name, ...cmd.alias].join(', ')}`,
          `  ${cmd.description || ''}`
        ],[]], Object.keys(cmd.options)
          .filter(val => !cmd.options[val].overide && !cmd.options.overides )
          .map(val => [
            `    ${
              [val].concat(cmd.options[val].alias || [])
                .map(x => x.length > 1 ? `--${x}` : `-${x}`).join(', ')
            }`,
            `  ${cmd.options[val].description || ''}`
          ]), Object.keys(cmd.options).length ? [[]] : [])
      }, []))

    return out
  }

  const showHelp = opts => console.log(help(opts))

  return { command, parse, help, showHelp }

}
