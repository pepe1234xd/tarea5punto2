const db = require("../db");
const Entity = require("./entity");

class TransacationsEntity extends Entity {
    constructor() {
        const table = 'transactions';
        super(table, 'transaction_id');

        this.sum = async function () {
            const result = await db.query(`SELECT SUM(amount) FROM ${table};`);
            return result.rows[0];
        }
    }
}

module.exports = TransacationsEntity;