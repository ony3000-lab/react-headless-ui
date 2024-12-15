import type { ComponentProps, ForwardedRef } from 'react';
import { forwardRef, createElement } from 'react';

type DynamicComponentProps<D extends keyof JSX.IntrinsicElements, T> = {
  as?: T;
} & (T extends undefined
  ? ComponentProps<D>
  : T extends keyof JSX.IntrinsicElements
    ? ComponentProps<T>
    : ComponentProps<D>);

type ButtonRootVariants = {
  //
};

type ButtonRootProps<T> = Omit<
  DynamicComponentProps<'button', T>,
  keyof ButtonRootVariants
> &
  ButtonRootVariants;

function ButtonRoot<
  T extends keyof JSX.IntrinsicElements | undefined = undefined,
>(
  { as = 'button', children, ...otherProps }: ButtonRootProps<T>,
  ref: ForwardedRef<unknown>,
) {
  return createElement(
    as,
    {
      ref,
      type: 'button',
      ...otherProps,
    },
    children,
  );
}

export const Button = forwardRef(ButtonRoot) as <
  T extends keyof JSX.IntrinsicElements | undefined = undefined,
>(
  props: ButtonRootProps<T> & { ref?: ForwardedRef<unknown> },
) => JSX.Element;
