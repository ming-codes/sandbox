#!/usr/bin/env coffee

store = {}

commands =
  set: (name, value) ->
    store[name] = value
  get: (name) ->
    if store[name]?
      console.log store[name]
    else
      console.log 'NULL'
  unset: (name) ->
    store[name] = null
  end: ->
    process.exit()

  # This is the key part
  # The transaction mechanism is completely implemented
  # using JavaScript's prototype chain :D
  begin: ->
    store = Object.create store
  rollback: ->
    if Object.prototype is Object.getPrototypeOf store
      console.log 'INVALID ROLLBACK'
    else
      store = Object.getPrototypeOf store
  commit: ->
    newStore = {}

    for key, value of store
      newStore[key] = value

    store = newStore

# process.stdin is unreliable in separating out
# each command line. Whatever is in the input needs
# to be buffered to separate out each command line
#
# Specifically..this tends to happen when you're feeding
# input through stdin with pipe
buffer = ''

process.stdin.setEncoding 'utf8'
process.stdin.on 'data', (data) ->
  buffer += data

  lines = buffer.split '\n'

  if lines.length > 1
    buffer = lines.pop()

    for line in lines
      tokens = line.trim().split ' '

      commands[tokens.shift().toLowerCase()].apply null, tokens

process.stdin.resume()
