// parser.js

const fs = require('fs');
const path = require('path');
const { Transform, Writable } = require('stream');

class CSVParser extends Transform {
  _transform(chunk, encoding, callback) {
    const rows = chunk.toString().split('\n');
    rows.forEach((row) => {
      const values = row.split(',');
      this.push(values);
    });
    callback();
  }
}

class JSONParser extends Transform {
  _transform(chunk, encoding, callback) {
    try {
      const data = JSON.parse(chunk.toString());
      this.push(data);
    } catch (error) {
      this.emit('error', error);
    }
    callback();
  }
}

class CSVWriter extends Writable {
  constructor(filePath) {
    super();
    this.filePath = filePath;
  }

  _write(chunk, encoding, callback) {
    const fileStream = fs.createWriteStream(this.filePath, { flags: 'a' });
    fileStream.write(chunk.join(',') + '\n');
    fileStream.end();
    callback();
  }
}

class JSONWriter extends Writable {
  constructor(filePath) {
    super();
    this.filePath = filePath;
  }

  _write(chunk, encoding, callback) {
    const data = JSON.stringify(chunk, null, 2) + '\n';
    fs.appendFile(this.filePath, data, (error) => {
      if (error) {
        this.emit('error', error);
      }
      callback();
    });
  }
}

module.exports = {
  CSVParser,
  JSONParser,
  CSVWriter,
  JSONWriter,
};