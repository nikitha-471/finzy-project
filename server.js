const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const scenarioRoutes = require('./routes/scenarios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scenarios', scenarioRoutes);

app.get('/', (req, res) => res.send('FINZY Backend Running'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
