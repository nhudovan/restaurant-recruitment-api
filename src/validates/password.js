import util         from 'util';
import notify       from '../configs/notify';

const options = {
    password:    { min: 4, max: 20 },
}

module.exports = {
    validator: (req) => {
        // password
        req.checkBody('password', util.format(notify.ERROR_NAME, options.password.min, options.password.max) )
        .isLength({ min: options.password.min, max: options.password.max })

        let errors = req.validationErrors() !== false ? req.validationErrors() : [];
        let message = {};
        errors.map((val,ind) => {
            message[val.param] = val.msg;
        })

        return message;
    }
}