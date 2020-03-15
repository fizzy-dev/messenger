import {check} from "express-validator/check"; 
import {transValidation} from "./../../lang/vi";

let updateInfo=[
check("email",transValidation.update_username)
.optional()
.isLength({min:3 , max: 17})
.matches(/^[a-zA-Z\-]+$/),
check("gender",transValidation.update_gender)
.optional()
.isIn(["male","female"]),
check("address",transValidation.update_address)
.optional()
.isLength({min:3,max:30}),
check("phone",transValidation.update_phone)
.optional()
.matches(/^(0)[0-9]{9,10}$/)
];

let updatePassword=[
check("currentPassword",transValidation.password_incorrect)
.isLength({min:8})
.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
check("newPassword",transValidation.password_incorrect)
.isLength({min:8})
.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
check("confirmNewPassword",transValidation.password_confirmation_incorrect)
.custom((value,{req})=>{
	return value===req.body.newPassword;
})
];

module.exports={
	updateInfo:updateInfo,
	updatePassword:updatePassword
}