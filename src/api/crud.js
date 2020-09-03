const express = require('express');
const monk = require('monk');
const joi = require('@hapi/joi');

const db = monk(process.env.MONGO_URI);
const crud = db.get('crud');

const schema = joi.object({
    title: joi.string().trim().required(),
    content: joi.string().trim().required(),
    name: joi.string().trim(),
});

const router = express.Router();

//READ
router.get('/', async (req, res, next) => {
    try {
        const items = await crud.find({});
        res.json(items);
    } catch (error) {
        next(error);
    }
});

//READ One 
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await crud.findOne({
            _id: id,
        });
        if(!item){
            return next();
        } else {
            res.json(item);
        }
    } catch (error) {
        next(error);
    }
});

//Create One
router.post('/',async  (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body);
        const inserted = await crud.insert(value);
        res.json(inserted);
    } catch (error) {
        next(error);
    }
});

//Update
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const value = await schema.validateAsync(req.body);
        const item = await crud.findOne({
            _id: id,
        });
        if(!item){
            return next();
        } else {
            const updated = await crud.update({
                _id:id,
            }, {
                $set: value
            });
            res.json(value);
        }
    } catch (error) {
        next(error);
    }
});

//Delete
router.delete('/:id',async (req, res, next) => {
    try {
        const { id } = req.params;
        await crud.remove({ _id: id });
        res.status(200).send('Success');
    } catch (error) {
        next(error);
    }
});

module.exports = router;