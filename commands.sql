CREATE TABLE blogs(
    id SERIAL PRIMARY KEY,
    author VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT into blogs(author, url, title) values ('Lucas', 'Lucas.com', 'Sueño de un amor');
INSERT into blogs(author, url, title, likes) values ('Juan', 'Juan.com', 'Bunker', 3);