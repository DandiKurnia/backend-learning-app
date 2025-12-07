const cron = require('node-cron');
const { processLearningStyles } = require('../services/prisma/user_learning_styles');

/**
 * Monthly cron job to process learning styles for all users
 * Runs on the 1st of every month at 2:00 AM
 */
const startLearningStyleCron = () => {
    // Schedule the cron job
    cron.schedule('0 2 1 * *', async () => {
        console.log('Starting monthly learning style processing...');

        try {
            // Get the previous month period
            const today = new Date();
            const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

            const period = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;

            console.log(`Processing learning styles for period: ${period}`);

            const result = await processLearningStyles(period);

            console.log(`Learning style processing completed:`, result);
        } catch (error) {
            console.error('Error in monthly learning style processing:', error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Jakarta" // Adjust to your timezone
    });

    console.log('Monthly learning style cron job scheduled for 1st of every month at 2:00 AM');
};

module.exports = { startLearningStyleCron };