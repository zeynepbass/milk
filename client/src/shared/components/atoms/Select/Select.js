import { FIELD_BASE_CLASS, FIELD_VARIANTS, Field, fieldAccessibility, useFieldIds } from "../Field/Field";

export function Select({
  label,
  options = [],
  placeholder = "Seçim yapınız",
  error,
  variant = "default",
  className = "",
  wrapperClassName,
  id,
  ref,
  ...props
}) {
  const { fieldId, errorId } = useFieldIds(id);
  const appliedVariant = error ? "error" : variant;

  return (
    <Field label={label} error={error} fieldId={fieldId} errorId={errorId} className={wrapperClassName}>
      <select
        ref={ref}
        id={fieldId}
        {...fieldAccessibility({ error, errorId })}
        {...props}
        className={`${FIELD_BASE_CLASS} py-2 ${FIELD_VARIANTS[appliedVariant]} ${className}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
