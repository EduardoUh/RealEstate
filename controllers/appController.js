import { Sequelize } from 'sequelize';
import { Property, Price, Category } from '../models/index.js';


const home = async (req, res) => {
    const [categories, prices, houses, apartments] = await Promise.all([
        Category.findAll({
            raw: true
        }),
        Price.findAll({
            raw: true
        }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 1,
                published: true
            },
            include: [
                { model: Price, as: 'price' }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            // raw: true
        }),
        Property.findAll({
            limit: 3,
            where: {
                categoryId: 2,
                published: true
            },
            include: [
                { model: Price, as: 'price' }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            // raw: true
        })
    ]);
    // console.log(categories);
    /* console.log(houses);
    console.log(apartments); */
    res.render('home', {
        page: 'Home',
        csrfToken: req.csrfToken(),
        categories,
        prices,
        houses,
        apartments
    });
};

const filterByCategory = async (req, res) => {
    const { id: categoryId } = req.params;
    // console.log(categoryId);
    // Verify if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
        return res.redirect('/404');
    }
    // Get category properties
    const properties = await Property.findAll({
        where: { categoryId, published: true },
        include: [
            { model: Price, as: 'price' },
            { model: Category, as: 'category' }
        ]
    });
    // const page = properties[0]?.category?.name ?? 'Empty Category';
    res.render('category', {
        page: `${category.name} for sale`,
        csrfToken: req.csrfToken(),
        properties
    });
};

const notFound = (req, res) => {
    res.render('404', {
        page: 'Not Found',
        csrfToken: req.csrfToken()
    })
};

const search = async (req, res) => {
    const { term } = req.body;
    // validate term is not an empty string
    if (!term.trim()) {
        return res.redirect('back'); // back returns the user to the page we was when he submitted the form
    }
    // get properties
    const properties = await Property.findAll({
        where: {
            title: {
                // enabling search    added % at begining and end
                // to search the term in any part of the title
                [Sequelize.Op.like]: '%' + term + '%'
            },
            published: true
        },
        include: [
            { model: Price, as: 'price' }
        ]
    });
    res.render('search', {
        page: `Porperties with: ${term}`,
        csrfToken: req.csrfToken(),
        properties
    });
};

export {
    home,
    filterByCategory,
    notFound,
    search
}
