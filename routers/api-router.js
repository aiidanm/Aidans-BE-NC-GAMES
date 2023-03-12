const express = require("express");
const apiRouter = require("express").Router()
const fs = require("fs/promises")


apiRouter.get("/", (req, res, next) => {
    fs.readFile(`${__dirname}/endpoints.json`).then((data) => {
        const endpoints = JSON.parse(data)
        res.status(200).send({endpoints})
      })
})

module.exports = apiRouter;


