CREATE DATABASE websiteDB;

CREATE TABLE
    users (
        UserID SERIAL PRIMARY KEY,
        email VARCHAR(100),
        phonenumber VARCHAR(20),
        PictureID VARCHAR(200),
        pass VARCHAR(200),
        FirstName VARCHAR(40),
        LastName VARCHAR(40)
    );