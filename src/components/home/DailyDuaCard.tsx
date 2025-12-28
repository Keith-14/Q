import { Card } from "@/components/ui/card";

export const DailyDuaCard = () => {
  return (
    <Card className="px-5 py-5">
      <h2 className="text-sm font-semibold text-foreground">Daily Dua</h2>
      <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
        "O Allah, I ask You for beneficial knowledge, good provision, and
        acceptable deeds."
      </p>
      <div className="mt-4 flex gap-2">
        <span className="rounded-xl bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          Arabic
        </span>
        <span className="rounded-xl bg-muted px-4 py-1.5 text-xs text-muted-foreground">
          English
        </span>
      </div>
    </Card>
  );
};