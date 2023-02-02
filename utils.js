const Crypto = require("crypto");
const db = require("./database/db");

const utils = {
    getSecond: () => {
        return 1000;
    },
    getMinute: () => {
        return this.getSecond() * 60;
    },
    getHour: () => {
        return this.getMinute() * 60;
    },
    getDay: () => {
        return this.getHour() * 24;
    },
    encrypt: (key, data) => {
        const cipher = Crypto.createCipher('aes-256-cbc', key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: (key, data) => {
        try {
            const decipher = Crypto.createDecipher('aes-256-cbc', key);
            let dec = decipher.update(data, 'hex', 'utf8');
            dec += decipher.final('utf8');
            return dec;
        }
        catch (err) {
            return null;
        }
    },
    getAccounts: async (id) => {
        const foundAccounts = await db.query("SELECT * FROM accounts WHERE discord_user_id = ?", [id]);
        return foundAccounts;
    },
    getSessionData: async (id) => {
        const foundSession = await db.query("SELECT * FROM sessions WHERE discord_user_id = ?", [id]);
        if (!foundSession[0]) return null;
        else {
            const acc = await db.query("SELECT * FROM accounts WHERE id = ?", [foundSession[0].account_id]);
            const player = await db.query("SELECT * FROM players WHERE account_id = ?", [acc[0].id]);
            return {
                account: acc[0],
                player: player[0]
            }
        }
    }
};

module.exports = utils;