const Datastore = require('nedb');

class GuestBook {

    //call the constructor with the db name for embedded use and without it for in-memory use
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            //in memory 
            this.db = new Datastore();
        }
    }

    //a function to seed the database
    init() {
        this.db.insert({
            subject: 'My Workout Regime',
            contents: 'Mon,Wed,Fri - 30 minutes Cardio & corebody workout.',
            published: '2021-02-16',
            author: 'Peter'
        });
        //for later debugging
        console.log('db entry Peter inserted');

        this.db.insert({
            subject: "My Weekly Workout Plan",
            contents: 'Tues,Thur,Sat - 20 minutes cardio, with 6 sets of Upper body workouts',
            published: '2021-03-18',
            author: 'Ann'
        });
        //for later debugging
        console.log('db entry Ann inserted');
    }

    //a function to return all entries from the database
    getAllEntries() {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
            //use the find() function of the database to get the data, 
            //with error first callback function, err for error, entries for data
            this.db.find({}, function(err, entries) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise and return the data
                } else {
                    resolve(entries);
                    //to see what the returned data looks like
                    console.log('function all() returns: ', entries);
                }
            })
        })
    }

    addEntry(author, subject, contents) {
        var entry = {
            author: author,
            subject: subject,
            contents: contents,
            published: new Date().toISOString().split('T')[0]
        }
        console.log('entry created', entry);

        this.db.insert(entry, function(err, doc) {
            if (err) {
                console.log('Error inserting document', subject);
            } else {
                console.log('document inserted into the database', doc);
            }
        })

    }


    getEntriesByUser(authorName) {
        return new Promise((resolve, reject) => {
            this.db.find({ 'author': authorName }, function(err, entries) {
                if (err) {
                    reject(err);
                } else {
                    resolve(entries);
                    console.log('function getEntriesByUser() returns: ', entries);
                }
            })
        })
    }


    getPetersEntries() {
        //return a Promise object, which can be resolved or rejected
        return new Promise((resolve, reject) => {
            //use the find(author:'Peter) function of the database to retrieve the data, 
            //with error first callback function, err for error, entries for data
            this.db.find({ author: 'Peter' }, function(err, entries) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise and return the data
                } else {
                    resolve(entries);
                    //to see what the returned data looks like
                    console.log('function getPetersEntries() returns: ', entries);
                }
            })
        })
    }





}
//make the module visible outside
module.exports = GuestBook;