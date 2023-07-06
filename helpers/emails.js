import nodemailer from 'nodemailer';


const signupEmail = async (data) => {
    // nodemailer se autentifica en mailtrap con las credenciales
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const { name, email, token } = data;
    // console.log(`Name: ${name}\nEmail: ${email}\nToken: ${token}`);
    // usando nodemailer
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirmation instructions for BienesRaices.com account',
        text: 'Confirmation instructions for BienesRaices.com account',
        html: `
            <p>Welcome ${name}!</p>
            <p>Thank you for signing up for BienesRaices.com</p>
            <p>please verify your email address by clicking the link below.</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirm my account</a>
            <p>If you didn't request this, please ignore this email.</p>
        `
    })
}

const forgotPasswordEmail = async (data) => {
    // nodemailer se autentifica en mailtrap con las credenciales
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const { name, email, token } = data;
    // console.log(`Name: ${name}\nEmail: ${email}\nToken: ${token}`);
    // usando nodemailer
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reset your BienesRaices.com account password',
        text: 'Reset your BienesRaices.com account password',
        html: `
            <p>Hi! ${name}</p>
            <p>You have requested to reset your password on BienesRaices.com</p>
            <p>Click on the link below to reset your password:</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Restore password</a>
            <p>If you didn't request this, please ignore this email.</p>
        `
    })
}

export {
    signupEmail,
    forgotPasswordEmail,
}