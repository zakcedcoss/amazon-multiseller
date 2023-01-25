import { Card, DoughnutCharts, FlexLayout, TextField, TextStyles } from '@cedcommerce/ounce-ui'
import { useMemo, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import useGetRequests from '../../../hooks/getRequests';

interface TopPieChartType {
    title: string
    colors: string[]
    url: string
}

function TopPieChart({ title, colors, url }: TopPieChartType) {
    const [fromDate, setFromData] = useState("2000-01-01")
    const [toDate, setToData] = useState("2023-01-19")
    const { data, errors } = useGetRequests(url + "?user_id=&id=&target_marketplace=all" + `&from=${fromDate}&to=${toDate}`)
    const reqData = useMemo(() => data?.data?.map((d: any) => d.total), [data])
    const reqLabel = useMemo(() => data?.data?.map((d: any) => {
        if (d._id === null) return `Not Set / ${d.total}`
        return `${d._id} / ${d.total}`
    }), [data])

    const handleDateChange = (e: any) => {
        const startDate = new Intl.DateTimeFormat('en-US').format(e[0]).replaceAll("/", "-")
        const endDate = new Intl.DateTimeFormat('en-US').format(e[1]).replaceAll("/", "-")
        setFromData(startDate)
        setToData(endDate)
    }
    return (
        <Card>
            {!errors[0] ?
                <>
                    <FlexLayout halign="fill" valign="center">
                        <TextStyles fontweight="bold">{title}</TextStyles>
                        <DateRangePicker value={[new Date(fromDate), new Date(toDate)]} onChange={handleDateChange} />
                    </FlexLayout>
                    <div style={{ width: "300px" }}>
                        <DoughnutCharts
                            data={{
                                datasets: [
                                    {
                                        backgroundColor: colors.slice(0, reqData?.length || colors.length),
                                        borderColor: ["white"],
                                        borderWidth: 1,
                                        data: reqData
                                    }
                                ],
                                labels: reqLabel
                            }}
                        />
                    </div>
                </>
                :
                <FlexLayout halign='center' valign='center'>
                    <TextStyles fontweight='bold' textcolor='error'>An Error Occurred!</TextStyles>
                </FlexLayout>
            }
        </Card>
    )
}

export default TopPieChart