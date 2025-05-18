import useFlashcardStore from "@/features/flashcards/store/useFlashcardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import { motion } from "framer-motion";

const Stats = () => {
  const { userStats, flashcards } = useFlashcardStore();

  // Calculate card status distribution
  const rawStatusDistribution = [
    {
      name: "New",
      value: flashcards.filter((card) => card.status === "new").length,
    },
    {
      name: "Learning",
      value: flashcards.filter((card) => card.status === "learning").length,
    },
    {
      name: "Reviewing",
      value: flashcards.filter((card) => card.status === "reviewing").length,
    },
    {
      name: "Mastered",
      value: flashcards.filter((card) => card.status === "mastered").length,
    },
  ];

  const statusDistribution = rawStatusDistribution.filter(
    (entry) => entry.value > 0
  );

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"];

  // Generate data for review history chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(startOfDay(new Date()), i), "yyyy-MM-dd");
    return {
      date,
      dateFormatted: format(subDays(new Date(), i), "MMM dd"),
      reviews: userStats.reviewsByDay[date] || 0,
    };
  }).reverse();

  // Calculate average reviews per day
  const totalReviewDays = Object.keys(userStats.reviewsByDay).length || 1;
  const averageReviewsPerDay = Math.round(
    userStats.totalReviews / totalReviewDays
  );

  // Calculate mastery rate
  const masteryRate =
    flashcards.length > 0
      ? Math.round((userStats.masteredCards / flashcards.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Your Progress</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground text-xs">Total Reviews</div>
              <div className="text-2xl font-bold">{userStats.totalReviews}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground text-xs">Accuracy</div>
              <div className="text-2xl font-bold">{userStats.accuracy}%</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground text-xs">Streak</div>
              <div className="text-2xl font-bold">
                {userStats.streakDays} days
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground text-xs">XP Level</div>
              <div className="text-2xl font-bold">{userStats.level}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last7Days}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dateFormatted" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="reviews"
                      stroke="#0d9488"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-center text-sm text-muted-foreground">
                {averageReviewsPerDay} reviews per day on average
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card status distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flashcards Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex justify-center items-center">
                {flashcards.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {statusDistribution.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} cards`, name]}
                        separator=": "
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No flashcards created yet
                  </div>
                )}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-muted/20 rounded">
                  <p className="text-xs text-muted-foreground">Total Cards</p>
                  <p className="font-bold">{flashcards.length}</p>
                </div>
                <div className="text-center p-2 bg-muted/20 rounded">
                  <p className="text-xs text-muted-foreground">Mastery</p>
                  <p className="font-bold">{masteryRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Calendar heatmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap data={userStats.reviewsByDay} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Stats;
