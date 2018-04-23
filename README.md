oargs
=======

Oargs is a CLI framework with a focus on easy subcommand creation.

Installation
------------

```
npm i oargs
```

Usage
-----

```js
const oargs = require('orargs')
const cli = oargs()

cli
  .command('command', { description: 'example command' }, console.log)
  .option('first', { description: 'first option' })
  .option('second', { description: 'second option' })

if (!cli.parse()) cli.showHelp(require('./package.json'))

```

Documentation
---

### oargs()

Create CLI.

```js
const oargs = require('oargs')
const cli = oargs()
```

### cli.command(name, [options], [callback])

Add CLI subcommand.

- name: `string`
- options: `object`
  - description: `string`
  - alias: `string` `Array<string>`
  - filter: `string` `Array<string>` command group, defaults to `default`
  - inHelp: `boolean` show in help, defaults to `true`
  - aliases: `object` hidden option aliases
  - options: `object` options, (not recommended use option command instead)
- callback: `function` command handler
  - object: `object`
    - command: `object` command object
    - mapped: `object` grouped flags
    - argv: `object` minimist object

### cli.command( ... ).option(name, [options])

Add subcommand option.

- name: `string`
- options: `object`
  - description: `string`
  - alias: `string` `Array<string>`
  - filter: `string` `Array<string>` option group, defaults to command groups
  - default: `any` default value
  - defaults: `object` group specific defaults
  - overide: `any` always override value
  - overides: `object` grconst cli = oargs()oups specific overrides
  - mapper: `function` modify value using a function
    - value: `any` command flag value
    - filter: `string` option group

### cli.help([options])

Return help string.

- options: `object`
  - name: `string` CLI name
  - description: `string` CLI description
  - version: `string` version
  - bin: `string`, `object` binary name, defaults to basename of `argv[1]`
  - showPkgInfo: `boolean` show description, name and version, defaults to `true`

```js
cli.help(require('./package.json'))
```

### cli.showHelp([options])

Print help string.

Same as `console.log(cli.help(options))`.

### cli.parse([argv])

Parse CLI and call callback.

- argv: `object`, defaults to minimist object

Returns command callback options or false.

