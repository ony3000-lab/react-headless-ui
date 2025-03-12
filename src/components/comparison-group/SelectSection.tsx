import { Select } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment } from 'react';

export function ComparisonSelectSection() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-medium">Select (@headlessui/react)</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>no options</div>
          <div>
            <Select
              name="status"
              aria-label="Project status"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="delayed">Delayed</option>
              <option value="canceled">Canceled</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>styling using data attributes</div>
          <div>
            <Select
              name="status"
              aria-label="Project status"
              className={clsx(
                `block w-full appearance-none rounded-lg border-none bg-black/5
                px-3 py-1.5 text-sm/6 text-black`,
                `focus:outline-none data-[focus]:outline-2
                data-[focus]:-outline-offset-2 data-[focus]:outline-black/25`,
                'data-[hover]:shadow',
                // Make the text of each option black on Windows
                '*:text-black',
              )}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="delayed">Delayed</option>
              <option value="canceled">Canceled</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-[3fr_5fr] gap-6">
          <div>styling using render props</div>
          <div>
            <Select as={Fragment}>
              {({ focus, hover }) => (
                <select
                  name="status"
                  className={clsx(
                    `block w-full appearance-none rounded-lg border-none
                    bg-black/5 px-3 py-1.5 text-sm/6 text-black
                    focus:outline-none`,
                    focus &&
                      'data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25',
                    hover && 'shadow',
                    // Make the text of each option black on Windows
                    '*:text-black',
                  )}
                  aria-label="Project status"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="delayed">Delayed</option>
                  <option value="canceled">Canceled</option>
                </select>
              )}
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
