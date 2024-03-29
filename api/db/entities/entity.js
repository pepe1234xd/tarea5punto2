const db = require('../db'); // Same require('../db.js)
const humps = require('humps');

/**
 * Represents a table into JavaScript object
 * @param {string} table The name of the table to reference
 * @param {string} fieldId The name of the id field
 */
function Entity(table, fieldId) {

    /**
     * Returns all the available records
     */
    this.all = async function() {
        const result = await db.query(`SELECT * FROM ${table};`);
        return result.rows;
    }

    /**
     * Returns an specific record based in the id
     * @param {number} id The to base the search
     */
     this.get = async function(id) {
        const result = await db.query(`SELECT * FROM ${table} WHERE ${fieldId} = ${id}`);
        return result.rows[0];
    }

    /**
     * Inserts the object ot the designed table.
     * Each key will represent the column name (Will be decalized automatically)
     * Each value will be stored in the corresponding column based on the key
     * @param {Record<string, any>} object The object to be stored
     */
    this.insert = async function(object) {
        // object = {
        //  personId = 1,
        //  name: 'Alfredo',
        //  age: 22,
        // }

        // etr = Object.entries(object)
        // etr = [
        //  [ 'personId', 1 ],
        //  [ 'name', 'Alfredo' ],
        //  [ 'age', 25 ]
        // ]
        
        // Are the same
        //
        // for (let i = 0; i < etr.length; i++) {
        //  const el = etr[i];            
        //  const key = etr[0]        
        //  const value = etr[1]
        // }
        //
        // for (const el of etr) {
        //  const key = etr[0]        
        //  const value = etr[1]
        // }
        //
        // for (const [key, value] of etr) {
        // }
        let columns = '';
        let values = '';
        for (const [key, value] of Object.entries(object)) {
            columns += `${humps.decamelize(key)},`; // personId --> person_id
            values += `${value},`;
        }
        // Removing leading comma
        columns = columns.substring(0, columns.length - 1);
        values = values.substring(0, values.length - 1);

        const result = await db.query(`INSERT INTO ${table}(${columns}) VALUES(${values}) RETURNING ${fieldId};`);
        return result.rows[0];
    }

}

// const entity = new Entity();
// entity instanceof Entity === true
Entity.prototype.constructor = Entity;


module.exports = Entity;