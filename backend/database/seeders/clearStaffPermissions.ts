import mongoose from 'mongoose';
import { StaffPermission } from '../../src/app/modules/permission/staff-permission.model';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function clearStaffPermissions() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear all staff permissions since old permission codes are invalid
        const deleteResult = await StaffPermission.deleteMany({});
        console.log(`✅ Cleared ${deleteResult.deletedCount} staff permission assignments`);
        console.log('\n⚠️  Note: You will need to reassign permissions to staff members using the new permission structure.');
        
    } catch (error) {
        console.error('❌ Error clearing staff permissions:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

// Run the script
clearStaffPermissions()
    .then(() => {
        console.log('✅ Staff permissions cleared successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Failed to clear staff permissions:', error);
        process.exit(1);
    });
