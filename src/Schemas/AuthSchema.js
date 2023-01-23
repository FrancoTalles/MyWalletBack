import joi from "joi";

export const userSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const cadastroSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).max(15).required().label("Password"),
  confirmPassword: joi
    .any()
    .equal(joi.ref("password"))
    .required()
    .label("Confirma password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
});
