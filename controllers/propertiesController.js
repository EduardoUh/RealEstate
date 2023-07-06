import { validationResult } from 'express-validator';
import { unlink } from 'node:fs/promises';
import { Category, Price, Property, Message, User } from '../models/index.js';
import { isOwner } from '../helpers/isOwner.js';
import formatDate from '../helpers/formatDate.js';


const admin = async (req, res) => {
    /* 
        query string, parameters after the ? character
        /clients?id=20
        Read query string in node
    */
    const { page: currentPage } = req.query;
    /* 
        Let's break down this pattern:

    ^: Matches the start of the string.
    [1-9]: Matches any digit from 1 to 9 (excluding 0).
    \d*: Matches zero or more digits.
    $: Matches the end of the string.
    So, the complete regex pattern /^[1-9]\d*$/ ensures that
    the entire string consists of one or more digits, and the
    first digit is in the range of 1-9.
    */
    const regEx = /^[1-9]\d*$/;


    if (!regEx.test(currentPage)) {
        return res.redirect('/my-properties?page=1');
    }
    try {
        const { id: userId } = req.user;
        // max and offset of pagination
        const limit = 10;
        const offset = ((currentPage * limit) - limit);
        /* 
            it will jump 0 records and start form 1
            (1 * 10) - 10 = 0
            it will jump the first 10 records and start from 11
            (2 * 10) - 10 = 10
            it will jump the first 20 records and start from 21
            (3 * 10) - 10 = 20
        */
        const [properties, count] = await Promise.all([
            Property.findAll({
                limit,
                offset,
                where: {
                    userId
                },
                include: [
                    { model: Category, as: 'category' },
                    { model: Price, as: 'price' },
                    { model: Message, as: 'messages' }
                ]
            }),
            Property.count({
                where: { userId }
            })
        ]);
        // console.log(properties);
        // console.log(count);
        res.render('properties/admin', {
            page: 'My properties',
            properties,
            csrfToken: req.csrfToken(),
            currentPage: Number(currentPage),
            pages: Math.ceil(count / limit),
            count,
            offset,
            limit
        });
    }
    catch (err) {
        console.log(err);
    }
};

const create = async (req, res) => {
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ]);
    res.render('properties/create', {
        page: 'Create property',
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: {}
    });
};

const save = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        // console.log(description);
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ]);
        return res.render('properties/create', {
            page: 'Create property',
            csrfToken: req.csrfToken(),
            errors: result.array(),
            categories,
            prices,
            data: req.body
        });
    }

    // save property data to database
    // console.log(req.body)
    const { title, description, category: categoryId, price: priceId, rooms, parking, wc, address, lat, lng } = req.body;
    const { id: userId } = req.user;
    try {
        const savedProperty = await Property.create({
            title,
            description,
            rooms,
            parking,
            wc,
            address,
            lat,
            lng,
            priceId,
            categoryId,
            userId,
            picture: ''
        });
        const { id } = savedProperty;
        res.redirect(`/properties/add-picture/${id}`);
    }
    catch (err) {
        console.log(err);
    }
};

const addPicture = async (req, res) => {
    const { id } = req.params;
    // verify if the property exists
    const property = await Property.findByPk(id);
    // console.log(id);
    // console.log(property);
    if (!property) {
        return res.redirect('/my-properties');
    }
    // verify if the property is not published yet
    if (property.published) {
        return res.redirect('/my-properties');
    }
    // validate if the user is the owner
    /* console.log(req.user.id);
    console.log(property.userId); */
    if (req.user.id.toString() !== property.userId.toString()) {
        return res.redirect('/my-properties');
    }
    res.render('properties/add-picture', {
        page: `Add Picture - ${property.title}`,
        csrfToken: req.csrfToken(),
        id: property.id
    });
};

const savePicture = async (req, res, next) => {
    const { id } = req.params;
    // verify if the property exists
    const property = await Property.findByPk(id);
    // console.log(id);
    // console.log(property);
    if (!property) {
        return res.redirect('/my-properties');
    }
    // verify if the property is not published yet
    if (property.published) {
        return res.redirect('/my-properties');
    }
    // validate if the user is the owner
    /* console.log(req.user.id);
    console.log(property.userId); */
    if (req.user.id.toString() !== property.userId.toString()) {
        return res.redirect('/my-properties');
    }

    try {
        // save image to database and publish property
        // multer adds the file to the req
        // console.log(req.file);
        property.picture = req.file.filename;
        property.published = 1;
        await property.save();
        // we're using this in convination with the js redirectioning
        // in the addPicture.js file
        next();
    }
    catch (err) {
        console.log(err);
    }
};

const edit = async (req, res) => {
    const property = await Property.findByPk(req.params.id);
    const { id: userId } = req.user;
    /* console.log(categories);
    console.log(prices);
    console.log(property);
    console.log(property.userId == req.user.id); */

    if (!property) {
        return res.redirect('/my-properties');
    }
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties');
    }
    const [categories, prices] = await Promise.all([
        Category.findAll(),
        Price.findAll()
    ]);
    res.render('properties/edit', {
        page: `Edit property - ${property.title}`,
        csrfToken: req.csrfToken(),
        categories,
        prices,
        data: property
    });
};

const saveChanges = async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const [categories, prices] = await Promise.all([
            Category.findAll(),
            Price.findAll()
        ]);
        return res.render('properties/edit', {
            page: 'Edit property',
            csrfToken: req.csrfToken(),
            categories,
            prices,
            errors: result.array(),
            data: req.body
        });
    }

    const { id } = req.params;

    const property = await Property.findByPk(id);

    if (!property) {
        return res.redirect('/my-properties');
    }

    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties');
    }

    try {
        const { title, description, categoryId, priceId, rooms, parking, wc, address, lat, lng } = req.body;
        property.set({
            title,
            description,
            categoryId,
            priceId,
            rooms,
            parking,
            wc,
            address,
            lat,
            lng,
        })

        await property.save();

        return res.redirect('/my-properties');
    }
    catch (err) {
        console.log(err);
    }

};

const deleteProperty = async (req, res, next) => {
    const { id: propertyId } = req.params;
    const property = await Property.findByPk(propertyId);
    /* console.log(propertyId);
    console.log(property);
    console.log(req.user.id) */
    if (!property) {
        return res.redirect('/my-properties');
    }
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties');
    }

    // delete picture associated to property
    await unlink(`public/uploads/${property.picture}`);
    // console.log(`Picture ${property.picture} has been deleted`);

    // delete property from database
    await property.destroy();
    res.redirect('/my-properties');
};

const updateState = async (req, res) => {
    const { id: propertyId } = req.params;

    const property = await Property.findByPk(propertyId);
    if (!property) {
        return res.redirect('/my-properties');
    }
    if (property.userId.toString() !== req.user.id.toString()) {
        return res.redirect('/my-properties');
    }

    // two ways of updating the property state
    // property.published ? property.published = 0 : property.published = 1;
    property.published = !property.published;
    await property.save();
    res.json({
        newState: property.published
    })
};

const showProperty = async (req, res) => {
    // res.send('showing property');
    const { id } = req.params;
    const { user } = req;
    // console.log(user);
    const property = await Property.findByPk(id, {
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' }
        ]
    });

    if (!property || !property.published) {
        return res.redirect('/404');
    }

    // console.log(isOwner(user.id, property.userId));

    res.render('properties/show', {
        page: `See property - ${property.title}`,
        csrfToken: req.csrfToken(),
        property,
        user,
        isOwner: isOwner(user?.id, property.userId)
    });

};

const sendMessage = async (req, res) => {
    const result = validationResult(req);
    const { id: propertyId } = req.params;
    const { user } = req;

    const property = await Property.findByPk(propertyId, {
        include: [
            { model: Category, as: 'category' },
            { model: Price, as: 'price' }
        ]
    });

    if (!property) {
        return res.redirect('/404');
    }

    if (!result.isEmpty()) {
        return res.render('properties/show', {
            page: `See property - ${property.title}`,
            csrfToken: req.csrfToken(),
            property,
            user,
            isOwner: isOwner(user?.id, property.userId),
            errors: result.array()
        });
    }

    const { message } = req.body;
    // store message
    await Message.create({
        message,
        propertyId,
        userId: user.id
    });

    /* 
    To stay in the same page but if user reloads page it will display the "resend form data" popup
    res.render('properties/show', {
        page: `See property - ${property.title}`,
        csrfToken: req.csrfToken(),
        property,
        user,
        isOwner: isOwner(user?.id, property.userId),
        sendMessage: true
        }); 
    */
    res.redirect('/');
};

// read received messages

const seeMessages = async (req, res) => {
    const { id: userId } = req.user;
    const { id: propertyId } = req.params;

    const property = await Property.findByPk(propertyId, {
        // cruzando mensajes con propiedad
        include: [
            {
                model: Message, as: 'messages',
                // cruzando usuario con mensaje y añadiendole un scope para no traer datos innecesarios
                include: [
                    { model: User.scope('deleteUnnecessaryFields'), as: 'user' }
                ]
            },
        ]
    });
    if (!property) {
        return res.redirect('/my-properties');
    }

    if (userId.toString() !== property.userId.toString()) {
        return res.redirect('/my-properties');
    }

    res.render('properties/show-messages', {
        page: 'Messages',
        messages: property.messages,
        user: property.user,
        formatDate,
        // userId
    });
};

export {
    admin,
    create,
    save,
    addPicture,
    savePicture,
    edit,
    saveChanges,
    deleteProperty,
    updateState,
    showProperty,
    sendMessage,
    seeMessages,
}