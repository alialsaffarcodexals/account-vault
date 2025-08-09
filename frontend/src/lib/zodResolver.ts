import type { FieldErrors } from 'react-hook-form';
import type { ZodType } from 'zod';

// Minimal replacement for @hookform/resolvers' zodResolver
export function zodResolver<T extends ZodType<any, any>>(schema: T) {
  return async (values: any) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return { values: result.data, errors: {} as FieldErrors };
    }
    const errors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.') as string;
      errors[path] = { type: issue.code, message: issue.message } as any;
    }
    return { values: {}, errors };
  };
}
