
const pool = require('../database')
const {nanoid} = require('nanoid')

const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require ('../../firebase');

const addData = async (req, res) => {
    const { title, writer, category, tags, status, synopsis } = req.body;
    const image = req.file;
    let tagsArray;
    let uploadedImageUrl;

    try {
        if (title === '' || writer === '') {
            const response = {
                'status' : 400,
                'messege': "Masukkan title dan writer"
            }
            return res.status(400).send(response)
        }
        if (tags) {
            tagsArray = tags.split('#').filter(tag => tag.trim() !== '');
        }
        if(image){
            console.log("Upload Image")
            uploadedImageUrl = await uploadImage(title, image);
        }
        const data = {
            'title': title,
            'writer': writer,
            'synopsis': synopsis,
            'tags': tagsArray,
            'category': category,
            'status': status,
            'image': uploadedImageUrl,
        };

        const response = {
            'message': "Data Berhasil Di Upload",
            'data': data,
        };
        console.log(response);

        const result = await addToDatabase(data)
        return res.status(201).send(response);
    } catch (error) {
        console.error("Error handling request: ", error);
        const response = {
            'message': 'Upload Failed',
            'error': error.message,
        };
        res.status(500).send(response);
    }
};
const uploadImage = async (title, image) => {
    const timeStamp = new Date().getTime();
    let downloadUrl;
    try {
        const ext = image.originalname.split('.').pop();
        const imageName = `${title}-${timeStamp}.${ext}`;
        const storageRef = ref(storage, `images/${imageName}`);
        await uploadBytes(storageRef, image.buffer, {
            contentType: image.mimetype,
        }).then((snapshot) => {
            console.log("Uploaded a Blob or File");
        });
        downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading image: ", error);
        return error
    }
}

const addToDatabase = async (data) => {
    const id = nanoid(5)
    const query = `
    INSERT INTO stories (id, title, writer, category, status, tags,  synopsis, image)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
    `;
    const values = [
        id,
        data.title,
        data.writer,
        data.category,
        data.status,
        data.tags,
        data.synopsis,
        data.image
    ]
    const result = await pool.query(query, values)
    return result
}

// const addData = async (req, res) => {
//     try {
//       const { title, writer, category, tags, status, synopsis, image } = req.body;
//       console.log(image);
//       const query = `
//         INSERT INTO stories (id, title, writer, category, tags, status, synopsis)
//         VALUES ($1, $2, $3, $4, $5, $6, $7)
//         RETURNING *;
//       `;
//       const storyId = nanoid(12);
//       const values = [storyId, title, writer, category, tags, status, synopsis]; 
//       const result = await pool.query(query, values);
  
//       res.json(result.rows[0]);
//     } catch (error) {
//       console.error('Error adding story', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   };
const homeHandler = (req, res)=>{
    res.send("Halaman Home")
}
const storyHandler = async (req, res) => {
    const {keyword} = req.query;
    try {
        const allData = await getAllData(keyword);
        res.status(200).json(allData);
    } catch (error) {
        console.error('Error fetching data', error);
        res.status(500).send(`<h1>${error}</h1>`);
    }
};
const getAllData = async (keyword) => {
    try {
        const whereClauses = [];
        const params = [];

        if (keyword) {
            whereClauses.push('(title ILIKE $1 OR writer ILIKE $1)');
            params.push(`%${keyword}%`);
        }
        const whereCondition = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' OR ')}` : '';
        const query = `
            SELECT * FROM stories
            ${whereCondition};
        `;
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
        throw error;
    }
};

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