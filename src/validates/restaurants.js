import util         from 'util';
import notify       from '../configs/notify';

const options = {
    name:           { min: 5, max: 80 },
    description:    { min: 10, max: 500 },
}



module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

        // description
        req.checkBody('description', util.format(notify.ERROR_NAME, options.description.min, options.description.max) )
        .isLength({ min: options.description.min, max: options.description.max })

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        let message = {};
        errors.map((val,ind) => {
            message[val.param] = val.msg;
        })

        return message;
    }
}