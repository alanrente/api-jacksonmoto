import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Usuario } from "./Models.interface";
import { z } from "zod";

export const ZMecanico = z.object({
  idMecanico: z.number().optional(),
  nome: z.string({ required_error: "nome required" }),
  status: z.number().min(0).max(1).optional(),
  codigo: z.string().length(6).optional(),
});

export type ZMecanicoType = z.infer<typeof ZMecanico>;

export interface IMec
  extends Model<InferAttributes<IMec>, InferCreationAttributes<IMec>>,
    Usuario,
    ZMecanicoType {
  idMecanico: CreationOptional<number>;
}

export const ZParamMecanico = z.object({
  idMecanico: z.number(),
});

export type ZParamMecType = z.infer<typeof ZParamMecanico>;
