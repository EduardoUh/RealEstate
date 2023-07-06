import Jwt from "jsonwebtoken";


const generateId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);
const generateJWT = data => Jwt.sign({ id: data.id, name: data.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

export {
    generateId,
    generateJWT,
}
