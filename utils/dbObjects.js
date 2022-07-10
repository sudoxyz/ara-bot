const Sequelize = require('sequelize');

const sequelize = new Sequelize({
        dialect: 'mysql',
        //logging: false,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB
});

const Users = require('./models/users.js')(sequelize, Sequelize.DataTypes);
const Stats = require('./models/stats.js')(sequelize, Sequelize.DataTypes);


Users.sync({force:false});
Stats.sync({force:false});
module.exports = { Users,Stats,sequelize };
