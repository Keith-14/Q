import { Card } from "@/components/ui/card";

export const DailyDuaCard = () => {
  return (
    <Card className="rounded-3xl border-none bg-card px-4 py-4 text-foreground shadow-md">
      <h2 className="text-sm font-semibold">Daily Dua</h2>
      <p className="mt-2 text-xs text-muted-foreground">
        "O Allah, I ask You for beneficial knowledge, good provision, and
        acceptable deeds."
      </p>
      <div className="mt-3 flex gap-2 text-[11px]">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
          Arabic
        </span>
        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
          English
        </span>
      </div>
    </Card>
  );
};
