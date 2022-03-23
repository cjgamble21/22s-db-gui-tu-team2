create database vaccine_app;


create table vaccine(
    name VARCHAR(25),
    number_doses INT DEFAULT 1,
    manufacturer VARCHAR(25),
    PRIMARY KEY (name,manufacturer)
);
ALTER TABLE vaccine
ADD column time_valid INT;

create table user(
    first_name VARCHAR(15) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    age INT NOT NULL,
    username VARCHAR(15) PRIMARY KEY,
    password VARCHAR(25) NOT NULL
);


create table vaccine_user(
    username VARCHAR(15) REFERENCES user(username),
    manufacturer VARCHAR(25),
    name VARCHAR(25),
    date DATE NOT NULL,
    private BIT DEFAULT TRUE,
    FOREIGN KEY (name,manufacturer) REFERENCES vaccine(name, manufacturer),
    image VARCHAR(110) NOT NULL

);


