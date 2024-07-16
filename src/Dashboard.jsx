import { useContext, useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import ThemeContext from "./ThemeContext";

const fetchData = async () => {
  return {
    lineData: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Recovered Loans",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    },
    barData: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "Loan Applications",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
  };
};

const Dashboard = () => {
  const [data, setData] = useState({ lineData: null, barData: null });
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const { theme, setTheme } = useContext(ThemeContext);

  const dynamicText = `
Stay informed with the latest statistics on loan recovery and applications.

Our data-driven insights help you track performance and make strategic decisions.

Thank you for choosing AssistFin. Together, we achieve success.
`;

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      setData(data);
    };

    getData();
  }, []);

  useEffect(() => {
    if (index < dynamicText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + dynamicText[index]);
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [dynamicText, index]);

  const colorClasses = ["text-black"];

  const getColorClass = (i) => colorClasses[i % colorClasses.length];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 ">
      <h1 className={`text-4xl ${theme === 'light' ?  'text-black' : 'text-white'} font-bold mb-4 text-center`}>
        AssistFin Loan Recovery Dashboard
      </h1>
      <div className={`p-6 ${theme === 'light' ?  'bg-white' : 'bg-black'} shadow rounded m-10 bg-indigo-700`}>
        <h2 className="text-2xl text-white font-semibold mb-2">
          Welcome to AssistFin
        </h2>
        <p className="mb-4 text-black">
          Our dashboard provides real-time analytics and insights into loan
          recovery and application processes. Stay on top of your performance
          metrics and make informed decisions with ease.
        </p>
        {displayText.split("\n\n").map((paragraph, i) => (
          <p key={i} className={`mb-4 ${getColorClass(i)}`}>
            <strong className="font-bold text-white">
              {paragraph.split(".")[0]}.
            </strong>
            {paragraph.split(".").slice(1).join(".")}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="p-4 bg-sky-600 shadow rounded ">
          <h2 className="text-xl text-white font-semibold mb-2">
            Recovered Loans Over Time
          </h2>
          {data.lineData && <Line className="bg-white" data={data.lineData} />}
        </div>
        <div className="p-4 bg-white shadow rounded bg-amber-400">
          <h2 className="text-xl text-white font-semibold mb-2">
            Loan Applications Distribution
          </h2>
          {data.barData && <Bar className="bg-white" data={data.barData} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
