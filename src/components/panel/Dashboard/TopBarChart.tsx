import { BarChart, BodyLayout, Card, FlexLayout, TextField, TextStyles } from "@cedcommerce/ounce-ui"
import { useMemo, useState } from "react";
import { DateRangePicker } from 'rsuite';
import useGetRequests from "../../../hooks/getRequests"

interface TopBarChartType {
    colors: string[]
}

function TopBarChart({ colors }: TopBarChartType) {
    const [fromDate, setFromData] = useState("2000-01-01")
    const [toDate, setToData] = useState("2023-01-19")
    const [userName, setUserName] = useState("")

    const { data: orders, errors } = useGetRequests(`/frontend/adminpanelamazonmulti/getUserOrdersCount?from=${fromDate}&to=${toDate}&username=${userName}&target_marketplace=all`);
    // console.log(orders, isLoading, errors, "aaaaaaaaaaa");


    const labels = useMemo(() => orders?.data?.map((d: any) => d["users"]), [orders])
    const pending = useMemo(() => orders?.data?.map((d: any) => d["Pending"] ?? 0), [orders])
    const cancelled = useMemo(() => orders?.data?.map((d: any) => d["Cancelled"] ?? 0), [orders])
    const partiallyCancelled = useMemo(() => orders?.data?.map((d: any) => d["Partially Cancelled"] ?? 0), [orders])
    const failed = useMemo(() => orders?.data?.map((d: any) => d["failed"] ?? 0), [orders])
    const partiallyShipped = useMemo(() => orders?.data?.map((d: any) => d["Partially Shipped"] ?? 0), [orders])
    const partiallyRefund = useMemo(() => orders?.data?.map((d: any) => d["Partially Refund"] ?? 0), [orders])

    function debouncing() {
        let timer: any = null;
        return (...args: any) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                setUserName(args)
            }, 1000)
        }
    }

    const debounce = debouncing();
    const handleDateChange = (e: any) => {
        const startDate = new Intl.DateTimeFormat('en-US').format(e[0]).replaceAll("/", "-")
        const endDate = new Intl.DateTimeFormat('en-US').format(e[1]).replaceAll("/", "-")
        setFromData(startDate)
        setToData(endDate)
    }

    return (
        <Card>
            {!errors[0] ? <><FlexLayout halign="fill" valign="center">
                <TextStyles type="SubHeading" fontweight="bold">Total Order of User</TextStyles>
                <FlexLayout spacing="tight" valign="center">
                    <TextField placeHolder="Username" onChange={(e) => debounce(e)} />
                    <DateRangePicker value={[new Date(fromDate), new Date(toDate)]} onChange={handleDateChange} />
                </FlexLayout>
            </FlexLayout>
                <div style={{ width: "100%", height: "400px" }}>
                    <BarChart
                        data={{
                            datasets: [
                                {
                                    backgroundColor: colors[0],
                                    borderColor: 'rgb(255, 99, 132)',
                                    data: pending,
                                    label: 'Pending',
                                    grouped: false
                                },
                                {
                                    backgroundColor: colors[1],
                                    borderColor: 'rgb(53, 162, 235)',
                                    data: cancelled,
                                    label: 'Cancelled',
                                    grouped: false
                                },
                                {
                                    backgroundColor: colors[2],
                                    borderColor: 'rgb(53, 162, 235)',
                                    data: partiallyCancelled,
                                    label: 'Partially Cancelled',
                                    grouped: false
                                },
                                {
                                    backgroundColor: colors[3],
                                    borderColor: 'rgb(53, 162, 235)',
                                    data: failed,
                                    label: 'failed',
                                    grouped: false
                                },
                                {
                                    backgroundColor: colors[4],
                                    borderColor: 'rgb(53, 162, 235)',
                                    data: partiallyShipped,
                                    label: 'Partially Shipped',
                                    grouped: false
                                },
                                {
                                    backgroundColor: colors[5],
                                    borderColor: 'rgb(53, 162, 235)',
                                    data: partiallyRefund,
                                    label: 'Partially Refund',
                                    grouped: false
                                },
                            ],
                            labels: labels
                        }}
                        options={{
                            plugins: {
                                legend: {
                                    position: 'top'
                                },
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            </> :
                <FlexLayout halign='center' valign='center'>
                    <TextStyles fontweight='bold' textcolor='error'>An Error Occurred!</TextStyles>
                </FlexLayout>
            }
        </Card>
    )
}

export default TopBarChart