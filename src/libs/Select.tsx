import type { ComponentProps, ForwardedRef, ReactNode } from 'react';
import { forwardRef, cloneElement, isValidElement, Fragment } from 'react';
import { useHover, useFocusRing, usePress } from 'react-aria';

type SelectOrFragmentProps =
  | ({
      as?: undefined;
    } & ComponentProps<'select'>)
  | {
      as: typeof Fragment;
      children?: ReactNode;
    };

type StaticProps = {
  disabled?: boolean;
  invalid?: boolean;
  children?:
    | ReactNode
    | ((props: {
        hover: boolean;
        focus: boolean;
        active: boolean;
        disabled: boolean;
        invalid: boolean;
      }) => ReactNode);
};

type SelectRootProps = Omit<SelectOrFragmentProps, keyof StaticProps> &
  StaticProps;

function SelectRoot(
  {
    as,
    disabled = false,
    invalid = false,
    children = undefined,
    ...otherProps
  }: SelectRootProps,
  ref: ForwardedRef<unknown>,
) {
  const { hoverProps, isHovered } = useHover({});
  const { focusProps, isFocusVisible } = useFocusRing();
  const { pressProps, isPressed } = usePress({});

  const renderProps = {
    hover: !disabled && isHovered,
    focus: !disabled && isFocusVisible,
    active: !disabled && isPressed,
    disabled,
    invalid,
  };
  const filteredEntries = Object.entries(renderProps).filter(
    ([, propState]) => propState,
  );

  const elementProps = {
    ref,
    disabled,
    ...hoverProps,
    ...focusProps,
    ...pressProps,
    ...otherProps,
    'data-state': filteredEntries.map(([propName]) => propName).join(' '),
    ...Object.fromEntries(
      filteredEntries.map(([propName]) => [`data-${propName}`, '']),
    ),
  };
  const childElement =
    typeof children === 'function' ? children(renderProps) : children;

  return as === undefined ? (
    // @ts-expect-error
    <select {...elementProps}>{childElement}</select>
  ) : (
    // eslint-disable-next-line react/jsx-fragments,react/jsx-no-useless-fragment
    <Fragment>
      {isValidElement(childElement)
        ? cloneElement(childElement, elementProps)
        : childElement}
    </Fragment>
  );
}

export const Select = forwardRef(SelectRoot) as (
  props: SelectRootProps & { ref?: ForwardedRef<unknown> },
) => JSX.Element;
