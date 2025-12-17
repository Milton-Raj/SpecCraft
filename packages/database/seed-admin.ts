import { PrismaClient, Role, Plan } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const adminPassword = await bcrypt.hash('12345', 10)
    const demoPassword = await bcrypt.hash('demo', 10)

    // Create 'admin' user
    const admin = await prisma.user.upsert({
        where: { email: 'admin' },
        update: {
            password: adminPassword,
            role: Role.ADMIN
        },
        create: {
            email: 'admin',
            name: 'Admin User',
            password: adminPassword,
            role: Role.ADMIN,
            plan: Plan.PRO,
            isVerified: true
        },
    })
    console.log('Created admin user:', admin.email)

    // Create 'demo' user
    const demo = await prisma.user.upsert({
        where: { email: 'demo' },
        update: {
            password: demoPassword,
            role: Role.USER
        },
        create: {
            email: 'demo',
            name: 'Demo User',
            password: demoPassword,
            role: Role.USER,
            plan: Plan.FREE,
            isVerified: true
        },
    })
    console.log('Created demo user:', demo.email)

    // Create 'admin@speccraft.com' just in case
    const adminEmail = await prisma.user.upsert({
        where: { email: 'admin@speccraft.com' },
        update: {
            password: adminPassword,
            role: Role.ADMIN
        },
        create: {
            email: 'admin@speccraft.com',
            name: 'Admin User Email',
            password: adminPassword,
            role: Role.ADMIN,
            plan: Plan.PRO,
            isVerified: true
        },
    })
    console.log('Created admin email user:', adminEmail.email)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
