// Controller functions for handling user-related operations
const fs = require('fs');
const express = require('express');
//create log entry
const createUser =  (req, res) => {
    const content = `${req.body.content} @${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} \n`;

    console.log(content);
    // fs.writeFile('log.txt', content, (err) => {
    fs.appendFile('log.txt', content, (err) => {
        if (err) {
            console.error('Error writting log', err);
            return res.send('Error writing log');
        } 
    });
    console.log('Log created successfully.');
    res.send('Log created successfully.');
};
//register user
const registerUser =  (req, res) => {
    const {name,age} = req.body;
    let user;
    if (!name && age) {
        return res.send('Name and Age are required');
    }
    user = {name,age,balance:777,memberSince:new Date().toLocaleDateString()} ;
    console.log(user);
    fs.appendFile('users.log', JSON.stringify(user) + '\n', (err) => {
        if (err) {
            console.error('Error writting log', err);
            return res.send('failed to create userlog');
        } 
    });
    console.log('account created successfully.');
    res.send(user);
};
//read logs
 const readLog =(req, res) => {
     fs.readFile('log.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log', err);
            return res.send('Failed to read log');
        } 
        res.send({
            success: true,
            data: data
        });
    });  
};
// getusers
const getAllUsers =  (req, res) => {
     fs.readFile('users.log', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log', err);
            return res.send('Failed to read log');
        } 
        const users = data.trim().split('\n').map(line => JSON.parse(line));
        res.send({
            success: true,
            data: users
        });
    });  
};

module.exports = {
    getAllUsers,
    readLog,
    registerUser,
    createUser,
};