const express = require('express');
const router = express.Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/api/tags', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
    try {
        const tags = await Tag.findAll({
            include: [{ 
                model: Product,
                attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
                through: ProductTag,
            }],
        });
        res.status(200).json(tags);

    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

router.get(`api/tags/:id`, async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
    try {
        const tag = await Tag.findByPk(req.params.id, {
            include: [{
                model: Product,
                attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
                through: ProductTag,
            }],
        });
        if (!tag) {
            res.status(404).json({ message: 'No tag with this id!' });
            return;
        }
        res.status(200).json(tag);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/api/tags', async (req, res) => {
  // create a new tag
    try {
        const newTag = await Tag.create({
            tag_name: req.body.tag_name,
        });
        res.status(200).json(newTag);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('api/tags/:id', async (req, res) => {
  // update a tag's name by its `id` value
    try {
        const [rowsUpdated] = await Tag.update({
            tag_name: req.body.tag_name,
        }, 
        {
            where: {
                id: req.params.id,
            },
        });
        if (!rowsUpdated) {
            res.status(404).json({ message: 'No tag found with this id!' });
            return;
        }
        const updatedTag = await Tag.findByPk(req.params.id);
        res.status(200).json(updatedTag);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
    try {
        const deletedTag = await Tag.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!deletedTag) {
            res.status(404).json({ message: 'No tag found with this id!' });
            return;
        }
        res.status(200).json(deletedTag);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;