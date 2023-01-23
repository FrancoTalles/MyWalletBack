import joi from "joi";

export const entradaSchema = joi.object({
  userId: joi.string().required(),
  valor: joi.number().min(0).required(),
  descricao: joi.string().required(),
  data: joi.string().required(),
  type: joi.string().valid("input").required(),
});

export const saidaSchema = joi.object({
  userId: joi.string().required(),
  valor: joi.number().min(0).required(),
  descricao: joi.string().required(),
  data: joi.string().required(),
  type: joi.string().valid("output").required(),
});
