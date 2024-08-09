const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const authRole = require("../middleware/authrole");
const deliveryCtrl = require("../controllers/delivery");

/**
 * @swagger
 * /api/deliveries:
 *  get:
 *    tags:
 *      - Delivery Module
 *    security:
 *      - bearerAuth: []
 *    description: Get all the deliveries from DB
 *    parameters:
 *       - name: page
 *         in: path
 *         description: page number
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *       - name: user
 *         in: path
 *         description: user id to search
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *    delivery:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Deliveries fetched successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *          application/xml:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *      '401':
 *        description: Token expired.
 */
router.get("/", auth, authRole.authRole('driver'), deliveryCtrl.getAllDeliveries);
/**
 * @swagger
 * /api/deliveries/{delivery_id}:
 *  get:
 *    tags:
 *      - Delivery Module
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *       - name: delivery_id
 *         in: path
 *         description: delivery_id to search
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *    description: Get single delivery by delivery id
 *    delivery:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Delivery fetched successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *          application/xml:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *      '401':
 *        description: Token expired.
 *      '404':
 *        description: Ressource not found.
 */
router.get("/:id", auth, authRole.authRole('driver'), deliveryCtrl.getDeliveryById);
/**
 * @swagger
 * /api/deliveries:
 *  post:
 *    tags:
 *      - Delivery Module
 *    description: Create dlivery
 *    requestBody:
 *      description: create delivery
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *        application/xml:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *      required: true
 *    responses:
 *      '201':
 *        description: Ressource created.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *          application/xml:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *      '400':
 *        description: Bad request.
 *    schema:
 * components:
 *  schemas:
 *      Delivery:
 *       type: object
 *       properties:
 *         delivery_id:
 *           type: string
 *           format: string
 *           example: string
 *         package_id:
 *           type: string
 *           format: string
 *           example: string
 *         pickup_time:
 *           type: string
 *           format: date-time
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *              type: string
 *             lng:
 *              type: string
 *         status:
 *           type: string
 *           enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed']
 */
router.post("/", auth, authRole.authRole('driver'), deliveryCtrl.createDelivery);
/**
 * @swagger
 * /api/deliveries/{delivery_id}:
 *  put:
 *    tags:
 *      - Delivery Module
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *       - name: delivery_id
 *         in: path
 *         description: delivery_id to search
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *    description: Update delivery
 *    requestBody:
 *      description: Update delivery
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *        application/xml:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *      required: true
 *    responses:
 *      '201':
 *        description: Ressource updated.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *          application/xml:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *      '400':
 *        description: Bad request.
 *    schema:
 */
router.put("/:id", auth, authRole.authRole('driver'), deliveryCtrl.updateDelivery);
/**
 * @swagger
 * /api/deliveries/{delivery_id}:
 *  delete:
 *    tags:
 *      - Delivery Module
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *       - name: delivery_id
 *         in: path
 *         description: delivery_id to search
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *    description: delete delivery
 *    requestBody:
 *      description: delete delivery
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *        application/xml:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/Delivery'
 *      required: true
 *    responses:
 *      '201':
 *        description: Ressource deleted.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *          application/xml:
 *            schema:
 *              $ref: '#/components/schemas/Delivery'
 *      '400':
 *        description: Bad request.
 *    schema:
 */
router.delete("/:id", auth, authRole.authRole('driver'), deliveryCtrl.deleteDelivery);

module.exports = router;