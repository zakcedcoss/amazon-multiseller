import { Badge, BodyLayout, Button, Card, FlexLayout, Grid, Select, TextField, TextStyles } from "@cedcommerce/ounce-ui";
import { useMemo, useState } from "react";
import { DateRangePicker } from "rsuite";
import { filterOptions } from "../../../constants";
import useGetRequests from "../../../hooks/getRequests";
import Pagination from "../Activity/Pagination";
import FilterDateRange from "../FilterDateRange";
import FilterSelect from "../FilterSelect";
import FilterTextSelect from "../FilterTextSelect";

function MigrationStatus() {
    const [activePage, setActivePage] = useState(1);
    // filters
    const [allFilters, setAllFilters] = useState<{ [key: string]: any }>({})

    const filterQuery = useMemo(() => {
        let query = "";
        Object.keys(allFilters).forEach((key) => {
            if (allFilters[key]?.code?.trim() === "" || allFilters[key]?.code === undefined || allFilters[key]?.value?.toString()?.trim() === "" || allFilters[key]?.value === undefined) return;
            if (key === "migration_start" || key === "migration_end") {
                const date = allFilters[key]?.value?.split("%");
                query += `&filter[${key}][${allFilters[key]?.code}][to]=${date[1]}&filter[${key}][${allFilters[key]?.code}][from]=${date[0]}`;
                return;
            }
            query += `&filter[${key}][${allFilters[key]?.code}]=${allFilters[key]?.value}`
        })
        return query;
    }, [allFilters])

    const { data, isLoading, errors } = useGetRequests(`/frontend/adminpanelamazonmulti/getMigrationGrid?target_marketplace=all&count=100&activePage=${activePage}${filterQuery}`)
    const totalCount = useMemo(() => data?.count, [data]);

    const { data: all, isLoading: allLoading, errors: allErrors } = useGetRequests(`/frontend/adminpanelamazonmulti/getAllMigrationRelatedCounts?target_marketplace=all`)

    const options = [
        { label: "100", value: "100" },
    ]

    const stepOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => { return { label: n.toString(), value: n.toString() } })

    const dataSource = useMemo(() => {
        return data?.data?.map((d: any) => {
            return {
                user_id: d.user_id,
                username: d.username,
                step: d.step,
                startTime: d.start_time,
                endTime: d.end_time,
                status: d.status,
                message: d.message
            }
        })
    }, [data])

    const columns = [
        {
            align: 'center',
            dataIndex: 'user_id',
            key: 'user_id',
            title: <FilterTextSelect title="User Id" allFilters={allFilters} setAllFilters={setAllFilters} objKey="user_id" options={filterOptions} />,
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'username',
            key: 'username',
            title: <FilterTextSelect title="Username" allFilters={allFilters} setAllFilters={setAllFilters} objKey="username" options={filterOptions} />,
            width: 150
        },
        {
            align: 'center',
            dataIndex: 'step',
            key: 'step',
            title: <FilterSelect title="Step" allFilters={allFilters} setAllFilters={setAllFilters} options={stepOptions} code="1" objKey="step" />,
            width: 300
        },
        {
            align: 'center',
            dataIndex: 'startTime',
            key: 'startTime',
            title: <FilterDateRange title="Started" allFilters={allFilters} setAllFilters={setAllFilters} code="7" objKey="migration_start" />,
            width: 300
        },
        {
            align: 'center',
            dataIndex: 'endTime',
            key: 'endTime',
            title: <FilterDateRange title="Completed" allFilters={allFilters} setAllFilters={setAllFilters} code="7" objKey="migration_end" />,
            width: 300
        },
        {
            align: 'center',
            dataIndex: 'status',
            key: 'status',
            title:
                <FlexLayout direction="vertical" halign="start" valign="center" spacing="tight">
                    <TextStyles>Status</TextStyles>
                    <Select value={allFilters?.completed ? allFilters?.completed?.value ? "Completed" : "In progress" : ""} options={["In progress", "Completed"].map(s => {
                        return { label: s, value: s }
                    })}
                        onChange={(e) => {
                            console.log(e);

                            setAllFilters(prev => {
                                if (e === "In progress") return { ...prev, completed: { value: false, code: "1" } }
                                else return { ...prev, completed: { value: true, code: "1" } }
                            })
                        }}
                    />
                </FlexLayout>
            ,
            width: 150
        },
        {
            align: 'center',
            dataIndex: 'message',
            key: 'message',
            title: 'Message',
            width: 300
        },
    ]

    return (
        <BodyLayout Layout="Full">
            <FlexLayout direction="vertical" spacing="tight" desktopWidth="100">
                <Card>
                    <FlexLayout halign="fill" valign="center">
                        <Button onClick={() => setAllFilters({})}>Reset All Filters</Button>
                        <FlexLayout spacing="tight" valign="center">
                            <Badge size="regular" type="Info-100">Total Count = {all?.data?.total ?? 0}</Badge>
                            <Badge size="regular" type="Positive-100">Total Completed = {all?.data?.complete ?? 0}</Badge>
                            <Badge size="regular" type="Warning-100">Migration Inprogress = {all?.data?.progress ?? 0}</Badge>
                        </FlexLayout>
                        <Pagination
                            options={options}
                            totalCount={totalCount}
                            activePage={activePage}
                            countPerPage={100}
                            onPrev={() => setActivePage(activePage - 1)}
                            onNext={() => setActivePage(activePage + 1)}
                        />
                    </FlexLayout>
                </Card>
                <Grid loading={isLoading} scrollX={1300} dataSource={dataSource} columns={columns} />
            </FlexLayout>
        </BodyLayout>
    )
}

export default MigrationStatus