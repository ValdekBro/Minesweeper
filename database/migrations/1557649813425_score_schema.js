'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScoreSchema extends Schema {
  up () {
    this.create('scores', (table) => {
      table.increments()
      table.string('time')
      table.string('difficulty')
      table.string('prop')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('scores')
  }
}

module.exports = ScoreSchema
