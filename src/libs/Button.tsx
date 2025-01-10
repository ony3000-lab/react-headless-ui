import type { ComponentProps, ForwardedRef, ReactNode } from 'react';
import {
  forwardRef,
  createElement,
  cloneElement,
  isValidElement,
  Fragment,
} from 'react';
import { useHover, useFocusRing, usePress } from 'react-aria';

type ReactTags = keyof JSX.IntrinsicElements;

type TagsOrFragment = ReactTags | typeof Fragment;

type DynamicComponentProps<T extends TagsOrFragment> = {
  as?: T;
} & (T extends ReactTags ? ComponentProps<T> : { children?: ReactNode });

type StaticProps = {
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

type ButtonRootProps<T extends TagsOrFragment> = Omit<
  DynamicComponentProps<T>,
  keyof StaticProps
> &
  StaticProps;

function ButtonRoot<T extends TagsOrFragment = 'button'>(
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

  const elementProps = {
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
  };
  const childElement =
    typeof children === 'function' ? children(renderProps) : children;

  return typeof as === 'string' ? (
    createElement(as, elementProps, childElement)
  ) : (
    // eslint-disable-next-line react/jsx-fragments,react/jsx-no-useless-fragment
    <Fragment>
      {isValidElement(childElement)
        ? cloneElement(childElement, elementProps)
        : childElement}
    </Fragment>
  );
}

export const Button = forwardRef(ButtonRoot) as <
  T extends TagsOrFragment = 'button',
>(
  props: ButtonRootProps<T> & { ref?: ForwardedRef<unknown> },
) => JSX.Element;
