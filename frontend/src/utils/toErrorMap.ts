import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: { [key: string]: string } = {};
  errors.forEach(err => (errorMap[err.field] = err.message));
  return errorMap;
}
