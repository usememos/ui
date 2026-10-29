import { Button, Toast } from '@usememos/ui';
import type { SectionProps } from '.';

function Triggers({ size }: SectionProps) {
  const toast = Toast.useToastManager();
  return (
    <div className="pg-row">
      <Button
        size={size}
        onClick={() =>
          toast.add({
            title: 'Note archived',
            description: 'You can find it under Archived.',
            actionProps: { children: 'Undo', onClick: () => toast.add({ title: 'Note restored', type: 'success' }) },
          })
        }
      >
        Archive
      </Button>
      <Button size={size} onClick={() => toast.add({ title: 'Settings saved', type: 'success' })}>
        Save
      </Button>
      <Button size={size} onClick={() => toast.add({ title: 'Storage almost full', description: 'You have used 95% of 1 GB.', type: 'warning' })}>
        Warn
      </Button>
      <Button size={size} onClick={() => toast.add({ title: "Couldn't sync", description: 'Check your connection and try again.', type: 'danger', timeout: 0 })}>
        Fail
      </Button>
    </div>
  );
}

export function ToastSection({ size }: SectionProps) {
  return (
    <Toast.Provider>
      <Triggers size={size} />
      <Toast.Viewport />
    </Toast.Provider>
  );
}
