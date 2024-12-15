import type { ComponentProps, ForwardedRef } from 'react';
import { forwardRef, createElement, useRef, useState } from 'react';

type DynamicComponentProps<D extends keyof JSX.IntrinsicElements, T> = {
  as?: T;
} & (T extends undefined
  ? ComponentProps<D>
  : T extends keyof JSX.IntrinsicElements
    ? ComponentProps<T>
    : ComponentProps<D>);

type ButtonRootVariants = {
  disabled?: boolean;
};

type ButtonRootProps<T> = Omit<
  DynamicComponentProps<'button', T>,
  keyof ButtonRootVariants
> &
  ButtonRootVariants;

function ButtonRoot<
  T extends keyof JSX.IntrinsicElements | undefined = undefined,
>(
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
    children,
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
    children,
  );
}

export const Button = forwardRef(ButtonRoot) as <
  T extends keyof JSX.IntrinsicElements | undefined = undefined,
>(
  props: ButtonRootProps<T> & { ref?: ForwardedRef<unknown> },
) => JSX.Element;
