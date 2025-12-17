
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.update({
        where: { email: 'admin@speccraft.com' },
        data: { role: 'ADMIN' }
    });
    console.log('Promoted admin@speccraft.com to ADMIN');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
