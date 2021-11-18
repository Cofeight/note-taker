const path = require('path');
const router = require('express').Router();

//This establishes the get path for the /notes directory
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});
//This establishes the get path for the directory
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
//This defines the index.html as the path if no acceptable path is located
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;