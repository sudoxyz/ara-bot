module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },last_message: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            allowNull: false,
        },
        level:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        xp:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        last_daily:{
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: false,
        },
        muted:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        debater: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        b12:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        verifier:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        vegsupport: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        mediateam:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        arateam:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        outreachleader:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        humanrights:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        voidaccess:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        moderator:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        stats:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        restricted:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        restricted2:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        restricted3:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        restricted4:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        lastJoinedVC:{
          type: DataTypes.DATE,
          defaultValue: sequelize.fn('now'),
          allowNull: false,
        },
        lastLeftVC:{
          type: DataTypes.DATE,
          defaultValue: sequelize.fn('now'),
          allowNull: false,
        }
    }, {
        timestamps: false,
    });
};