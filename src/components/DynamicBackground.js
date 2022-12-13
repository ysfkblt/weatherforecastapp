return (
  <div
    className="dynamic-background"
    style={
      info.condition?.toLowerCase() === "clear"
        ? { backgroundImage: background.clear }
        : info.condition?.toLowerCase() === "sunny"
        ? { backgroundImage: background.sunny }
        : info.condition?.toLowerCase().includes("cloudy")
        ? { backgroundImage: background.cloudy }
        : info.condition?.toLowerCase().includes("rain") ||
          info.condition?.toLowerCase().includes("drizzle")
        ? { backgroundImage: background.rainy }
        : info.condition?.toLowerCase().includes("snow") ||
          info.condition?.toLowerCase().includes("sleet")
        ? { backgroundImage: background.snow }
        : info.condition?.toLowerCase().includes("overcast")
        ? { backgroundImage: background.overcast }
        : { backgroundImage: grad }
    }
  ></div>
);
