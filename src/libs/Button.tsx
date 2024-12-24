import type { ComponentProps, ForwardedRef, ReactNode } from 'react';
import { forwardRef, createElement, useRef, useState } from 'react';

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
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onKeyDown,
    onKeyUp,
    onFocus,
    onBlur,
    children = undefined,
    ...otherProps
  }: ButtonRootProps<T>,
  ref: ForwardedRef<unknown>,
) {
  const lastInteractionRef = useRef<'keyboard' | 'mouse'>('keyboard');
  const [isHover, setIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return createElement(
    as,
    {
      ref,
      type: 'button',
      disabled,
      onMouseEnter: (e: any) => {
        onMouseEnter?.(e);
        if (!disabled) {
          setIsHover(true);
        }
      },
      onMouseLeave: (e: any) => {
        onMouseLeave?.(e);
        if (!disabled) {
          setIsHover(false);
        }
      },
      onMouseDown: (e: any) => {
        onMouseDown?.(e);
        if (!disabled) {
          setIsFocus(false);
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
      onFocus: (e: any) => {
        onFocus?.(e);
        if (!disabled) {
          setIsFocus(lastInteractionRef.current === 'keyboard');
        }
      },
      onBlur: (e: any) => {
        onBlur?.(e);
        if (!disabled) {
          setIsFocus(false);
        }
        lastInteractionRef.current = 'keyboard';
      },
      ...otherProps,
      'data-state': disabled
        ? 'disabled'
        : [
            isHover ? 'hover' : undefined,
            isFocus ? 'focus' : undefined,
            isActive ? 'active' : undefined,
          ]
            .filter(Boolean)
            .join(' '),
      'data-hover': isHover ? '' : undefined,
      'data-focus': isFocus ? '' : undefined,
      'data-active': isActive ? '' : undefined,
      'data-disabled': disabled ? '' : undefined,
    },
    typeof children === 'function'
      ? children({ focus: isFocus, hover: isHover, active: isActive, disabled })
      : children,
  );
}

export const Button = forwardRef(ButtonRoot) as <
  T extends ReactTags = 'button',
>(
  props: ButtonRootProps<T> & { ref?: ForwardedRef<unknown> },
) => JSX.Element;
