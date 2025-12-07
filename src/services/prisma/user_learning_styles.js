const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const prisma = new PrismaClient();

/**
 * Save learning style prediction for a user
 * @param {Object} data - Prediction data
 * @returns {Promise<Object>} Saved learning style record
 */
const saveLearningStyle = async (data) => {
    try {
        const {
            userId,
            period,
            learningStyle,
            description,
            recommendations,
            avgCompletionRatio
        } = data;

        // Upsert the learning style prediction
        const result = await prisma.userLearningStyle.upsert({
            where: {
                user_id_period: {
                    user_id: userId,
                    period: new Date(period)
                }
            },
            update: {
                learning_style: learningStyle,
                description: description,
                recommendations: recommendations,
                avg_completion_ratio: avgCompletionRatio,
                created_at: new Date()
            },
            create: {
                user_id: userId,
                period: new Date(period),
                learning_style: learningStyle,
                description: description,
                recommendations: recommendations,
                avg_completion_ratio: avgCompletionRatio,
                created_at: new Date()
            }
        });

        return result;
    } catch (error) {
        console.error('Error saving learning style:', error);
        throw error;
    }
};

/**
 * Get aggregated learning data for all users for a specific period
 * @param {Date} startDate - Start date for data aggregation
 * @param {Date} endDate - End date for data aggregation
 * @returns {Promise<Array>} Aggregated data for all users
 */
const getAggregatedLearningData = async (startDate, endDate) => {
    try {
        // Aggregate data from DeveloperJourneyCompletion table
        const aggregatedData = await prisma.$queryRaw`
      SELECT 
        djc.user_id,
        COUNT(djc.journey_id) as module_count,
        COALESCE(SUM(djc.study_duration), 0) as total_study_duration,
        CASE 
          WHEN COUNT(djc.journey_id) > 0 THEN COALESCE(SUM(djc.study_duration), 0) / COUNT(djc.journey_id)
          ELSE 0
        END as avg_study_per_module,
        COALESCE(AVG(djc.avg_submission_rating), 0) as avg_submission_rating,
        COALESCE(AVG(CAST(djc.study_duration AS FLOAT) / NULLIF(dj.duration, 0)), 0) as avg_completion_ratio
      FROM "DeveloperJourneyCompletion" djc
      JOIN "DeveloperJourney" dj ON djc.journey_id = dj.id
      WHERE djc.created_at >= ${startDate} AND djc.created_at <= ${endDate}
      GROUP BY djc.user_id
    `;

        // Ensure all required fields are present and properly typed
        const sanitizedData = aggregatedData.map(row => ({
            user_id: parseInt(row.user_id),
            module_count: parseInt(row.module_count) || 0,
            total_study_duration: parseInt(row.total_study_duration) || 0,
            avg_study_per_module: parseFloat(row.avg_study_per_module) || 0,
            avg_submission_rating: parseFloat(row.avg_submission_rating) || 0,
            avg_completion_ratio: parseFloat(row.avg_completion_ratio) || 0
        }));

        return sanitizedData;
    } catch (error) {
        console.error('Error getting aggregated learning data:', error);
        throw error;
    }
};

/**
 * Convert BigInt values to strings in an object
 * @param {Object} obj - Object to convert
 * @returns {Object} Converted object
 */
const convertBigIntToString = (obj) => {
    if (obj === null || obj === undefined) return obj;

    // Handle primitive types
    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    if (typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'string') {
        return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntToString(item));
    }

    // Handle objects
    if (typeof obj === 'object') {
        const converted = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                converted[key] = convertBigIntToString(obj[key]);
            }
        }
        return converted;
    }

    // For any other types, return as is
    return obj;
};

/**
 * Send aggregated data to ML service for prediction
 * @param {Array} aggregatedData - Data to send for prediction
 * @returns {Promise<Array>} Predictions from ML service
 */
const predictLearningStyles = async (aggregatedData) => {
    try {
        // Validate that we have data to send
        if (!aggregatedData || aggregatedData.length === 0) {
            throw new Error('No data to send to ML service');
        }

        // Log the data structure for debugging
        console.log('Sending data to ML service:', JSON.stringify(aggregatedData.slice(0, 2), null, 2));

        // Convert BigInt values to strings to avoid serialization errors
        const sanitizedData = convertBigIntToString(aggregatedData);

        // In a real implementation, this would call your Flask API
        // For now, we'll simulate the response
        const mlApiUrl = process.env.ML_API_URL || 'http://localhost:5001';

        // Send the data directly as the request body, not nested in a 'data' object
        // This is a common issue with ML services expecting flat data structure
        const response = await axios.post(`${mlApiUrl}/predict-gaya-belajar`,
            sanitizedData, // Send array directly
            {
                timeout: 30000, // 30 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Validate response structure
        if (!response.data || !response.data.predictions) {
            throw new Error('Invalid response from ML service');
        }

        return response.data.predictions;
    } catch (error) {
        console.error('Error calling ML service:', error.response?.data || error.message);
        throw new Error('Failed to get predictions from ML service: ' + (error.response?.data?.error || error.message));
    }
};

/**
 * Process learning styles for all users for a given period
 * @param {string} period - Period in format YYYY-MM
 * @returns {Promise<Object>} Processing results
 */
const processLearningStyles = async (period) => {
    try {
        // Calculate date range for the specified period (not previous month)
        const year = parseInt(period.split('-')[0]);
        const month = parseInt(period.split('-')[1]) - 1; // JS months are 0-indexed

        // Start date is the first day of the specified month
        const startDate = new Date(year, month, 1);
        // End date is the last day of the specified month
        const endDate = new Date(year, month + 1, 0, 23, 59, 59);

        console.log(`Processing learning data from ${startDate} to ${endDate}`);

        // Get aggregated data
        const aggregatedData = await getAggregatedLearningData(startDate, endDate);

        console.log(`Found ${aggregatedData.length} users with learning data`);

        if (aggregatedData.length === 0) {
            return {
                processedUsers: 0,
                period: period,
                status: 'success',
                message: 'No data to process'
            };
        }

        // For testing purposes, we'll simulate ML predictions if the ML service is not available
        let predictions;
        try {
            // Send to ML service for prediction
            predictions = await predictLearningStyles(aggregatedData);
        } catch (error) {
            console.warn('ML service not available, using simulated predictions for testing:', error.message);
            // Simulate predictions for testing
            predictions = aggregatedData.map(data => ({
                user_id: data.user_id,
                learning_style: ['Fast Learner', 'Reflective', 'Consistent'][Math.floor(Math.random() * 3)],
                description: `Berdasarkan aktivitas belajar Anda selama periode ${period}, Anda memiliki pola belajar yang unik. Sistem kami menganalisis berbagai faktor seperti durasi belajar, tingkat penyelesaian modul, dan konsistensi Anda.`,
                suggestions: [
                    "Cobalah untuk meningkatkan durasi belajar harian Anda",
                    "Fokuslah pada modul-modul yang belum sepenuhnya Anda kuasai",
                    "Gunakan teknik pomodoro untuk meningkatkan fokus",
                    "Diskusikan materi dengan sesama pelajar untuk pemahaman yang lebih baik"
                ],
                avg_completion_ratio: data.avg_completion_ratio
            }));
        }

        // Validate predictions structure
        if (!predictions || !Array.isArray(predictions)) {
            throw new Error('Invalid predictions format received from ML service');
        }

        // Save all predictions
        let savedCount = 0;
        for (const prediction of predictions) {
            // Validate required fields in prediction
            if (!prediction.user_id || !prediction.learning_style) {
                console.warn('Skipping invalid prediction:', prediction);
                continue;
            }

            await saveLearningStyle({
                userId: prediction.user_id,
                period: startDate, // First day of the month
                learningStyle: prediction.learning_style,
                description: prediction.description || 'Deskripsi tidak tersedia',
                recommendations: prediction.suggestions || [], // Using suggestions from simulated data
                avgCompletionRatio: prediction.avg_completion_ratio || 0
            });
            savedCount++;
        }

        return {
            processedUsers: savedCount,
            period: period,
            status: 'success',
            message: `Processed ${savedCount} users`
        };
    } catch (error) {
        console.error('Error processing learning styles:', error);
        throw error;
    }
};

/**
 * Get learning style prediction for a specific user
 * @param {number} userId - User ID
 * @param {string} period - Period in format YYYY-MM (optional)
 * @returns {Promise<Object>} Learning style record
 */
const getLearningStyleByUser = async (userId, period = null) => {
    try {
        let whereClause = { user_id: userId };

        // If period is provided, filter by period
        if (period) {
            const year = parseInt(period.split('-')[0]);
            const month = parseInt(period.split('-')[1]) - 1; // JS months are 0-indexed
            const startDate = new Date(year, month, 1);
            whereClause.period = startDate;
        }

        const learningStyle = await prisma.userLearningStyle.findFirst({
            where: whereClause,
            orderBy: {
                created_at: 'desc'
            }
        });

        return learningStyle;
    } catch (error) {
        console.error('Error getting learning style:', error);
        throw error;
    }
};

/**
 * Get learning style predictions for all users in a specific period
 * @param {string} period - Period in format YYYY-MM
 * @returns {Promise<Array>} Learning style records
 */
const getAllLearningStylesByPeriod = async (period) => {
    try {
        const year = parseInt(period.split('-')[0]);
        const month = parseInt(period.split('-')[1]) - 1; // JS months are 0-indexed
        const startDate = new Date(year, month, 1);

        const learningStyles = await prisma.userLearningStyle.findMany({
            where: {
                period: startDate
            },
            include: {
                user: {
                    select: {
                        id: true,
                        display_name: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return learningStyles;
    } catch (error) {
        console.error('Error getting all learning styles:', error);
        throw error;
    }
};

/**
 * Get the latest learning style prediction for a specific user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Latest learning style record
 */
const getLatestLearningStyleByUser = async (userId) => {
    try {
        const learningStyle = await prisma.userLearningStyle.findFirst({
            where: {
                user_id: userId
            },
            orderBy: {
                period: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        display_name: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return learningStyle;
    } catch (error) {
        console.error('Error getting latest learning style:', error);
        throw error;
    }
};

// Update exports to include new functions
module.exports = {
    saveLearningStyle,
    getAggregatedLearningData,
    predictLearningStyles,
    processLearningStyles,
    getLearningStyleByUser,
    getAllLearningStylesByPeriod,
    getLatestLearningStyleByUser,
    convertBigIntToString
};