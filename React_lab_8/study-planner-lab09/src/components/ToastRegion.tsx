import { UNDO_DELAY_MS } from '../constants';
import { useTaskContext } from '../hooks/useTaskContext';
import Toast from './Toast';
import './ToastRegion.scss';

function ToastRegion() {
  const { tasks, toast, pendingDelete, undoDelete, dismissToast } = useTaskContext();

  let deleteMessage = '';
  if (pendingDelete) {
    const [firstId] = pendingDelete.ids;
    const title = tasks.find((task) => task.id === firstId)?.title ?? '';
    deleteMessage =
      pendingDelete.ids.length === 1
        ? `Завдання «${title}» буде видалено`
        : `Буде видалено завдань: ${pendingDelete.ids.length}`;
  }

  return (
    <div className="toast-region">
      {pendingDelete && (
        <Toast
          key={`delete-${pendingDelete.token}`}
          variant="info"
          message={deleteMessage}
          actionLabel="Скасувати"
          onAction={undoDelete}
          progressMs={UNDO_DELAY_MS}
        />
      )}
      {toast && (
        <Toast key={toast.id} message={toast.message} variant={toast.variant} onClose={dismissToast} />
      )}
    </div>
  );
}

export default ToastRegion;
