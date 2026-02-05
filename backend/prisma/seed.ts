import { PrismaClient, UserRole, UserStatus, TicketStatus, TicketPriority } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.message.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: UserRole.ADMIN,
            status: UserStatus.ONLINE,
            skills: ['management', 'technical', 'billing'],
        },
    });

    const agent1 = await prisma.user.create({
        data: {
            email: 'agent1@example.com',
            password: hashedPassword,
            name: 'Sarah Johnson',
            role: UserRole.AGENT,
            status: UserStatus.ONLINE,
            skills: ['technical', 'troubleshooting'],
        },
    });

    const agent2 = await prisma.user.create({
        data: {
            email: 'agent2@example.com',
            password: hashedPassword,
            name: 'Mike Chen',
            role: UserRole.AGENT,
            status: UserStatus.AWAY,
            skills: ['billing', 'account-management'],
        },
    });

    const customer1 = await prisma.user.create({
        data: {
            email: 'customer1@example.com',
            password: hashedPassword,
            name: 'John Doe',
            role: UserRole.CUSTOMER,
            status: UserStatus.OFFLINE,
        },
    });

    const customer2 = await prisma.user.create({
        data: {
            email: 'customer2@example.com',
            password: hashedPassword,
            name: 'Jane Smith',
            role: UserRole.CUSTOMER,
            status: UserStatus.OFFLINE,
        },
    });

    console.log('✅ Created users');

    // Create tickets
    const ticket1 = await prisma.ticket.create({
        data: {
            ticketNumber: 'TKT-1001',
            subject: 'Cannot login to my account',
            description: 'I have been trying to login for the past hour but keep getting an error message saying "Invalid credentials" even though I am sure my password is correct.',
            status: TicketStatus.OPEN,
            priority: TicketPriority.HIGH,
            category: 'Technical',
            tags: ['login', 'authentication'],
            customerId: customer1.id,
            sentiment: 'frustrated',
        },
    });

    const ticket2 = await prisma.ticket.create({
        data: {
            ticketNumber: 'TKT-1002',
            subject: 'Billing question about recent charge',
            description: 'I noticed a charge on my account that I do not recognize. Can you please help me understand what this is for?',
            status: TicketStatus.IN_PROGRESS,
            priority: TicketPriority.MEDIUM,
            category: 'Billing',
            tags: ['billing', 'charges'],
            customerId: customer2.id,
            assignedAgentId: agent2.id,
            sentiment: 'concerned',
        },
    });

    const ticket3 = await prisma.ticket.create({
        data: {
            ticketNumber: 'TKT-1003',
            subject: 'Feature request: Dark mode',
            description: 'It would be great if the application had a dark mode option. My eyes get tired using the bright interface at night.',
            status: TicketStatus.OPEN,
            priority: TicketPriority.LOW,
            category: 'Feature Request',
            tags: ['feature-request', 'ui'],
            customerId: customer1.id,
            sentiment: 'positive',
        },
    });

    const ticket4 = await prisma.ticket.create({
        data: {
            ticketNumber: 'TKT-1004',
            subject: 'App crashes when uploading files',
            description: 'Every time I try to upload a file larger than 5MB, the application crashes. This is very frustrating as I need to upload important documents.',
            status: TicketStatus.IN_PROGRESS,
            priority: TicketPriority.URGENT,
            category: 'Technical',
            tags: ['bug', 'file-upload', 'crash'],
            customerId: customer2.id,
            assignedAgentId: agent1.id,
            sentiment: 'frustrated',
        },
    });

    console.log('✅ Created tickets');

    // Create messages
    await prisma.message.create({
        data: {
            content: 'I have been trying to login for the past hour but keep getting an error message.',
            type: 'CUSTOMER',
            ticketId: ticket1.id,
            authorId: customer1.id,
        },
    });

    await prisma.message.create({
        data: {
            content: 'Thank you for contacting support. I can help you with this billing question.',
            type: 'AGENT',
            ticketId: ticket2.id,
            authorId: agent2.id,
        },
    });

    await prisma.message.create({
        data: {
            content: 'Could you please provide the transaction ID so I can look into this for you?',
            type: 'AGENT',
            ticketId: ticket2.id,
            authorId: agent2.id,
        },
    });

    await prisma.message.create({
        data: {
            content: 'The transaction ID is TXN-98765. Thank you for your help!',
            type: 'CUSTOMER',
            ticketId: ticket2.id,
            authorId: customer2.id,
        },
    });

    await prisma.message.create({
        data: {
            content: 'I am investigating this issue. Can you tell me what browser you are using?',
            type: 'AGENT',
            ticketId: ticket4.id,
            authorId: agent1.id,
        },
    });

    await prisma.message.create({
        data: {
            content: 'I am using Chrome version 120 on Windows 11.',
            type: 'CUSTOMER',
            ticketId: ticket4.id,
            authorId: customer2.id,
        },
    });

    console.log('✅ Created messages');

    console.log('🎉 Seeding complete!');
    console.log('\n📝 Test accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('Agent 1: agent1@example.com / password123');
    console.log('Agent 2: agent2@example.com / password123');
    console.log('Customer 1: customer1@example.com / password123');
    console.log('Customer 2: customer2@example.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
