// routes/users.js

const database = require("../config/database");
const express = require("express");
const router = express.Router();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users.
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *                       email:
 *                          type: string
 *                          description: The user's email.
 *                          example: test@gmail.com
 */

router.get('/', function (req, res) {
    const sql = "select * from users"
    const params = []
    database.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    })
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single JSONPlaceholder user.
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         require: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Leanne Graham
 *                     email:
 *                       type: string
 *                       description: The user's email.
 *                       example: test@gmail.com
 */

router.get('/:id', function (req, res) {
    const sql = "select * from users where id = ?"
    const params = [req.params.id]
    database.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    })
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a JSONPlaceholder user.
 *     requestBody:
 *        required: true
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: The user's name.
 *                  example: Leanne Graham.
 *                email:
 *                  type: string
 *                  description: The user's email.
 *                  example: test@gmail.com
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Leanne Graham
 *                     email:
 *                       type: string
 *                       description: The user's email.
 *                       example: test@gmail.com
 */

router.post("/", (req, res, next) => {
    const errors = []
    if (!req.body.name) {
        errors.push("No name specified");
    }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({"error": errors.join(",")});
        return;
    }
    const data = {
        name: req.body.name,
        email: req.body.email,
    }
    const sql = "insert into users (name, email) values (?,?)"
    const params = [data.name, data.email]
    database.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a JSONPlaceholder user.
 *     requestBody:
 *        required: true
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  description: The user's id.
 *                  example: 1
 *                name:
 *                  type: string
 *                  description: The user's name.
 *                  example: Leanne Graham.
 *                email:
 *                  type: string
 *                  description: The user's email.
 *                  example: test@gmail.com
 *     responses:
 *       201:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Leanne Graham
 *                     email:
 *                       type: string
 *                       description: The user's email.
 *                       example: test@gmail.com
 */

router.put("/", (req, res, next) => {
    const errors = []

    if (!req.body.id) {
        errors.push("Please input id");
    }

    if (!req.body.name) {
        errors.push("No name specified");
    }

    if (!req.body.email) {
        errors.push("No email specified");
    }

    if (errors.length) {
        res.status(400).json({"error": errors.join(",")});
        return;
    }

    const data = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
    }

    const sql = "update users set name = coalesce(?,name), email = coalesce(?,email) where id = ?"
    const params = [data.name, data.email, data.id]
    database.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            changes: this.changes
        })
    });
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a single JSONPlaceholder user.
 *     description: delete a single JSONPlaceholder user.
 *     parameters:
 *       - in: path
 *         name: id
 *         require: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete was successful.
 */

router.delete("/:id", (req, res, next) => {
    const sql = "delete from users WHERE id = ?"
    const params = [req.params.id]
    database.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({"message": "deleted", changes: this.changes})
    });
})

module.exports = router;