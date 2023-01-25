import { BodyLayout, FlexLayout } from "@cedcommerce/ounce-ui"
import TopBarChart from "./TopBarChart";
import TopPieChart from "./TopPieChart";


function Dashboard() {
    const colors = ['rgb(102, 51, 153)', 'rgb(121, 83, 169)', 'rgb(139, 116, 189)', 'rgb(185, 191, 255)', 'rgb(64, 102, 224)', 'rgb(84, 3, 117)']

    return (
        <BodyLayout Layout="Full">
            <FlexLayout direction="vertical" spacing="tight" desktopWidth="100">
                <TopBarChart colors={colors} />
                <div className="pie-grid">
                    <TopPieChart title="User Type" colors={colors} url="/frontend/adminpanelamazonmulti/getUserTypeCount" />
                    <TopPieChart title="Accounts" colors={colors} url="/frontend/adminpanelamazonmulti/getUserConnected" />
                    <TopPieChart title="User Plan" colors={colors} url="/frontend/adminpanelamazonmulti/getUserPlan" />
                    <TopPieChart title="Amazon Location" colors={colors} url="frontend/adminpanelamazonmulti/getAmazonLocation" />
                    <TopPieChart title="Plan" colors={colors} url="/frontend/adminpanelamazonmulti/getPlanDetails" />
                    <TopPieChart title="Total Orders" colors={colors} url="/frontend/adminpanelamazonmulti/getTotalOrders" />
                </div>
            </FlexLayout>
        </BodyLayout>
    )
}

export default Dashboard