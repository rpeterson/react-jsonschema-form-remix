import React from "react";
import {
  ariaDescribedByIds,
  EnumOptionsType,
  processSelectValue,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  UIOptionsType,
} from "@rjsf/utils";
import map from "lodash/map";
import { Form, DropdownProps } from "semantic-ui-react";
import { getSemanticProps } from "../util";

/**
 * Returns and creates an array format required for semantic drop down
 * @param {array} enumOptions- array of items for the dropdown
 * @param {array} enumDisabled - array of enum option values to disable
 * @returns {*}
 */
function createDefaultValueOptionsForDropDown<
  S extends StrictRJSFSchema = RJSFSchema
>(
  enumOptions?: EnumOptionsType<S>[],
  enumDisabled?: UIOptionsType["enumDisabled"]
) {
  const disabledOptions = enumDisabled || [];
  const options = map(enumOptions, ({ label, value }) => ({
    disabled: disabledOptions.indexOf(value) !== -1,
    key: label,
    text: label,
    value,
  }));
  return options;
}

/** The `SelectWidget` is a widget for rendering dropdowns.
 *  It is typically used with string properties constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function SelectWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: WidgetProps<T, S, F>) {
  const {
    schema,
    uiSchema,
    formContext,
    id,
    options,
    label,
    required,
    disabled,
    readonly,
    value,
    multiple,
    placeholder,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    rawErrors = [],
  } = props;
  const semanticProps = getSemanticProps<T, S, F>({
    uiSchema,
    formContext,
    options,
    defaultSchemaProps: {
      inverted: "false",
      selection: true,
      fluid: true,
      scrolling: true,
      upward: false,
    },
  });
  const { enumDisabled, enumOptions } = options;
  const emptyValue = multiple ? [] : "";
  const dropdownOptions = createDefaultValueOptionsForDropDown<S>(
    enumOptions,
    enumDisabled
  );
  const _onChange = (
    _: React.SyntheticEvent<HTMLElement>,
    { value }: DropdownProps
  ) => onChange && onChange(processSelectValue(schema, value, options));
  // eslint-disable-next-line no-shadow
  const _onBlur = (
    _: React.FocusEvent<HTMLElement>,
    { target: { value } }: DropdownProps
  ) => onBlur && onBlur(id, processSelectValue(schema, value, options));
  const _onFocus = (
    _: React.FocusEvent<HTMLElement>,
    {
      // eslint-disable-next-line no-shadow
      target: { value },
    }: DropdownProps
  ) => onFocus && onFocus(id, processSelectValue(schema, value, options));

  return (
    <Form.Dropdown
      key={id}
      id={id}
      name={id}
      label={label || schema.title}
      multiple={typeof multiple === "undefined" ? false : multiple}
      value={typeof value === "undefined" ? emptyValue : value}
      error={rawErrors.length > 0}
      disabled={disabled}
      placeholder={placeholder}
      {...semanticProps}
      required={required}
      autoFocus={autofocus}
      readOnly={readonly}
      options={dropdownOptions}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      aria-describedby={ariaDescribedByIds<T>(id)}
    />
  );
}
