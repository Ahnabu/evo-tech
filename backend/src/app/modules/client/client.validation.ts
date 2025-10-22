import { z } from "zod";

const createClientValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Client name is required",
      })
      .min(1, "Client name cannot be empty"),
    website: z.string().url("Invalid website URL").optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateClientValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Client name cannot be empty").optional(),
    logo: z.string().optional(),
    website: z.string().url("Invalid website URL").optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ClientValidation = {
  createClientValidationSchema,
  updateClientValidationSchema,
};
