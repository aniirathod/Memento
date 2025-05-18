import React from "react";
import { addDays, format, getDay, startOfMonth, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarHeatmapProps {
  data: Record<string, number>;
  startDate?: Date;
  monthsToShow?: number;
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  data,
  startDate = new Date(),
  monthsToShow = 3,
}) => {
  // Calculate dates to display
  const endDate = new Date();
  const today = new Date();
  startDate = startOfMonth(addDays(today, -30 * monthsToShow));

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate days to display in grid
  const days: Date[] = [];
  const startDay = startOfWeek(startDate);
  let currentDate = startDay;

  while (currentDate <= endDate) {
    days.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  // Get color intensity based on activity count
  const getColorIntensity = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count <= 2) return "bg-emerald-500/20";
    if (count <= 5) return "bg-emerald-500/50";
    if (count <= 10) return "bg-emerald-500/70";
    return "bg-emerald-500";
  };

  return (
    <div className="w-full overflow-auto">
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col mr-2 mt-6">
          {dayLabels.map((label, index) => (
            <div key={index} className="h-5 text-xs text-muted-foreground">
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex flex-col flex-1">
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const count = data[dateKey] || 0;
              const isToday =
                format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

              return (
                <div
                  key={dateKey}
                  className={cn(
                    "h-5 w-5 rounded-sm",
                    getColorIntensity(count),
                    isToday && "ring-2 ring-flashlearn-accent"
                  )}
                  title={`${format(day, "MMM d, yyyy")}: ${count} reviews`}
                />
              );
            })}
          </div>

          <div className="mt-2 flex justify-end">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="h-3 w-3 rounded-sm bg-gray-100" />
              <div className="h-3 w-3 rounded-sm bg-flashlearn-teal/20" />
              <div className="h-3 w-3 rounded-sm bg-flashlearn-teal/50" />
              <div className="h-3 w-3 rounded-sm bg-flashlearn-teal/70" />
              <div className="h-3 w-3 rounded-sm bg-flashlearn-teal" />
              <span className="text-xs text-muted-foreground">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeatmap;
