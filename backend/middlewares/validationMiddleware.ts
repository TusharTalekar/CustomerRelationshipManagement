import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params') => 
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req[property]);
    if (error) {
        const { details } = error;
        const message = details.map(i => i.message).join(',');
        console.error("Validation error:", message);
        res.status(422).json({ error: message });
    } else {
        next();
    }
};

export default validate;
