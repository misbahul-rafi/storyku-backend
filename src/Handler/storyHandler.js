const express = require('express')
const pool = require('../database')
const {nanoid} = require('nanoid')


const homeHandler = (req, res)=>{
    res.send("Halaman Home")
}
const storyHandler = async (req, res) => {
    let response;
    try {
        const allData = await getAllData();
        res.status(200).json(allData);
    } catch (error) {
        console.error('Error fetching data', error);
        res.status(500).send(`<h1>${error}</h1>`);
    }
};
const getAllData = async () => {
    try {
        const result = await pool.query('SELECT * FROM stories');
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
}
const handleSingleStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const singleStory = await getSingleStory(storyId);

        if (singleStory) {
            res.status(200).json(singleStory);
        } else {
            res.status(404).json({ error: 'Story not found' });
        }
    } catch (error) {
        console.error('Error fetching single story', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
const getSingleStory = async (storyId) => {
    try {
        const result = await pool.query('SELECT * FROM stories WHERE id = $1', [storyId]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching single story from database', error);
        throw error;
    }
};
const addData = async (req, res) => {
    try {
      const { title, writer, category, tags, status, synopsis } = req.body;
      const query = `
        INSERT INTO stories (id, title, writer, category, tags, status, synopsis)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const storyId = nanoid(12);
      const values = [storyId, title, writer, category, tags, status, synopsis]; 
      const result = await pool.query(query, values);
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error adding story', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };
  

const editStoryWithId = async (req, res) => {
    try {
        console.log("Edit Jalan...")
        const storyId = req.params.storyId;
        const { title, writer, category, tags, status, synopsis } = req.body;
  
        const query = `
        UPDATE stories
        SET title = $2, writer = $3, category = $4, tags = $5, status = $6, synopsis = $7
        WHERE id = $1
        RETURNING *;
      `;
  
      const values = [storyId, title, writer, category, tags, status, synopsis];
      const result = await pool.query(query, values);
  
      if (result.rows.length > 0) {
        const newData = result.rows[0];
        const response = {
            "Messege" : "Story Berhasil di Ubah",
            "data": {
                "title": newData.title,
                "category": newData.category
            }
        }
        res.status(200).json(response);
        
      } else {
        res.status(404).json({ error: 'Story not found' });
      }
    } catch (error) {
      console.error('Error editing story', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
const deleteStory = async (req, res) => {
    const storyId = req.params.storyId;
    try {
        if (!storyId) {
            return res.status(400).json({ message: 'Invalid storyId' });
        }
        const result = await pool.query('DELETE FROM stories WHERE id = $1 RETURNING *', [storyId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Story not found' });
        }

        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
};


  

module.exports = {
    homeHandler,
    storyHandler,
    handleSingleStory,
    getAllData,
    addData,
    editStoryWithId,
    deleteStory
};