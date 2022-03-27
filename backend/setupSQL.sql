create database vaccine_app;
use vaccine_app;

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
alter table user
drop column age;
alter table user
ADD column age VARCHAR(3);


create table vaccine_user(
    username VARCHAR(15) REFERENCES user(username),
    manufacturer VARCHAR(25),
    name VARCHAR(25),
    date DATE NOT NULL,
    private BIT DEFAULT TRUE,
    FOREIGN KEY (name,manufacturer) REFERENCES vaccine(name, manufacturer),
    image VARCHAR(110) NOT NULL

);

alter table vaccine_user
DROP column image;

alter table vaccine_user
ADD image VARCHAR(110);

insert into user(first_name, last_name, age, username, password)
VALUES
('Ford', 'Jackson','21', 'fordj626', 'temppass'),
('Leo','Messi', '35','Goat10', 'tp2');

select * from user;

insert into vaccine(name, number_doses, manufacturer)
VALUES
('Covid-19 vaccine', 2, 'Phizer'),
('Covid-19 vaccine', 1, 'J&J');

insert into vaccine_user(username, manufacturer, name, date)
VALUES
('fordj626','Phizer','Covid-19 vaccine','2021-09-04');

select * from user;

delete from user
WHERE username = 'NULL';