import React from "react";
import Form from "react-bootstrap/Form";
import {
  ariaDescribedByIds,
  optionId,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils";

export default function RadioWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>({
  id,
  schema,
  options,
  value,
  required,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled } = options;

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange(schema.type == "boolean" ? value !== "false" : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const inline = Boolean(options && options.inline);

  return (
    <Form.Group className="mb-0">
      {Array.isArray(enumOptions) &&
        enumOptions.map((option) => {
          const itemDisabled =
            Array.isArray(enumDisabled) &&
            enumDisabled.indexOf(option.value) !== -1;
          const checked = option.value == value;

          const radio = (
            <Form.Check
              inline={inline}
              label={option.label}
              id={optionId<S>(id, option)}
              key={option.value}
              name={id}
              type="radio"
              disabled={disabled || itemDisabled || readonly}
              checked={checked}
              required={required}
              value={option.value}
              onChange={_onChange}
              onBlur={_onBlur}
              onFocus={_onFocus}
              aria-describedby={ariaDescribedByIds<T>(id)}
            />
          );
          return radio;
        })}
    </Form.Group>
  );
}
