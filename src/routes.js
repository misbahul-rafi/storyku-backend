const express = require('express');
const storyHandler = require('./Handler/storyHandler');
const chapterHandler = require('./Handler/chapterHandler')

const router = express.Router();


router.get('/', storyHandler.homeHandler);
router.get('/stories', storyHandler.storyHandler);

router.get('/story/:storyId', storyHandler.handleSingleStory)

router.post('/add-story', storyHandler.addData)
router.patch('/editStory/:storyId', storyHandler.editStoryWithId);

router.delete('/deleteStory/:storyId', storyHandler.deleteStory);



router.get('/story/chapter/:idStory', chapterHandler.getAllChapterStory)
router.get('/chapter/:idChapter', chapterHandler.getSingleChapter)
router.post('/story/add-chapter/:idStory', chapterHandler.addChapterToStory)
router.patch('/chapter/:idChapter', chapterHandler.updateChapter);
router.delete('/chapter/:idChapter', chapterHandler.deleteChapter);


module.exports = router;