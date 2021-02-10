import { Menu, Transition } from '@headlessui/react';

const alignmentClasses = {
  left: 'origin-top-left left-0',
  right: 'origin-top-right right-0',
  top: 'origin-top',
};

interface Props {
  renderTrigger(props: {
    Trigger: React.ComponentType<{ className?: string }>;
  }): JSX.Element;
  align?: 'left' | 'right' | 'top';
  contentClasses?: string;
  children: (props: { DropdownItem: React.ComponentType }) => JSX.Element;
}

export default function JetDropdown({
  children,
  renderTrigger,
  align = 'right',
  contentClasses = 'py-1 bg-white',
}: Props) {
  return (
    <Menu as={'div'} className={'relative'}>
      {({ open }) => (
        <>
          {renderTrigger({ Trigger: Menu.Button })}
          <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            className={`absolute z-50 mt-2 rounded-md shadow-lg w-48 ${alignmentClasses[align]}`}
          >
            <Menu.Items
              as={'div'}
              className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}
              static
            >
              {children({ DropdownItem: Menu.Item })}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
