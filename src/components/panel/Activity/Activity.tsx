import { BodyLayout, Button, Card, FlexLayout, Grid, Modal, Select, TextField, TextStyles } from "@cedcommerce/ounce-ui"
import { useMemo, useState } from "react"
import useGetRequests from "../../../hooks/getRequests"
import Pagination from "./Pagination"
import ReactJson from "react-json-view";
import { actionOptions, filterOptions, options } from "../../../constants";
import FilterDateRange from "../FilterDateRange";
import FilterSelect from "../FilterSelect";
import FilterTextSelect from "../FilterTextSelect";

function Activity() {
    const [openModal, setOpenModal] = useState(false);
    const [modalDetails, setModalDetails] = useState<any>({});
    const [activePage, setActivePage] = useState(1);
    const [countPerPage, setCountPerPage] = useState(10);
    // filters
    const [allFilters, setAllFilters] = useState<{ [key: string]: any }>({})

    const filterQuery = useMemo(() => {
        let query = "";
        Object.keys(allFilters).forEach((key, i) => {
            if (allFilters[key]?.code?.trim() === "" || allFilters[key]?.code === undefined || allFilters[key]?.value?.trim() === "" || allFilters[key]?.value === undefined) return;
            if (key === "created_at") {
                const date = allFilters[key]?.value?.split("%");
                query += `&filter[${key}][${allFilters[key]?.code}][to]=${date[1]}&filter[${key}][${allFilters[key]?.code}][from]=${date[0]}`;
                return;
            }
            query += `&filter[${key}][${allFilters[key]?.code}]=${allFilters[key]?.value}`
        })
        return query;
    }, [allFilters])

    const { data, isLoading, errors } = useGetRequests(`/frontend/adminpanelamazonmulti/getActivityLogs?target_marketplace=all&count=${countPerPage}&activePage=${activePage}${filterQuery}`)

    const totalCount = data?.count;

    const roleOptions = [
        { label: "admin", value: "admin" },
        { label: "bda", value: "bda" },
    ]

    const dataSource = useMemo(() => {
        return data?.data?.map((d: any) => {
            return {
                key: d._id["$old"],
                username: d.username,
                role: d.role,
                performed: d.username,
                action_type: d.action_type,
                created_at: d.created_at,
                message: d.action,
                details: d
            }
        })
    }, [data])

    const columns = [
        {
            align: 'center',
            dataIndex: 'username',
            key: 'username',
            title: <FilterTextSelect title="Username" allFilters={allFilters} setAllFilters={setAllFilters} objKey="username" options={filterOptions} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'role',
            key: 'role',
            title: <FilterSelect title="Role" allFilters={allFilters} setAllFilters={setAllFilters} code="1" objKey="action_type" options={roleOptions} />,
            width: 50
        },
        {
            align: 'center',
            dataIndex: 'performed',
            key: 'performed',
            title: 'Performed By',
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'action_type',
            key: 'action_type',
            title: <FilterSelect title="Action" allFilters={allFilters} setAllFilters={setAllFilters} code="1" objKey="action_type" options={actionOptions} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'created_at',
            key: 'created_at',
            title: <FilterDateRange title="Created At" allFilters={allFilters} setAllFilters={setAllFilters} objKey="created_at" code="7" />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'message',
            key: 'message',
            title: 'Message',
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'view',
            key: 'view',
            title: 'View Details',
            width: 150,
            render: (_: any, record: any, index: number) => {
                return (
                    <Button thickness="thin" onClick={() => {
                        const { payload, ...rest } = record.details;
                        setModalDetails({ ...rest, payload: { ...JSON.parse(payload) } })
                        setOpenModal(true)
                    }}>View Details</Button>
                )
            }
        }
    ]

    return (
        <BodyLayout Layout="Full">
            <FlexLayout direction="vertical" spacing="tight" desktopWidth="100">
                <Card>
                    <FlexLayout halign="fill" valign="center">
                        <Button onClick={() => setAllFilters({})}>Reset All Filters</Button>
                        <Pagination
                            options={options}
                            totalCount={totalCount}
                            activePage={activePage}
                            countPerPage={countPerPage}
                            onPrev={() => setActivePage(activePage - 1)}
                            onNext={() => setActivePage(activePage + 1)}
                            onSelect={(e: any) => {
                                setCountPerPage(e)
                                setActivePage(1)
                            }} />
                    </FlexLayout>
                </Card>
                <Grid
                    loading={isLoading}
                    columns={columns}
                    dataSource={dataSource}
                    size="small"
                />
                <Modal modalSize="large" open={openModal} heading="User Details" close={() => setOpenModal(false)}>
                    <ReactJson src={modalDetails.payload} />
                </Modal>

            </FlexLayout>
        </BodyLayout>
    )
}

export default Activity