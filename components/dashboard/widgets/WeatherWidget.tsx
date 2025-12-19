import { IconSun, IconWind, IconDroplet } from "@tabler/icons-react";

export const WeatherWidget = () => {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between">
        <div>
            <h3 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">28°C</h3>
            <p className="text-neutral-500 dark:text-neutral-400">Sunny</p>
            <p className="text-xs text-neutral-400 mt-1">Bangalore, India</p>
        </div>
        <IconSun className="h-16 w-16 text-yellow-500" />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
            <IconWind className="text-blue-500 h-5 w-5" />
            <div>
                <p className="text-xs text-neutral-500">Wind</p>
                <p className="font-semibold text-sm dark:text-neutral-200">12 km/h</p>
            </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
            <IconDroplet className="text-blue-500 h-5 w-5" />
             <div>
                <p className="text-xs text-neutral-500">Humidity</p>
                <p className="font-semibold text-sm dark:text-neutral-200">65%</p>
            </div>
        </div>
      </div>
    </div>
  );
};
