create database vaccine_app;
use vaccine_app;

create table vaccine(
    name VARCHAR(25),
    number_doses INT DEFAULT 1,
    manufacturer VARCHAR(25),
    PRIMARY KEY (name,manufacturer)
);
CREATE INDEX vaccine_key ON vaccine(name,manufacturer);
ALTER TABLE vaccine
ADD column time_valid INT;



Create index user_index ON user(email);
create table user(
    name VARCHAR(40) NOT NULL,
    age INT NOT NULL,
    username VARCHAR(15) PRIMARY KEY,
    password VARCHAR(100) NOT NULL
);
alter table user
drop column age;
alter table user
ADD column age VARCHAR(3);
alter table user
ADD COLUMN email VARCHAR(20) UNIQUE ;

create table side_affects(
    vacc_name VARCHAR(25) NOT NULL ,
    vacc_manu VARCHAR(25) NOT NULL ,
    side_affect VARCHAR(100) NOT NULL ,
    FOREIGN KEY (vacc_name,vacc_manu) REFERENCES vaccine(name,manufacturer),
    PRIMARY KEY (vacc_name,vacc_manu,side_affect)

);

create table vaccine_user(
    username VARCHAR(15) REFERENCES user(username),
    manufacturer VARCHAR(25),
    name VARCHAR(25),
    date DATE NOT NULL,
    private BIT DEFAULT TRUE,
    image VARCHAR(110) 

);




create table viewer(
    record_holder VARCHAR(15) references user(username), -- user who is adding a viewer
    viewer VARCHAR(15) references user(username), -- username of person to view the account
    relationship VARCHAR(25)
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
insert into side_affects(vacc_name, vacc_manu, side_affect) VALUES
('Covid-19 vaccine', 'J&J', 'Runny nose'),
('Covid-19 vaccine', 'J&J', 'Trouble breathing'),
('Covid-19 vaccine', 'Phizer', 'microchip implanted');

insert into viewer(record_holder, viewer, relationship) VALUES
('fordj626','chefcurry','Manager at work');


create table requirement(
    inst_name VARCHAR(25),
    inst_add VARCHAR(50),
    vacc_name VARCHAR(25),
    vacc_manu VARCHAR(25),
    FOREIGN KEY (inst_name, inst_add) REFERENCES institution(name, address),
    FOREIGN KEY (vacc_name, vacc_manu) REFERENCES vaccine(name, manufacturer)
);


insert into vaccine(name, number_doses, manufacturer)
VALUES ('HPV vaccine', '1', 'Gardasil');

insert into vaccine_user(username, manufacturer, name, date)
VALUES ('DoraN', 'Gardasil', 'HPV vaccine', '2005-10-10');

insert into viewer(record_holder, viewer, relationship) VALUES
('fordj626','KD@kyrieabitch.com','Manager at work');

SELECT manufacturer, name, date FROM vaccine_user WHERE username = 'fordj626' AND (SELECT
      CASE WHEN EXISTS
      (
            SELECT viewer FROM viewer WHERE record_holder = 'Trae' and viewer = 'kd@kyrieabitch.com'
      )
      THEN TRUE
      ELSE FALSE
   END) = TRUE

SELECT first_name, last_name, email, username FROM user WHERE username IN (SELECT record_holder from viewer WHERE viewer = 'kd@kyrieabitch.com');
