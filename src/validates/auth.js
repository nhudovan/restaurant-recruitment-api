import util         from 'util';
import notify       from '../configs/notify';

const options = {
    username:    { min: 5, max: 80 },
    password:    { min: 4, max: 20 },
    enum:        ['user'],
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('username', util.format(notify.ERROR_NAME, options.username.min, options.username.max) )
            .isLength({ min: options.username.min, max: options.username.max })

        // email
        req.checkBody('email', util.format(notify.ERROR_EMAIL) )
        .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)

        // role
        req.checkBody('role', util.format(notify.ERROR_ROLE) )
        .isIn(options.enum)

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