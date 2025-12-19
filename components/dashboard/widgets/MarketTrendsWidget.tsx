export const MarketTrendsWidget = () => {
    const trends = [
        { crop: "Rice", price: "₹2,500/qt", change: "+5%", up: true },
        { crop: "Wheat", price: "₹2,100/qt", change: "-2%", up: false },
        { crop: "Cotton", price: "₹6,000/qt", change: "+1.5%", up: true },
    ];

  return (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-2">
            <span>Crop</span>
            <span>Price</span>
            <span>Change</span>
        </div>
      {trends.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
              <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200">{item.crop}</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-300">{item.price}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.up ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                  {item.change}
              </span>
          </div>
      ))}
    </div>
  );
};
