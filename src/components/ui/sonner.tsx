import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast border border-white/10 bg-slate-950 text-slate-50 shadow-2xl",
          description: "text-slate-400",
          actionButton: "bg-blue-500 text-white",
          cancelButton: "bg-slate-800 text-slate-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
