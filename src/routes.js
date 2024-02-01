const express = require('express');
const storyHandler = require('./Handler/storyHandler');
const chapterHandler = require('./Handler/chapterHandler')
const multer = require('multer');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');


router.get('/', storyHandler.homeHandler);
router.get('/stories', storyHandler.storyHandler);
router.get('/story/:storyId', storyHandler.handleSingleStory)
router.patch('/editStory/:storyId', storyHandler.editStoryWithId);
router.delete('/deleteStory/:storyId', storyHandler.deleteStory);

router.post('/add-story', upload, storyHandler.addData);

router.get('/story/chapter/:idStory', chapterHandler.getAllChapterStory)
router.get('/chapter/:idChapter', chapterHandler.getSingleChapter)
router.post('/story/add-chapter/:idStory', chapterHandler.addChapterToStory)
router.patch('/chapter/:idChapter', chapterHandler.updateChapter);
router.delete('/chapter/:idChapter', chapterHandler.deleteChapter);


module.exports = router;


// router.post('/testupload', upload.single('file'), (req, res) => {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send('No file uploaded.');
//     }
//     storyHandler.testUpload(file, res);
//   });