const db = require("./db");

function createTables() {
     db.query("CREATE TABLE IF NOT EXISTS accounts (id INT(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, discord_user_id VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL DEFAULT 'unknown', password VARCHAR(255) NOT NULL, account_creation INT NOT NULL)");
     db.query("CREATE TABLE IF NOT EXISTS sessions (account_id INT (255) NOT NULL, discord_user_id  VARCHAR(255) NOT NULL DEFAULT '0', FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE)");
     db.query("CREATE TABLE IF NOT EXISTS players (account_id INT(255) NOT NULL, health INT(255) NOT NULL DEFAULT 100, max_health INT(255) NOT NULL DEFAULT 100, stammina INT(255) NOT NULL DEFAULT 100, max_stammina INT(255) NOT NULL DEFAULT 100, xp INT(255) NOT NULL DEFAULT 0, next_lvl_xp INT(255) NOT NULL DEFAULT 10, level INT(255) NOT NULL DEFAULT 1,FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE)");
}

module.exports = createTables;