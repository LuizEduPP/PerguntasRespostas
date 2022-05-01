const Sequelize = require("sequelize")

const connection = new Sequelize('guia_perguntas', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    port: 3307
})

module.exports = connection