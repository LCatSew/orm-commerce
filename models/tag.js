const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');
const ProductTag = require('./productTag'); // Make sure to import the ProductTag model

class Tag extends Model {}

Tag.init(
    {
        id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        },
        tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: false,
        },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'tag',
    }
);

// Define the Many-to-Many association between Tag and ProductTag
Tag.belongsToMany(ProductTag, {
  through: 'product_tag', // The join table name
  foreignKey: 'tag_id', // The foreign key in the join table that points to Tag's primary key
});

module.exports = Tag;
