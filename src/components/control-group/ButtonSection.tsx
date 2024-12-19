import { Button } from '@/libs';

export function ButtonSection() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-medium">Button (hand-made)</h1>
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
          <div>as: &apos;span&apos;</div>
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
      </div>
    </section>
  );
}
