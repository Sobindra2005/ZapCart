import { database } from '../src/config/database';
import mongoose from 'mongoose';

async function dropIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await database.connect();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    console.log('Listing indexes...');
    const indexes = await db.collection('products').indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));
    
    console.log('\nDropping variants.sku_1 index...');
    try {
      await db.collection('products').dropIndex('variants.sku_1');
      console.log('✅ Index dropped successfully');
    } catch (error: any) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('✅ Index not found (already dropped)');
      } else {
        throw error;
      }
    }
    
    console.log('\nListing indexes after drop...');
    const indexesAfter = await db.collection('products').indexes();
    console.log('Indexes after drop:', JSON.stringify(indexesAfter, null, 2));
    
    await database.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}
