const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let LogSchema = new Schema({
    reportType: String,
    data: Object
});

mongoose.connect('mongodb://127.0.0.1/logs');

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open');
});

export default mongoose.model('errorreport', LogSchema);