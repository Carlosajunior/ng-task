import { connectionSource } from './datasource';
import { seedSampleData } from './seeds';

async function runSeed() {
  const dataSource = connectionSource;

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected!\n');

    await seedSampleData(dataSource);

    console.log('\n🎉 All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('\n🔌 Database connection closed.');
  }
}

runSeed();
