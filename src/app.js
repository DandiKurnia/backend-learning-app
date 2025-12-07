const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

// Import API routes
const developerJourney = require('./api/developer_journeys/router');
const users = require('./api/users/router');
const developerJourneyTutorials = require('./api/developer_journey_tutorials/router');
const developerJourneyTutorialQuestions = require('./api/developer_journey_tutorial_questions/router');
const tutorialQuestionsOptions = require('./api/tutorial_questions_options/router');
const examRegistrations = require('./api/exam_registrations/router');
const developerJourneyCompletions = require('./api/developer_journey_completions/router');
const userLearningStyles = require('./api/user_learning_styles/router');

// Import cron jobs
const { startLearningStyleCron } = require('./cron/learning_style_cron');




const api = '/api';

// Import the correct middlewares
const notFoundMiddleware = require('./middlewares/not-found');
const handleErrorMiddleware = require('./middlewares/handle-errors');

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to api Learning App'
    });
});

app.use(api, developerJourney);
app.use(api, users);
app.use(api, developerJourneyTutorials);
app.use(api, developerJourneyTutorialQuestions);
app.use(api, tutorialQuestionsOptions);
app.use(api, examRegistrations);
app.use(api, developerJourneyCompletions);
app.use(api, userLearningStyles);

// 404 middleware should be placed after routes
app.use(notFoundMiddleware);

// Error handler middleware should be placed last
app.use(handleErrorMiddleware);

// Set default port if not defined in .env
const Port = process.env.PORT || 3000;

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);

    // Start cron jobs
    startLearningStyleCron();
});