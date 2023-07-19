const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['id', 'category_name'],
                },
                {
                    model: Tag,
                    attributes: ['id', 'tag_name'],
                },
            ],
        });
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

// get one product
router.get('/:id', async (req, res) => {
    try {
        const product= await Product.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'category_name'],
                },
                {
                    model: Tag,
                    attributes: ['id', 'tag_name'],
                },
            ],
        });
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

// create new product
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        // if there's product tags, we need to create pairings to bulk create in the ProductTag model
        if (req.body.tagIds.length) {
            const productTagIdArr = req.body.tagIds.map((tag_id) => {
                return {
                    product_id: product.id,
                    tag_id,
                };
            });
            await ProductTag.bulkCreate(productTagIdArr);
        }
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    };
});

// update product
router.put('/:id', async (req, res) => {
    try {
        const [rowsupdated] = await Product.update(req.body, {
            where: {
            id: req.params.id,
            },
        })
        if (rowsupdated === 0) {
            return res.status(404).json({ message: 'No product found with this id!' });
        }
        if (req.body.tagIds && req.body.tagIds.length) {
            const productTags = await ProductTag.findAll({ 
                where: { 
                    product_id: req.params.id 
                } 
            })
            // get list of current tag_ids
            const productTagIds = productTags.map(({ tag_id }) => tag_id);
            const newProductTags = req.body.tagIds.filter((tag_id) => !productTagIds.includes(tag_id)).map((tag_id) => {
                return {
                    product_id: req.params.id,
                    tag_id,
                };
            });
            // figure out which ones to remove
            const productTagsToRemove = productTags
                .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                .map(({ id }) => id);
            // run both actions
            await Promise.all([
                ProductTag.destroy({ where: { id: productTagsToRemove } }),
                ProductTag.bulkCreate(newProductTags),
            ]);
        }
        res.status(200).json({ message: 'Product updated' });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});



router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
	try{
        const deletedProduct = await Product.findByPk(req.params.id);
        if (!deletedProduct) {
            res.status(404).json({ message: 'No product with this id!' });
            return;
        }
        await ProductTag.destroy({ where: { product_id: req.params.id } });
        await Product.destroy({
            where: {
                id: req.params.id,
            },
        });

		res.json(`${deletedProduct} was removed from the database`);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

module.exports = router;