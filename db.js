require('dotenv').config()
const { Database, aql } = require('arangojs')

const host = process.env.ARANGODB_HOST
const port = process.env.ARANGODB_PORT
const database = process.env.ARANGODB_DB
const dbUsername = process.env.ARANGODB_USERNAME
const dbPassword = process.env.ARANGODB_PASSWORD

const arango = new Database({
    url: `http://${dbUsername}:${dbPassword}@${host}:${port}`
});

const testDb = async (arango, db) => {
    try {
        //info('test db')
        let dbnames = await arango.listDatabases();
        if (dbnames.indexOf(db) == -1) {
            await arango.createDatabase(db).then(() => {
                //info("Database created successfully: ", db);
            });
        }
        arango.useDatabase(database);
        return arango;
    } catch (err) { throw err }//{info(err)}	
}

const testCol = async (db, coll) => {
    try {
        let collnames = await db.collections(true);
        let names = collnames.map(collname => {
            let name = collname.name;
            return name;
        });
        // console.log(names)
        let collready = db.collection(coll);
        //collready.truncate();
        if (names.indexOf(coll) == -1) {
            await collready.create();
            //info('create new collection: ', coll )
        }
        return collready;
    } catch (err) { throw err } //{info(err)}
}

const testing = async (arango, database, collname) => {
    try {
        let dbready = await testDb(arango, database);
        let collready = await testCol(dbready, collname);
        return dbready
    } catch (err) { throw err }
}

const dbquery = async (collname, query) => {
    let result
    try {
        //console.log(collname);
        let dbready = await testing(arango, database, collname)
        let cursor = await dbready.query(query);
        result = await cursor.all();
    } catch (err) {
        //info(err)
        result = false
    }
    return result
}

const dbcheck = async (collname, doc) => {
    let result
    try {
        //console.log(collname);
        let dbready = await testing(arango, database, collname)
        let cursor = await dbready.query({
            query: 'FOR p IN @@collname FILTER CONTAINS(p._key, @_key) RETURN p',
            bindVars: {
                "@collname": collname,
                _key: doc._key
            }
        });
        let res = await cursor.all();
        result = res[0]
    } catch (err) {
        //info(err)
        result = false
    }
    return result
}

const upsert = async (collname, doc) => {
    try {
        //console.log(collname);
        let dbready = await testing(arango, database, collname)
        let cursor = await dbready.query({
            query: 'UPSERT { _key : @_key } INSERT @doc UPDATE @doc IN @@collname RETURN { OLD, NEW }',
            bindVars: {
                "@collname": collname,
                _key: doc._key,
                doc: doc
            }
        });
        let result = await cursor.all();
        return result[0];
    } catch (err) { throw err }//{info(err)}
}

const replace = async (collname, doc) => {
    try {
        //console.log(collname);
        let dbready = await testing(arango, database, collname)
        let cursor = await dbready.query({
            query: 'REPLACE @doc IN @@collname RETURN { OLD, NEW }',
            bindVars: {
                "@collname": collname,
                //				_key: doc._key,
                doc: doc
            }
        });
        let result = await cursor.all();
        return result[0];
    } catch (err) { throw err }//{info(err)}
}

const length = async (collname) => {
    try {
        let dbready = await testing(arango, database, collname)
        let cursor = await dbready.query(`RETURN LENGTH(${collname})`)
        let result = await cursor.all()
        return result
    } catch (err) { throw err }
}

const query = async (aq) => {
    try {
        //info('start')
        let dbready = await testDb(arango, database);
        let cursor = await dbready.query(aq);
        let res = await cursor.all();
        //info(res)

        //info(cursor._result);
        return res;
    } catch (err) {
        //info(err)
    }
}


module.exports = {
    arango,
    database,
    testDb,
    dbcheck,
    upsert,
    length,
    dbquery,
    aql,
    query,
    replace
}
