import * as z from 'zod';

const fileResponseSchema = z.object({
  content: z.string().base64(),
  encoding: z.string(),
  name: z.string(),
  path: z.string(),
});

type FileResponse = z.infer<typeof fileResponseSchema>;

export { fileResponseSchema, type FileResponse };
