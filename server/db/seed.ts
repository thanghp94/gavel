import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users, roles, meetings, contentPages } from '@shared/schema';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  console.log('Seeding database...');

  // Create default roles
  const defaultRoles = [
    { name: 'Toastmaster', description: 'The meeting leader who guides the session' },
    { name: 'General Evaluator', description: 'Evaluates the overall meeting quality' },
    { name: 'Table Topics Master', description: 'Conducts impromptu speaking sessions' },
    { name: 'Timer', description: 'Keeps track of speech timing' },
    { name: 'Ah-Counter', description: 'Counts filler words and sounds' },
    { name: 'Grammarian', description: 'Monitors language usage and grammar' },
    { name: 'Sergeant-at-Arms', description: 'Manages meeting logistics' },
    { name: 'Speaker', description: 'Delivers prepared speeches' },
    { name: 'Evaluator', description: 'Provides speech evaluations' },
    { name: 'Gavel Taker', description: 'Assists with meeting roles' },
  ];

  for (const role of defaultRoles) {
    await db.insert(roles).values(role).onConflictDoNothing();
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await db.insert(users).values({
    email: 'admin@gavelflow.com',
    passwordHash: adminPassword,
    displayName: 'Admin User',
    role: 'exco',
  }).onConflictDoNothing();

  // Create sample member
  const memberPassword = await bcrypt.hash('member123', 10);
  await db.insert(users).values({
    email: 'member@gavelflow.com',
    passwordHash: memberPassword,
    displayName: 'John Doe',
    role: 'member',
  }).onConflictDoNothing();

  // Create default content pages
  const defaultPages = [
    {
      slug: 'what-is-gavel-club',
      title: 'What is Gavel Club? - About Meraki Gavel Club of Danang',
      content: 'Welcome to our Gavel Club! We are dedicated to helping members develop their communication and leadership skills.',
      isPublished: true,
    },
    {
      slug: 'how-meetings-work',
      title: 'How does a club meeting work?',
      content: 'Our meetings follow a structured format designed to maximize learning and participation.',
      isPublished: true,
    },
    {
      slug: 'rules-commitment',
      title: 'Rules & Commitment',
      content: 'Learn about our club rules and the commitment we expect from members.',
      isPublished: true,
    },
    {
      slug: 'faq',
      title: 'FAQ',
      content: 'Frequently asked questions about our club and activities.',
      isPublished: true,
    },
    {
      slug: 'contact',
      title: 'Contact',
      content: 'Get in touch with us for more information about joining our club.',
      isPublished: true,
    },
  ];

  for (const page of defaultPages) {
    await db.insert(contentPages).values(page).onConflictDoNothing();
  }

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});