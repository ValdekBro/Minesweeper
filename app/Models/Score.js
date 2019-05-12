'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Score extends Model {

    user () {
        return this.belongsTo('App/Models/User');
    }
}

module.exports = Score
