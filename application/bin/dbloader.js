"use strict";
const mysql = require("mysql2/promise");

function displayWarningMessage(warning) {
  switch (warning.Code) {
    case 1007:
      console.log(`Skipping Database Creation --> ${warning.Message}`);
      break;
    case 1050:
      console.log(`Skipping Table Creation --> ${warning.Message}`);
      break;
  }
}

async function getConnection() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root", //Your DB username
    password: "00000000", //Your DB password
  });
}

async function makeDatabase(connection) {
  //TODO make sure to change yourdbnamehere
  const [result, _] = await connection.query(
    "CREATE DATABASE IF NOT EXISTS sfsudb;"
  );
  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else {
    console.log("Created Database!");
  }
}

async function makeUsersTable(connection) {
  const [result, _] = await connection.query(
    // Users Table SQL Goes here
    `
    CREATE TABLE IF NOT EXISTS sfsudb.users (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(45) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      active INT NOT NULL DEFAULT 1,
      created DATETIME NOT NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
      UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
      UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE)
    ENGINE = InnoDB;
    `
  );

  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else {
    console.log("Created Users Table!");
  }
}

async function makePostsTable(connection) {
  const [result, _] = await connection.query(
    // Posts Table SQL Goes here
    `
    CREATE TABLE IF NOT EXISTS sfsudb.posts (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(128) NOT NULL,
      description MEDIUMTEXT NOT NULL,
      photopath VARCHAR(2048) NOT NULL,
      thumbnail VARCHAR(2048) NOT NULL,
      active INT NOT NULL,
      created DATETIME NOT NULL DEFAULT 1,
      fk_userID INT NOT NULL,
      PRIMARY KEY (id),
      INDEX post__author_idx (fk_userID ASC) VISIBLE,
      CONSTRAINT post__author
        FOREIGN KEY (fk_userID)
        REFERENCES sfsudb.users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE)
    ENGINE = InnoDB;
    `
  );
  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else {
    console.log("Created Posts Table!");
  }
}

async function makeCommentsTable(connection) {
  const [result, _] = await connection.query(
    // Comments Table SQL Goes here
    `
    CREATE TABLE IF NOT EXISTS sfsudb.comments (
      id INT NOT NULL AUTO_INCREMENT,
      comment MEDIUMTEXT NOT NULL,
      fk_postId INT NOT NULL,
      fk_authorId INT NOT NULL,
      created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX comment_author_idx (fk_authorId ASC) VISIBLE,
      INDEX comment_belongsTo_idx (fk_postId ASC) VISIBLE,
      CONSTRAINT comment_author
        FOREIGN KEY (fk_authorId)
        REFERENCES sfsudb.users (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT comment_belongsTo
        FOREIGN KEY (fk_postId)
        REFERENCES sfsudb.posts (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
    ENGINE = InnoDB;
    `
  );
  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else {
    console.log("Created Comments Table!");
  }
}

(async function main() {
  let connection = null;
  try {
    connection = await getConnection();
    await makeDatabase(connection); // make DB
    //TODO make sure to change yourdbnamehere
    await connection.query("USE sfsudb"); // set new DB to the current DB
    await makeUsersTable(connection); // try to make user table
    await makePostsTable(connection); // try to make posts table
    await makeCommentsTable(connection); // try to make comments table
    connection.close();
    return;
  } catch (error) {
    console.error(error);
    if (connection != null) {
      connection.close();
    }
  }
})();
