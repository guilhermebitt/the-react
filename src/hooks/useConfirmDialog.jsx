import { useState, useCallback } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';

export function useConfirmDialog() {
  const [dialog, setDialog] = useState({
    visible: false,
    message: '',
    resolve: null,
    reject: null,
  });

  const confirm = useCallback((message = 'Are you sure?') => {
    return new Promise((resolve, reject) => {
      setDialog({
        visible: true,
        message,
        resolve,
        reject,
      });
    });
  }, []);

  const handleConfirm = () => {
    dialog.resolve?.(true);
    setDialog(d => ({ ...d, visible: false }));
  };

  const handleCancel = () => {
    dialog.resolve?.(false);
    setDialog(d => ({ ...d, visible: false }));
  };

  const CDComponent = (
    <ConfirmDialog
      visible={dialog.visible}
      message={dialog.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return [CDComponent, confirm];
}
