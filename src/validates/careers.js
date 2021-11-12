import util         from 'util';
import notify       from '../configs/notify';

const options = {
    name:     { min: 5, max: 100 },
    title:    { min: 5, max: 100 },
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

        // title
        req.checkBody('title', util.format(notify.ERROR_NAME, options.title.min, options.title.max) )
        .isLength({ min: options.title.min, max: options.title.max })

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        let message = {};
        errors.map((val,ind) => {
            message[val.param] = val.msg;
        })

        return message;
    }
}