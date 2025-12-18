import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
