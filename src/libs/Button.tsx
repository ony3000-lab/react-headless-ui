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
      'data-state': disabled
        ? 'disabled'
        : [
            isHovered ? 'hover' : undefined,
            isFocusVisible ? 'focus' : undefined,
            isPressed ? 'active' : undefined,
          ]
            .filter(Boolean)
            .join(' '),
      'data-hover': isHovered ? '' : undefined,
      'data-focus': isFocusVisible ? '' : undefined,
      'data-active': isPressed ? '' : undefined,
      'data-disabled': disabled ? '' : undefined,
    },
    typeof children === 'function'
      ? children({
          focus: isFocusVisible,
          hover: isHovered,
          active: isPressed,
          disabled,
        })
      : children,
  );
}

export const Button = forwardRef(ButtonRoot) as <
  T extends ReactTags = 'button',
>(
  props: ButtonRootProps<T> & { ref?: ForwardedRef<unknown> },
) => JSX.Element;
