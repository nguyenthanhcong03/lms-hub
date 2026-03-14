export interface OrderActionProps {
  onClick: () => void;
  children: React.ReactNode;
}

function OrderAction({ children, onClick }: OrderActionProps) {
  return (
    <button
      className="hover:border/80 dark:hover:border/20 flex size-9 items-center justify-center rounded-md border p-2 text-gray-500 dark:bg-transparent"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default OrderAction;
