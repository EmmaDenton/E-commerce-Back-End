const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const productsData = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],
        },
        {
          model: Tag,
          through: ProductTag,
          as: 'tags',
          attributes: ['id', 'tag_name'],
        },
      ],
    });
    res.status(200).json(productsData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],
        },
        {
          model: Tag,
          through: ProductTag,
          as: 'tags',
          attributes: ['id', 'tag_name'],
        },
      ],
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const productData = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(productData);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProductData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagsToRemove = await ProductTag.destroy({
        where: {
          product_id: req.params.id,
          tag_id: { [Op.notIn]: req.body.tagIds },
        },
      });

      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      await ProductTag.bulkCreate(newProductTags);
    }

    res.status(200).json(updatedProductData);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedProductData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProductData) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    res.status(200).json(deletedProductData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

