import { z } from 'zod';

const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const titleSchema = z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters');

const subtitleSchema = z
    .string()
    .max(255, 'Subtitle must not exceed 255 characters')
    .optional()
    .or(z.literal('')); // Handle empty string as optional

const moreTextSchema = z
    .string()
    .optional()
    .or(z.literal('')); // Handle empty string as optional

const buttonTextSchema = z
    .string()
    .max(255, 'Button text must not exceed 255 characters')
    .optional()
    .or(z.literal('')); // Handle empty string as optional

const buttonUrlSchema = z
    .string()
    .max(255, 'Button URL must not exceed 255 characters')
    .optional()
    .or(z.literal('')); // Handle empty string as optional

const sortorderSchema = z
    .string()
    .min(1, 'Sort order is required')
    .refine((val) => {
        const num = parseInt(val, 10)
        return !isNaN(num) && num >= 1 && num.toString() === val
    }, 'Sort order must be a number greater than 0');

const imageSchema = z.preprocess(
    (value) => {
        if (value instanceof FileList) {
            return value.item(0) ?? undefined;
        }
        if (Array.isArray(value) && value.length > 0) {
            return value[0];
        }
        if (Array.isArray(value) && value.length === 0) {
            return undefined;
        }
        return value;
    },
    z.any() // z.any() to handle undefined values in superRefine
)
    .superRefine((val, ctx) => {
        // check if a file was provided.
        if (!(val instanceof File)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Image is required',
            });

            return; // Exit early if no file is provided.
        }

        // validate the file type.
        if (!allowedImageTypes.includes(val.type)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Only jpeg|png|jpg|webp file allowed',
            });
        }
    });

const optionalImageSchema = z.preprocess(
    (value) => {
        if (value instanceof FileList) {
            return value.item(0) ?? undefined;
        }
        if (Array.isArray(value) && value.length > 0) {
            return value[0];
        }
        if (Array.isArray(value) && value.length === 0) {
            return undefined;
        }
        return value;
    },
    z.any().optional() // z.any() to handle values in superRefine, field can be absent
)
    .superRefine((val, ctx) => {
        // check if a file was provided.
        if (!(val instanceof File)) {
            return; // Exit early if no file is provided.
        }

        // validate the file type.
        if (!allowedImageTypes.includes(val.type)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Only jpeg|png|jpg|webp file allowed',
            });
        }
    });

export const heroAddSchema = z.object({
    title: titleSchema,
    subtitle: subtitleSchema,
    more_text: moreTextSchema,
    button_text: buttonTextSchema,
    button_url: buttonUrlSchema,
    image: imageSchema,
    sortorder: sortorderSchema,
});

export const heroUpdateSchema = z.object({
    title: titleSchema,
    subtitle: subtitleSchema,
    more_text: moreTextSchema,
    button_text: buttonTextSchema,
    button_url: buttonUrlSchema,
    image: optionalImageSchema,
    sortorder: sortorderSchema,
});

export const HeroSectionSchema = z.object({
    tcarousel_itemid: z.string(),
    title: z.string(),
    subtitle: z.string().nullable(),
    more_text: z.string().nullable(),
    button_text: z.string().nullable(),
    button_url: z.string().nullable(),
    imgurl: z.string(),
    sortorder: z.number(),
    last_modified_at: z.string(),
});

export type HeroSectionDisplayType = z.infer<typeof HeroSectionSchema>;
export type HeroAddFormValues = z.infer<typeof heroAddSchema>;
export type HeroUpdateFormValues = z.infer<typeof heroUpdateSchema>;
