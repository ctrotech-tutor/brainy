import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoBlockProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  iconContainerClassName?: string;
  className?: string;
}

export function InfoBlock({
  Icon,
  title,
  description,
  iconContainerClassName,
  className,
}: InfoBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-border bg-card/50 py-20 text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/20 mb-6",
          iconContainerClassName
        )}
      >
        <Icon className="h-10 w-10 text-muted-foreground/60" />
      </div>
      <h3 className="text-xl font-black tracking-tighter text-foreground uppercase">
        {title}
      </h3>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
}
