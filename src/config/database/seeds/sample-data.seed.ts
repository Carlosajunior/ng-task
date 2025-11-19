import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/users/entities';
import { Content } from '@/modules/contents/entities';
import { Rating } from '@/modules/ratings/entities';
import { ContentCategory } from '@/modules/contents/enums';

export async function seedSampleData(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);
  const contentRepo = dataSource.getRepository(Content);
  const ratingRepo = dataSource.getRepository(Rating);

  const existingUsers = await userRepo.count();
  if (existingUsers > 0) {
    console.log('⚠️  Database already has data. Skipping seed...');
    console.log(`   Found ${existingUsers} users in database.`);
    return;
  }

  console.log('🌱 Starting sample data seeding...');

  const hashedPassword = await bcrypt.hash('Password@123', 10);

  const user1 = userRepo.create({
    username: 'johndoe',
    email: 'john.doe@example.com',
    password: hashedPassword,
    fullName: 'John Doe',
    status: true,
    ratingCount: 0,
  });
  await userRepo.save(user1);
  console.log('✅ User 1 created: johndoe');

  const user2 = userRepo.create({
    username: 'janedoe',
    email: 'jane.doe@example.com',
    password: hashedPassword,
    fullName: 'Jane Doe',
    status: true,
    ratingCount: 0,
  });
  await userRepo.save(user2);
  console.log('✅ User 2 created: janedoe');

  const user3 = userRepo.create({
    username: 'bobsmith',
    email: 'bob.smith@example.com',
    password: hashedPassword,
    fullName: 'Bob Smith',
    status: true,
    ratingCount: 0,
  });
  await userRepo.save(user3);
  console.log('✅ User 3 created: bobsmith');

  const content1 = contentRepo.create({
    title: 'The Last of Us Part II',
    description:
      'An epic post-apocalyptic action-adventure game with stunning graphics and emotional storytelling.',
    category: ContentCategory.GAME,
    thumbnailUrl: 'https://example.com/images/tlou2-thumbnail.jpg',
    contentUrl: 'https://store.playstation.com/tlou2',
    author: 'Naughty Dog',
    createdBy: user1.id,
    status: true,
  });
  await contentRepo.save(content1);
  console.log('✅ Content 1 created: The Last of Us Part II');

  const content2 = contentRepo.create({
    title: 'Inception - Official Trailer',
    description:
      'A mind-bending thriller trailer about dreams within dreams, directed by Christopher Nolan.',
    category: ContentCategory.VIDEO,
    thumbnailUrl: 'https://example.com/images/inception-thumbnail.jpg',
    contentUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    author: 'Warner Bros. Pictures',
    createdBy: user1.id,
    status: true,
  });
  await contentRepo.save(content2);
  console.log('✅ Content 2 created: Inception - Official Trailer');

  const content3 = contentRepo.create({
    title: 'The Starry Night',
    description:
      'An iconic painting by Vincent van Gogh, depicting a swirling night sky over a village.',
    category: ContentCategory.ARTWORK,
    thumbnailUrl: 'https://example.com/images/starry-night-thumbnail.jpg',
    contentUrl: 'https://www.moma.org/collection/works/79802',
    author: 'Vincent van Gogh',
    createdBy: user2.id,
    status: true,
  });
  await contentRepo.save(content3);
  console.log('✅ Content 3 created: The Starry Night');

  const content4 = contentRepo.create({
    title: 'God of War Ragnarök - Gameplay Walkthrough',
    description:
      'An epic gameplay video showcasing the stunning graphics and combat mechanics of God of War Ragnarök.',
    category: ContentCategory.VIDEO,
    thumbnailUrl: 'https://example.com/images/gow-ragnarok-thumbnail.jpg',
    contentUrl: 'https://www.youtube.com/watch?v=EE-4GvjKcfs',
    author: 'PlayStation',
    createdBy: user2.id,
    status: true,
  });
  await contentRepo.save(content4);
  console.log(
    '✅ Content 4 created: God of War Ragnarök - Gameplay Walkthrough',
  );

  const content5 = contentRepo.create({
    title: 'Bohemian Rhapsody - Queen',
    description:
      'An iconic rock song by Queen, considered one of the greatest songs of all time.',
    category: ContentCategory.MUSIC,
    thumbnailUrl: 'https://example.com/images/bohemian-rhapsody-thumbnail.jpg',
    contentUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    author: 'Queen',
    createdBy: user3.id,
    status: true,
  });
  await contentRepo.save(content5);
  console.log('✅ Content 5 created: Bohemian Rhapsody - Queen');

  console.log('\n🌱 Creating ratings...');

  const rating1 = ratingRepo.create({
    userId: user1.id,
    contentId: content1.id,
    rating: 5,
    comment: 'Absolutely amazing game! The story and graphics are incredible.',
  });
  await ratingRepo.save(rating1);
  await userRepo.increment({ id: user1.id }, 'ratingCount', 1);
  console.log('✅ Rating 1 created: User 1 rated Content 1');

  const rating2 = ratingRepo.create({
    userId: user2.id,
    contentId: content1.id,
    rating: 4,
    comment: 'Great game, but quite emotionally heavy.',
  });
  await ratingRepo.save(rating2);
  await userRepo.increment({ id: user2.id }, 'ratingCount', 1);
  console.log('✅ Rating 2 created: User 2 rated Content 1');

  const rating3 = ratingRepo.create({
    userId: user3.id,
    contentId: content1.id,
    rating: 5,
    comment: 'One of the best games I have ever played!',
  });
  await ratingRepo.save(rating3);
  await userRepo.increment({ id: user3.id }, 'ratingCount', 1);
  console.log('✅ Rating 3 created: User 3 rated Content 1');

  const rating4 = ratingRepo.create({
    userId: user1.id,
    contentId: content2.id,
    rating: 5,
    comment: 'Mind-blowing movie! Nolan is a genius.',
  });
  await ratingRepo.save(rating4);
  await userRepo.increment({ id: user1.id }, 'ratingCount', 1);
  console.log('✅ Rating 4 created: User 1 rated Content 2');

  const rating5 = ratingRepo.create({
    userId: user1.id,
    contentId: content3.id,
    rating: 4,
    comment: 'A chilling and prophetic masterpiece.',
  });
  await ratingRepo.save(rating5);
  await userRepo.increment({ id: user1.id }, 'ratingCount', 1);
  console.log('✅ Rating 5 created: User 1 rated Content 3');

  const rating6 = ratingRepo.create({
    userId: user2.id,
    contentId: content4.id,
    rating: 5,
    comment: 'The best TV series ever created!',
  });
  await ratingRepo.save(rating6);
  await userRepo.increment({ id: user2.id }, 'ratingCount', 1);
  console.log('✅ Rating 6 created: User 2 rated Content 4');

  const rating7 = ratingRepo.create({
    userId: user3.id,
    contentId: content4.id,
    rating: 5,
    comment: 'Absolutely brilliant storytelling!',
  });
  await ratingRepo.save(rating7);
  await userRepo.increment({ id: user3.id }, 'ratingCount', 1);
  console.log('✅ Rating 7 created: User 3 rated Content 4');

  const rating8 = ratingRepo.create({
    userId: user2.id,
    contentId: content5.id,
    rating: 5,
    comment: 'Timeless classic! Freddie Mercury was a legend.',
  });
  await ratingRepo.save(rating8);
  await userRepo.increment({ id: user2.id }, 'ratingCount', 1);
  console.log('✅ Rating 8 created: User 2 rated Content 5');

  console.log('\n✨ Sample data seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - Users: 3');
  console.log('   - Contents: 5');
  console.log('   - Ratings: 8');
  console.log('\n📝 Scenarios covered:');
  console.log(
    '   ✓ Multiple ratings from different users on one content (Content 1: 3 ratings)',
  );
  console.log(
    '   ✓ Multiple ratings from one user on different contents (User 1: 3 ratings)',
  );
  console.log(
    '   ✓ Multiple ratings from different users on one content (Content 4: 2 ratings)',
  );
}
