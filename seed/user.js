import bcrypt from 'bcrypt';


const users = [
    {
        name: 'dev',
        email: 'dev@gmail.com',
        confirmed: 1,
        password: bcrypt.hashSync('password', 10)
    }
];

export default users;