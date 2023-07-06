import Property from './Property.js';
import Category from './Category.js';
import Price from './Price.js';
import User from './User.js';
import Message from './Message.js';


// Se lee de derecha a izquierda
// "Property tiene una relación con Price y esta se llama priceId"
/* Price.hasOne(Property, { foreignKey: 'priceId' });
Category.hasOne(Property, { foreignKey: 'categoryId' });
User.hasOne(Property, { foreignKey: 'userId' }); */
/* 
    Hace los mismo pero se lee de izquierda a derecha
    "Property tiene una relación con Price y esta se llama priceId"
    Property.belongsTo(Price, { foreignKey: 'priceId' });
*/

Property.belongsTo(Price, { foreignKey: 'priceId' });
Property.belongsTo(Category, { foreignKey: 'categoryId' });
Property.belongsTo(User, { foreignKey: 'userId' });
Property.hasMany(Message, { foreignKey: 'propertyId' });

Message.belongsTo(Property, { foreignKey: 'propertyId' });
Message.belongsTo(User, { foreignKey: 'userId' });

export {
    Property,
    Price,
    Category,
    User,
    Message
};