import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function SwitchToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [isDark]);

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5 text-yellow-500" />
      <Switch
        checked={isDark}
        onCheckedChange={setIsDark}
        className="relative"
      >
        <span className="absolute left-1 top-1 text-gray-900 dark:hidden">
          <Sun className="h-4 w-4" />
        </span>
        <span className="absolute right-1 top-1 hidden dark:block">
          <Moon className="h-4 w-4 text-white" />
        </span>
      </Switch>
      <Moon className="h-5 w-5 text-gray-500 dark:text-white" />
    </div>
  );
}

