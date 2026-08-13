// import prisma from "../src/lib/prisma";
// import bcrypt from 'bcrypt'
// import HttpCode from "../src/core/constants";
// import dotenv from 'dotenv/config'
// import { uuidv4 } from "zod";


// const ADMIN = async () => {
//     const email = process.env.ADMIN_EMAIL
//     const password = process.env.ADMIN_PASSWORD
//     const fullName = process.env.ADMIN_FULLNAME

//     if (!email || !password) {
//         return res.status(HttpCode.BAD_REQUEST).json({ message: "Incorrect ADMIN_EMAIL or ADMIN_PASSWORD " })
//     }

//     const emailExist = await prisma.admin.findUnique({
//         where: { email }
//     })

//     if (!emailExist) {
//         return res.status(HttpCode.BAD_REQUEST).json({ message: `An admin with this ${email} already exist` })
//     }

//     const hashPassword = await bcrypt.hash(password, 10)

//     const admin = await prisma.admin.create({
//         data: {
//             id: uuidv4(),
//             email,
//             password: hashPassword,
//             fullName
//         }
//     })
//     return res.status(HttpCode.CREATED).json({message:"Admin created successfully"})


// }