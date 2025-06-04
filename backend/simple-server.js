const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Simple server running on http://localhost:${PORT}`);
});
