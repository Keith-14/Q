import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const TodaysVerseCard = () => {
  return (
    <Card className="bg-accent/30 border-0 px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-foreground">Today's Verse</h2>
          <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
            "Indeed, with hardship comes ease." (Qur'an 94:6)
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <BookOpen className="h-5 w-5" strokeWidth={2} />
        </span>
      </div>
    </Card>
  );
};