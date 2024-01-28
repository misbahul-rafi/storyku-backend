drop table stories;
drop table chapters;

CREATE TABLE stories (
  id varchar(50) primary key,
  title VARCHAR(255) NOT NULL,
  writer VARCHAR(255) not null,
  category VARCHAR(50) not null,
  tags text[],
  status VARCHAR,
  synopsis TEXT
);

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  story_id VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file VARCHAR(255),
  FOREIGN KEY (story_id) REFERENCES stories(id)
);

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