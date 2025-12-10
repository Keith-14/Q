import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export const TodaysVerseCard = () => {
  return (
    <Card className="rounded-3xl border-none bg-sage-light/40 px-4 py-4 text-foreground shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Today's Verse</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            "Indeed, with hardship comes ease." (Qur'an 94:6)
          </p>
        </div>
        <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-4 w-4" />
        </span>
      </div>
    </Card>
  );
};
