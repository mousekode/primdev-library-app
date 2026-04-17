import prisma from '../configs/database.config.js';
import { faker } from '@faker-js/faker';

async function main() {
  console.log('Menghapus data lama...');
  // Hapus data dengan urutan tertentu untuk menghindari error foreign key constraint
  await prisma.borrowings.deleteMany();
  await prisma.profiles.deleteMany();
  await prisma.books.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.users.deleteMany();

  console.log('Memulai proses seeding...');

  // 1. Seed Categories (5-10 Kategori)
  const categories = [];
  const categoryNames = ['Fiksi', 'Sains', 'Sejarah', 'Teknologi', 'Biografi', 'Komik', 'Religi'];
  
  for (const name of categoryNames) {
    const category = await prisma.categories.create({
      data: { name }
    });
    categories.push(category);
  }

  // 2. Seed Users (25 Data)
  const users = [];
  for (let i = 0; i < 25; i++) {
    const user = await prisma.users.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password123', // Hardcoded untuk mempermudah testing
        role: i === 0 ? 'ADMIN' : 'USER', // Satu admin, sisanya user
        profiles: {
          create: {
            address: faker.location.streetAddress(),
            phone: faker.phone.number(),
          }
        }
      }
    });
    users.push(user);
  }

  // 3. Seed Books (30 Data)
  const books = [];
  for (let i = 0; i < 30; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const book = await prisma.books.create({
      data: {
        title: faker.book.title(),
        author: faker.book.author(),
        year: faker.number.int({ min: 1990, max: 2024 }),
        available: faker.datatype.boolean(0.8), // 80% kemungkinan tersedia
        categoryId: randomCategory.id
      }
    });
    books.push(book);
  }

  // 4. Seed Borrowings (20 Data)
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomBook = books[Math.floor(Math.random() * books.length)];
    
    // Logika sederhana: jika buku tidak tersedia, maka anggap sudah dikembalikan
    const isReturned = !randomBook.available;

    await prisma.borrowings.create({
      data: {
        userId: randomUser.id,
        bookId: randomBook.id,
        borrow_date: faker.date.past(),
        returned_at: isReturned ? faker.date.recent() : null,
      }
    });
  }

  console.log('Seeding selesai berhasil!');
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });