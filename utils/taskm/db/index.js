const Sequelize = require('sequelize')
const TaskModel = require('./models/task')
const DEFAULT_CONFIG =  require('./config')

class DB {
  constructor(_config = null) {
    const {
        dialect = DEFAULT_CONFIG.dialect,
        storage = DEFAULT_CONFIG.storage,
        logging = DEFAULT_CONFIG.logging
      } = _config

    // console.log(dialect, storage, logging)

    const sequelize = new Sequelize({
      dialect, storage, logging,
      query:{
        raw:true,
      },
    })
    const Task = TaskModel(sequelize, Sequelize)

    this._TaskModel = Task
    this.sequelize = sequelize
  }

  init(options = {}){
    const {isPurge = false} = options
    const dbOptions = isPurge ? { force: true } : {}
    // return this.sequelize.sync({ force: true })

    if(isPurge) {
      console.log('[INFO] going to purge')
    }

    return this.sequelize.sync(dbOptions).then(() => {
      console.log(`Database & tables created!`)
      return
    })
  }

  TaskModel() {
    return this._TaskModel
  }
}

module.exports = DB