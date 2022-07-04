--DB NAME: Museum
--USER NAME:temp
--USER PASS:11111111


CREATE TABLE providers(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
);
CREATE TABLE executors(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE finalaccountiong(
    quarter_num int NOT NULL AUTO_INCREMENT,
    total_income decimal NOT NULL,
    total_expenditure decimal NOT NULL,
    total decimal NOT NULL,
    date DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (quarter_num)
);
CREATE TABLE exhibits(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description TEXT,
    provider int NOT NULL,
    expenditure int NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE expenditures(
    id int NOT NULL AUTO_INCREMENT,
    total decimal NOT NULL,
    date DATE NOT NULL DEFAULT (CURRENT_DATE),
    type varchar(255) NOT NULL,
    description TEXT,
    executor int NOT NULL,
    quarter_num int NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE incomes(
    id int NOT NULL AUTO_INCREMENT,
    total decimal NOT NULL,
    date DATE NOT NULL DEFAULT (CURRENT_DATE),
    type varchar(255) NOT NULL,
    description TEXT,
    quarter_num int NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE exhibits
    ADD CONSTRAINT exhibitsProvider_providersId FOREIGN KEY (provider) REFERENCES providers(id);
ALTER TABLE expenditures
    ADD CONSTRAINT expendituresExecutor_executorsId FOREIGN KEY (executor) REFERENCES executors(id);
ALTER TABLE expenditures
    ADD CONSTRAINT expendituresQuarter_finalaccountiong FOREIGN KEY (quarter_num) REFERENCES finalaccountiong(quarter_num);
ALTER TABLE incomes
    ADD CONSTRAINT incomesQuarter_finalaccountiong FOREIGN KEY (quarter_num) REFERENCES finalaccountiong(quarter_num);



ALTER TABLE exhibits
    ADD CONSTRAINT exhibitsExpenditure_ExpenditureId FOREIGN KEY (expenditure) REFERENCES expenditures(id);

--DROP ALL

ALTER TABLE exhibits DROP FOREIGN KEY exhibitsProvider_providersId;
ALTER TABLE expenditures DROP FOREIGN KEY expendituresExecutor_executorsId;
ALTER TABLE expenditures DROP FOREIGN KEY expendituresQuarter_finalaccountiong;
ALTER TABLE incomes DROP FOREIGN KEY incomesQuarter_finalaccountiong;

ALTER TABLE exhibits DROP FOREIGN KEY exhibitsExpenditure_ExpenditureId;




DROP TABLE providers cascade;
DROP TABLE executors cascade;
DROP TABLE finalaccountiong cascade;
DROP TABLE exhibits cascade;
DROP TABLE expenditures cascade;
DROP TABLE incomes cascade;

DROP PROCEDURE SUMMARIZE_QUARTER;



DELIMITER //
CREATE PROCEDURE SUMMARIZE_QUARTER()
BEGIN 
    SELECT MAX(quarter_num) FROM finalaccountiong INTO @last_;     
    SELECT SUM(total) FROM incomes WHERE quarter_num=@last_ INTO @income; 
    IF(@income IS NULL) THEN
        SET @income=0;
    END IF;
    SELECT SUM(total) FROM expenditures WHERE quarter_num=@last_ INTO @expenditures;     
    IF(@expenditures IS NULL) THEN
        SET @expenditures=0;
    END IF;
    UPDATE finalaccountiong SET total_income=@income, total_expenditure=@expenditures, total=(@income-@expenditures), date=CURRENT_DATE WHERE quarter_num=@last_; 
    INSERT INTO finalaccountiong (total_income, total_expenditure, total) VALUES (-1, -1, -1);
END;//
DELIMITER ;

CALL SUMMARIZE_QUARTER();


DELIMITER //
CREATE PROCEDURE GET_PRIMARYS()
BEGIN 

select tab.table_schema as database_name,
       tab.table_name,
       tco.constraint_name as pk_name,
       group_concat(kcu.column_name
            order by kcu.ordinal_position
            separator ', ') as columns
from information_schema.tables tab
left join information_schema.table_constraints tco
          on tab.table_schema = tco.table_schema
          and tab.table_name = tco.table_name
          and tco.constraint_type = 'PRIMARY KEY'
left join information_schema.key_column_usage kcu
          on tco.constraint_schema = kcu.constraint_schema
          and tco.constraint_name = kcu.constraint_name
          and tco.table_name = kcu.table_name
where tab.table_schema not in ('mysql', 'information_schema', 
                                'performance_schema', 'sys')
--  and tab.table_schema = 'schema_name' -- provide schema name here
group by tab.table_schema,
         tab.table_name,
         tco.constraint_name
order by tab.table_schema,
         tab.table_name;

END;//
DELIMITER ;


SHOW FIELDS FROM executors;

SELECT table_name FROM information_schema.tables






create event second_event 
on schedule every 30 day 
do call SUMMARIZE_QUARTER();


select TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_KEY from information_schema.columns 
where table_schema = 'Museum' order by table_name,ordinal_position;


select COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_COLUMN_NAME, REFERENCED_TABLE_NAME from information_schema.KEY_COLUMN_USAGE 
where TABLE_NAME = 'incomes';




select columns.TABLE_NAME, columns.COLUMN_NAME, columns.DATA_TYPE, columns.COLUMN_KEY from information_schema.columns 
where table_schema = 'Museum' order by table_name,ordinal_position t1
LEFT JOIN information_schema.KEY_COLUMN_USAGE
ON (t1.TABLE_NAME=TABLE_NAME and t1.COLUMN_NAME=COLUMN_NAME);


select columns.TABLE_NAME, columns.COLUMN_NAME, columns.DATA_TYPE, columns.COLUMN_KEY from information_schema.columns 
where table_schema = 'Museum' order by table_name,ordinal_position t1
LEFT JOIN (select COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_COLUMN_NAME, REFERENCED_TABLE_NAME, TABLE_NAME from information_schema.KEY_COLUMN_USAGE) t2 ON (t1.TABLE_NAME = t2.TABLE_NAME AND t1.COLUMN_NAME=t2.COLUMN_NAME);



select columns.TABLE_NAME, columns.COLUMN_NAME, columns.DATA_TYPE, columns.COLUMN_KEY from information_schema.columns t1 FULL OUTER JOIN (select KEY_COLUMN_USAGE.COLUMN_NAME as CNAME, KEY_COLUMN_USAGE.CONSTRAINT_NAME AS CONSTRNAME, KEY_COLUMN_USAGE.REFERENCED_COLUMN_NAME, KEY_COLUMN_USAGE.REFERENCED_TABLE_NAME, KEY_COLUMN_USAGE.TABLE_NAME AS TNAME from information_schema.KEY_COLUMN_USAGE) t2 ON (t1.COLUMN_NAME=t2.CNAME AND t1.TABLE_NAME=t2.TNAME);



select T1.TABLE_NAME, T1.COLUMN_NAME, T1.DATA_TYPE, T1.COLUMN_KEY from information_schema.columns T1
LEFT JOIN information_schema.KEY_COLUMN_USAGE T2 ON (T1.COLUMN_NAME=T2.COLUMN_NAME AND T1.TABLE_NAME=T2.TABLE_NAME);
UNION
select T3.TABLE_NAME, T3.COLUMN_NAME, T3.DATA_TYPE, T3.COLUMN_KEY from information_schema.columns T3
RIGHT JOIN information_schema.KEY_COLUMN_USAGE T4 ON (T3.COLUMN_NAME=T4.COLUMN_NAME AND T3.TABLE_NAME=T4.TABLE_NAME);


select T1.TABLE_NAME, T1.COLUMN_NAME, T1.DATA_TYPE, T1.COLUMN_KEY from information_schema.columns T1
LEFT OUTER JOIN information_schema.KEY_COLUMN_USAGE T2 ON (T1.COLUMN_NAME=T2.COLUMN_NAME AND T1.TABLE_NAME=T2.TABLE_NAME);
UNION ALL
select T3.TABLE_NAME, T3.COLUMN_NAME, T3.DATA_TYPE, T3.COLUMN_KEY from information_schema.columns T3
RIGHT OUTER JOIN information_schema.KEY_COLUMN_USAGE T4 ON (T3.COLUMN_NAME=T4.COLUMN_NAME AND T3.TABLE_NAME=T4.TABLE_NAME);




select T1.TABLE_NAME, T1.COLUMN_NAME, T1.DATA_TYPE, T1.COLUMN_KEY from information_schema.columns T1
FULL OUTER JOIN information_schema.KEY_COLUMN_USAGE T2 ON (T1.COLUMN_NAME=T2.COLUMN_NAME AND T1.TABLE_NAME=T2.TABLE_NAME);



UNION
select COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_COLUMN_NAME, REFERENCED_TABLE_NAME, TABLE_NAME from information_schema.KEY_COLUMN_USAGE t1
RIGHT JOIN t2 ON (t1.COLUMN_NAME=KEY_COLUMN_USAGE.COLUMN_NAME AND t1.TABLE_NAME=KEY_COLUMN_USAGE.TABLE_NAME)


SELECT * FROM t1
LEFT JOIN t2 ON t1.id = t2.id
UNION
SELECT * FROM t1
RIGHT JOIN t2 ON t1.id = t2.id




CREATE TABLE TEMP(
    id int NOT NULL AUTO_INCREMENT,
    qq text,
    PRIMARY KEY(id)
);










select T1.TABLE_NAME, T1.COLUMN_NAME, T1.DATA_TYPE, T1.COLUMN_KEY from information_schema.columns T1
LEFT JOIN information_schema.KEY_COLUMN_USAGE T2 ON (T1.COLUMN_NAME=T2.COLUMN_NAME AND T1.TABLE_NAME=T2.TABLE_NAME);
UNION
select T3.TABLE_NAME, T3.COLUMN_NAME, T3.DATA_TYPE, T3.COLUMN_KEY from information_schema.columns T3
RIGHT JOIN information_schema.KEY_COLUMN_USAGE T4 ON (T3.COLUMN_NAME=T4.COLUMN_NAME AND T3.TABLE_NAME=T4.TABLE_NAME);





select T1.TABLE_NAME, T1.COLUMN_NAME, T1.REFERENCED_COLUMN_NAME from information_schema.KEY_COLUMN_USAGE T1
RIGHT JOIN information_schema.columns T2 ON (T1.COLUMN_NAME=T2.COLUMN_NAME AND T1.TABLE_NAME=T2.TABLE_NAME);
UNION
select T3.TABLE_NAME, T3.COLUMN_NAME, T3.DATA_TYPE, T3.COLUMN_KEY from information_schema.columns T3
RIGHT JOIN information_schema.KEY_COLUMN_USAGE T4 ON (T3.COLUMN_NAME=T4.COLUMN_NAME AND T3.TABLE_NAME=T4.TABLE_NAME);



CREATE TABLE A(
    X INT AUTO_INCREMENT,
    Y INT,
    N text,
    PRIMARY KEY(X)
);


CREATE TABLE B(
    X INT AUTO_INCREMENT,
    Z INT,
    N text,
    PRIMARY KEY(X)
);


INSERT INTO A (X, Y) VALUES
(1, 0),
(2, 1),
(3, 11);


INSERT INTO B (X, Z) VALUES
(1, 110),
(2, 30),
(3, 121);

SELECT * FROM A T1
RIGHT JOIN B T2 ON T1.X=T2.X;

SELECT TT.TABLE_NAME FROM 
(select * from information_schema.KEY_COLUMN_USAGE T1
RIGHT JOIN information_schema.columns T2 ON (T1.TABLE_NAME=T2.TABLE_NAME AND T2.TABLE_SCHEMA='Museum' AND T1.COLUMN_NAME=T2.COLUMN_NAME) LIMIT 10) TT;


SELECT * (select * from information_schema.KEY_COLUMN_USAGE T1
RIGHT JOIN (SELECT TABLE_NAME, COLUMN_NAME, TABLE_SCHEMA, DATA_TYPE FROM information_schema.columns) T2 ON (T1.TABLE_NAME=T2.TABLE_NAME AND T2.TABLE_SCHEMA='Museum' AND T1.COLUMN_NAME=T2.COLUMN_NAME) LIMIT 10);


SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE FROM information_schema.columns WHERE TABLE_SCHEMA='Museum';
SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_SCHEMA, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME  FROM information_schema.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA='Museum' AND TABLE_SCHEMA='Museum';

