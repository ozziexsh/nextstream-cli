import { PropsWithChildren } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal as RModal } from 'react-responsive-modal';

const maxWidthClass = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
};

export interface ModalProps {
  visible: boolean;
  onClose(): void;
  onAnimationEnd?(): void;
}

export interface JetModalProps extends ModalProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function JetModal({
  maxWidth = '2xl',
  visible,
  onClose,
  onAnimationEnd,
  children,
}: PropsWithChildren<JetModalProps>) {
  return (
    <RModal
      open={visible}
      onClose={onClose}
      focusTrapped={true}
      showCloseIcon={false}
      classNames={{ modal: 'w-full' }}
      onAnimationEnd={onAnimationEnd}
      styles={{
        modal: {
          background: 'inherit',
          boxShadow: 'none',
          maxWidth: 'inherit',
        },
      }}
    >
      <div
        className={`mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full ${maxWidthClass[maxWidth]} sm:mx-auto`}
      >
        {children}
      </div>
    </RModal>
  );
}
