const minimist = require('minimist')
const assert = require('assert')

module.exports = function Cli() {

  this.commands = {}

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
    ;[name].concat(alias).forEach(val => this.commands[val] = cmd)
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
    const command = this.commands[name]
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
    return {command, mapped, argv: { ...flags, _ }}
  }

  return { command, parse }

}
