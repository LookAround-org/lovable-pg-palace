
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AddPropertyForm } from '@/components/forms/AddPropertyForm';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AddPropertyForm onSuccess={handleSuccess} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};
