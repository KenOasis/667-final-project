'use strict';
// Part of https://github.com/chris-rock/node-crypto-examples

// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm,password);
  const crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
};
 
exports.decrypt = (text) => {
  const decipher = crypto.createDecipheriv(algorithm,password);
  const dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}
 
// const hw = encrypt("hello world")
// // outputs hello world
// console.log(decrypt(hw));
