import { FIELD_BASE_CLASS, FIELD_VARIANTS, Field, fieldAccessibility, useFieldIds } from "../Field/Field";

export function Input({ label, error, variant = "default", className = "", wrapperClassName, id, ref, ...props }) {
  const { fieldId, errorId } = useFieldIds(id);
  const appliedVariant = error ? "error" : variant;

  return (
    <Field label={label} error={error} fieldId={fieldId} errorId={errorId} className={wrapperClassName}>
      <input
        ref={ref}
        id={fieldId}
        {...fieldAccessibility({ error, errorId })}
        {...props}
        className={`${FIELD_BASE_CLASS} py-2 ${FIELD_VARIANTS[appliedVariant]} ${className}`}
      />
    </Field>
  );
}
