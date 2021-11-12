import db          from  '../schemas/users';
import SendEmail   from  '../utils/SendEmail';
import crypto      from  'crypto';
import nodemailer  from  'nodemailer';

module.exports = {
    create : async (item) => {
        const user = await new db(item).save();
        return  await user.getSignedJwtToken();
    },
    login : async (item,res) => {
        const {email , password} = item;
        const result = await db.findByCredentials(email,password);
        if(result.err) {
            res.status(401).json({success : true,massage : result.err});
            return false;
        }
        return await result.user.getSignedJwtToken();
    },
    ForgotPassword :  async (item) => {
        const user = await db.findOne({ email : item.email})
        if(!user) return false;
        const resetToken = user.resetPassword();
        await user.save();

        //creat resetURL
        const resetURL = `/api/v1/auth/resetPassword/${resetToken}`;
        const message = `Truy cập vào link để đổi mật khẩu : ${resetURL}`;
       

        try {
            await SendEmail({
                email : user.email,
                subject : "Thay đổi Password",
                message : message
            })
            return 'Vui lòng check email của bạn';
        } catch (err) {
            user.resetPassToken = undefined,
            user.resetPassTokenExp = undefined,
            await user.save();
            return 'Không thể gửi email , vui lòng thử lại';
        }

    },
    resetPassword : async (item) => {
        const resetPassToken = crypto
            .createHash('sha256')
            .update(item.resetToken)
            .digest('hex');
        
        const user = await db.findOne({
            resetPassToken : resetPassToken,
            resetPassTokenExp : { $gt : Date.now()}
        })

        if(!user) return false;

        user.password           = item.password;
        user.resetPassToken     = undefined,
        user.resetPassTokenExp  = undefined,

        await user.save();
        return user;
       
    },
}