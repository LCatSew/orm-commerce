const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Tag extends Model {}

Tag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        tag_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: false,
            }
        },
        product_tag: {
            references: {
                model: 'product_tag',
                key: 'id',
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'tag',
    }
);

module.exports = Tag;