drop table chapters;
drop table stories;

CREATE TABLE stories (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  writer VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags TEXT[],
  status VARCHAR,
  synopsis TEXT,
  image VARCHAR(255),
  total_chapters INT DEFAULT 0
);

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  story_id VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file VARCHAR(255),
  FOREIGN KEY (story_id) REFERENCES stories(id)
);

CREATE OR REPLACE FUNCTION update_total_chapters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE stories SET total_chapters = total_chapters + 1 WHERE id = NEW.story_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE stories SET total_chapters = total_chapters - 1 WHERE id = OLD.story_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chapters_after_insert
AFTER INSERT OR DELETE ON chapters
FOR EACH ROW
EXECUTE FUNCTION update_total_chapters();

SELECT
  stories.id AS story_id,
  stories.title AS story_title,
  stories.writer,
  stories.category,
  stories.tags,
  stories.status,
  stories.synopsis,
  chapters.id AS chapter_id,
  chapters.title AS chapter_title,
  chapters.last_update,
  chapters.file
FROM
  stories
JOIN
  chapters ON stories.id = chapters.story_id
WHERE
  stories.id = '1';
select * from stories;
