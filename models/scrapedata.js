var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var scrapedataSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var scrapedata = mongoose.model("scrapedata", scrapedataSchema);
module.exports = scrapedata;
