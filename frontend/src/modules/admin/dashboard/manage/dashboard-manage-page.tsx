import MonthlySalesChart from "../components/monthly-sales-chart";
import { ReportOverview } from "../components/overview-metrics";

const DashboardManagePage = () => {
  return (
    <div>
      <ReportOverview />

      <MonthlySalesChart />
    </div>
  );
};

export default DashboardManagePage;
