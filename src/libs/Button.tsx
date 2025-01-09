import type { ComponentProps, ForwardedRef, ReactNode } from 'react';
import { forwardRef, createElement, useRef, useState } from 'react';
import { useHover, useFocusRing } from 'react-aria';

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
    onMouseDown,
    onMouseUp,
    onKeyDown,
    onKeyUp,
    onBlur,
    children = undefined,
    ...otherProps
  }: ButtonRootProps<T>,
  ref: ForwardedRef<unknown>,
) {
  const { hoverProps, isHovered } = useHover({});
  const { focusProps, isFocusVisible } = useFocusRing();

  const lastInteractionRef = useRef<'keyboard' | 'mouse'>('keyboard');
  const [isActive, setIsActive] = useState(false);

  return createElement(
    as,
    {
      ref,
      type: 'button',
      disabled,
      onMouseDown: (e: any) => {
        onMouseDown?.(e);
        if (!disabled) {
          setIsActive(true);
        }
        lastInteractionRef.current = 'mouse';
      },
      onMouseUp: (e: any) => {
        onMouseUp?.(e);
        if (!disabled) {
          setIsActive(false);
        }
      },
      onKeyDown: (e: any) => {
        onKeyDown?.(e);
        if (!disabled) {
          setIsActive(e.code === 'Space');
        }
        lastInteractionRef.current = 'keyboard';
      },
      onKeyUp: (e: any) => {
        onKeyUp?.(e);
        if (!disabled) {
          setIsActive(false);
        }
      },
      onBlur: (e: any) => {
        onBlur?.(e);
        lastInteractionRef.current = 'keyboard';
      },
      ...hoverProps,
      ...focusProps,
      ...otherProps,
      'data-state': disabled
        ? 'disabled'
        : [
            isHovered ? 'hover' : undefined,
            isFocusVisible ? 'focus' : undefined,
            isActive ? 'active' : undefined,
          ]
            .filter(Boolean)
            .join(' '),
      'data-hover': isHovered ? '' : undefined,
      'data-focus': isFocusVisible ? '' : undefined,
      'data-active': isActive ? '' : undefined,
      'data-disabled': disabled ? '' : undefined,
    },
    typeof children === 'function'
      ? children({
          focus: isFocusVisible,
          hover: isHovered,
          active: isActive,
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
