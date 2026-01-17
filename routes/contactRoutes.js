const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the contact
 *         firstName:
 *           type: string
 *           description: The contact's first name
 *         lastName:
 *           type: string
 *           description: The contact's last name
 *         email:
 *           type: string
 *           description: The contact's email address
 *         favoriteColor:
 *           type: string
 *           description: The contact's favorite color
 *         birthday:
 *           type: string
 *           format: date
 *           description: The contact's birthday (YYYY-MM-DD)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the contact was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the contact was last updated
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         favoriteColor: blue
 *         birthday: 1990-01-15
 *         createdAt: 2021-06-25T12:00:00.000Z
 *         updatedAt: 2021-06-25T12:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: The contacts managing API
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Returns the list of all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: The list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Internal server error
 */
router.get('/', contactController.getContacts);
router.get('/:id', contactController.getContact);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by id
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact id
 *     responses:
 *       200:
 *         description: The contact data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid contact ID
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - favoriteColor
 *               - birthday
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The contact's first name
 *               lastName:
 *                 type: string
 *                 description: The contact's last name
 *               email:
 *                 type: string
 *                 description: The contact's email address
 *               favoriteColor:
 *                 type: string
 *                 description: The contact's favorite color
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: The contact's birthday (YYYY-MM-DD)
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               email: john.doe@example.com
 *               favoriteColor: blue
 *               birthday: 1990-01-15
 *     responses:
 *       201:
 *         description: The contact was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact created successfully
 *                 id:
 *                   type: string
 *                   example: 60d5ecb74b24c72b8c8b4567
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal server error
 */
router.post('/', contactController.createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact by id
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The contact's first name
 *               lastName:
 *                 type: string
 *                 description: The contact's last name
 *               email:
 *                 type: string
 *                 description: The contact's email address
 *               favoriteColor:
 *                 type: string
 *                 description: The contact's favorite color
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: The contact's birthday (YYYY-MM-DD)
 *             example:
 *               firstName: Jane
 *               lastName: Smith
 *               email: jane.smith@example.com
 *               favoriteColor: green
 *               birthday: 1985-03-20
 *     responses:
 *       200:
 *         description: The contact was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact updated successfully
 *                 modifiedCount:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid contact ID
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', contactController.updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Remove a contact by id
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact id
 *     responses:
 *       200:
 *         description: The contact was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact deleted successfully
 *                 deletedCount:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Invalid contact ID
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', contactController.deleteContact);

module.exports = router;
