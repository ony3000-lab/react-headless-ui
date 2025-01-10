import { Button } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment } from 'react';

export function ComparisonButtonSection() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-medium">Button (@headlessui/react)</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>no options</div>
          <div>
            <Button>Button</Button>
          </div>
        </div>
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>type: &apos;reset&apos;</div>
          <div>
            <Button type="reset">Button</Button>
          </div>
        </div>
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>disabled: true</div>
          <div>
            <Button disabled>Button</Button>
          </div>
        </div>
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>as: &apos;a&apos;</div>
          <div>
            <Button as="a">Button</Button>
          </div>
        </div>
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>using render props</div>
          <div>
            <Button>
              {({ hover, focus, active }) => (
                <>
                  Button (
                  {[
                    hover ? 'hover' : undefined,
                    focus ? 'focus' : undefined,
                    active ? 'active' : undefined,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                  )
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>as: Fragment</div>
          <div>
            <Button as={Fragment}>
              {({ hover, active }) => (
                <button
                  type="button"
                  className={clsx(
                    'rounded px-4 py-2 text-sm text-white',
                    !hover && !active && 'bg-sky-600',
                    hover && !active && 'bg-sky-500',
                    active && 'bg-sky-700',
                  )}
                >
                  Save changes
                </button>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
