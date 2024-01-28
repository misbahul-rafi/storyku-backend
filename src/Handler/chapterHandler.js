const express = require('express');
const pool = require('../database')

const getAllChapterStory = async (req, res) => {
  const idStory = req.params.idStory;
  const query = `
    SELECT
      chapters.id AS chapter_id,
      chapters.title AS chapter_title,
      chapters.last_update,
      chapters.file
    FROM
      chapters
    JOIN
      stories ON chapters.story_id = stories.id
    WHERE
      stories.id = $1`;

  try {
    const result = await pool.query(query, [idStory]);
    const chapters = result.rows;
    res.json(chapters);
  } catch (error) {
    console.error('Error while fetching chapters:', error);
    res.status(500).send('Internal Server Error');
  }
};


const addChapterToStory = async (req, res) => {
  const { story_id, title, file } = req.body;
  if (!story_id || !title || !file) {
    return res.status(400).json({ error: 'Semua field harus diisi' });
  }

  const query = `
    INSERT INTO chapters (story_id, title, file)
    VALUES ($1, $2, $3)
    RETURNING *`;

  try {
    const result = await pool.query(query, [story_id, title, file]);
    const newChapter = result.rows[0];
    res.status(201).json(newChapter);
  } catch (error) {
    console.error('Error while adding chapter:', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateChapter = async (req, res) => {
  const chapterId = req.params.idChapter;
  const { title, file } = req.body;

  if (!title || !file) {
    return res.status(400).json({ error: 'Semua field harus diisi' });
  }

  const query = `
    UPDATE chapters
    SET title = $1, file = $2
    WHERE id = $3
    RETURNING *`;

  try {
    const result = await pool.query(query, [title, file, chapterId]);

    if (result.rows.length > 0) {
      const updatedChapter = result.rows[0];
      res.status(200).json(updatedChapter);
    } else {
      res.status(404).json({ error: 'Chapter not found' });
    }
  } catch (error) {
    console.error('Error while updating chapter:', error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteChapter = async (req, res) => {
  const chapterId = req.params.idChapter;

  if (!chapterId) {
    return res.status(400).json({ error: 'Invalid chapterId' });
  }

  try {
    const result = await pool.query('DELETE FROM chapters WHERE id = $1 RETURNING *', [chapterId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.status(200).json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ message: 'Internal Server Error', details: error.message });
  }
};



const getSingleChapter = (req, res) => {
  res.send("Iya ini Saya")
}

module.exports = {
  getAllChapterStory,
  getSingleChapter,
  addChapterToStory,
  updateChapter,
  deleteChapter
};
