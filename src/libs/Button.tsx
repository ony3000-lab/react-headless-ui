import type { ComponentProps, ForwardedRef, ReactNode } from 'react';
import { forwardRef, createElement } from 'react';
import { useHover, useFocusRing, usePress } from 'react-aria';

type ReactTags = keyof JSX.IntrinsicElements;

type DynamicComponentProps<T extends ReactTags> = {
  as?: T;
} & ComponentProps<T>;

type ButtonRootVariants = {
  disabled?: boolean;
  children?:
    | ReactNode
    | ((props: {
        hover: boolean;
        focus: boolean;
        active: boolean;
        disabled: boolean;
      }) => ReactNode);
};

type ButtonRootProps<T extends ReactTags> = Omit<
  DynamicComponentProps<T>,
  keyof ButtonRootVariants
> &
  ButtonRootVariants;

function ButtonRoot<T extends ReactTags = 'button'>(
  {
    as = 'button',
    disabled = false,
    children = undefined,
    ...otherProps
  }: ButtonRootProps<T>,
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
  };
  const filteredEntries = Object.entries(renderProps).filter(
    ([, propState]) => propState,
  );

  return createElement(
    as,
    {
      ref,
      type: 'button',
      disabled,
      ...hoverProps,
      ...focusProps,
      ...pressProps,
      ...otherProps,
      'data-state': filteredEntries.map(([propName]) => propName).join(' '),
      ...Object.fromEntries(
        filteredEntries.map(([propName]) => [`data-${propName}`, '']),
      ),
    },
    typeof children === 'function' ? children(renderProps) : children,
  );
}

export const Button = forwardRef(ButtonRoot) as <
  T extends ReactTags = 'button',
>(
  props: ButtonRootProps<T> & { ref?: ForwardedRef<unknown> },
) => JSX.Element;
