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
            notEmpty: true,
                isValidProductName(value) {
                    if (!/^[a-zA-Z\s-]+$/.test(value)) {
                        throw new Error('Product name can only contain letters, spaces, and hyphens.');
                    }
                },
                len: [1, 255], // Only allow values with length between 1 and 255
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
