module.exports = (sequelize, DataTypes) => {
    return sequelize.define('stats', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        seriouslyConsidered: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        saidTheyWentVegan: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        concededAntiVeganPosition:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        thankedYou:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        wouldWatchDocumentary: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        changedPerspective:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 0,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
};