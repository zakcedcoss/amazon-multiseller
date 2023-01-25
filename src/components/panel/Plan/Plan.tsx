import { AdvanceFilter, BodyLayout, Button, Card, FlexLayout, Grid, Popover, Select, TextField, TextStyles } from "@cedcommerce/ounce-ui";
import { useMemo, useState } from "react";
import { Filter } from "react-feather";
import useGetRequests from "../../../hooks/getRequests";
import FilterTabs from "./FilterTabs";

function Plan() {
    const [searchedText, setSearchedText] = useState("")
    const [isSortClose, setIsSortClose] = useState(false)
    const [sortTable, setSortTable] = useState<{ column: string, order: string }>({ column: "", order: "" })

    const { data, isLoading, errors } = useGetRequests(`/plan/plan/get?target_marketplace=all`)

    const dataSource = useMemo(() => {
        return data?.data?.data?.rows?.map((d: any) => {
            return {
                key: d.plan_id,
                plan_id: d.plan_id,
                title: d.title,
                custom_price: d.custom_price,
                discounts: d.discounts.length === 0 ? "Not Set" : d.discounts[0],
                description: d.description,
            }
        })
    }, [data])

    const columns = [
        {
            align: 'center',
            dataIndex: 'plan_id',
            key: 'plan_id',
            title: 'Plan Id',
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'title',
            key: 'title',
            title: 'Title',
            width: 150
        },
        {
            align: 'center',
            dataIndex: 'custom_price',
            key: 'custom_price',
            title: 'Custom Price',
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'discounts',
            key: 'discount',
            title: 'Discount',
            width: 150
        },
        {
            align: 'center',
            dataIndex: 'description',
            key: 'description',
            title: 'Description',
            width: 150
        },
        {
            align: 'center',
            dataIndex: 'action',
            key: 'action',
            title: 'Action',
            width: 200,
            render: () => {
                return (
                    <FlexLayout spacing="tight" valign="center" halign="center">
                        <Button>Edit</Button>
                        <Button type="DangerPlain">Delete</Button>
                    </FlexLayout>
                )
            }
        }
    ]

    const textFilterDataSource = useMemo(() => dataSource?.filter((d: any) => {
        return d.title.includes(searchedText) || d.plan_id.includes(searchedText)
    }), [dataSource, searchedText])

    const sortedDataSource = useMemo(() => {
        if (sortTable.column === "title" && sortTable.order !== "") {
            if (sortTable.order === "asc") return textFilterDataSource?.sort((a: any, b: any) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
            else return textFilterDataSource?.sort((a: any, b: any) => (a.title > b.title) ? -1 : ((b.title > a.title) ? 1 : 0));
        } else if (sortTable.column === "price" && sortTable.order !== "") {
            if (sortTable.order === "asc") return textFilterDataSource?.sort((a: any, b: any) => a.custom_price - b.custom_price)
            else return textFilterDataSource?.sort((a: any, b: any) => b.custom_price - a.custom_price)
        } else return textFilterDataSource;
    }, [textFilterDataSource, sortTable.column, sortTable.order])

    // console.log(sortTable, sortedDataSource, "fffffffffff")

    return (
        <BodyLayout Layout="Full">
            <FlexLayout direction="vertical" spacing="tight" desktopWidth="100">
                <Card cardType="Subdued">
                    <FlexLayout halign="fill" valign="center">
                        <TextStyles type="SubHeading">Plan</TextStyles>
                        <Button>Create Plan</Button>
                    </FlexLayout>
                </Card>
                <Card>
                    <FlexLayout valign="end" halign="start" spacing="extraTight">
                        <TextField
                            name="Search"
                            thickness="thin"
                            onChange={setSearchedText}
                            placeHolder="Search by Id or Title"
                            type="text"
                            value={searchedText}
                        />
                        <AdvanceFilter
                            button="More Filters"
                            disableApply
                            filters={[
                                {
                                    children: <FilterTabs placeHolder="Search By Price" />,
                                    name: 'Search By Price'
                                },
                                {
                                    children: <FilterTabs placeHolder="Search By Discount" />,
                                    name: 'Search By Discount'
                                },
                            ]}
                            heading="Filters"
                            icon={<Filter color="#2a2a2a" size={16} />}
                            onApply={function noRefCheck() { }}
                            onClose={function noRefCheck() { }}
                            type="Outlined"
                        />
                        <Popover
                            open={isSortClose}
                            activator={<Button onClick={() => setIsSortClose(prev => !prev)}>Sort</Button>}
                            popoverContainer="body"
                            popoverWidth={300}
                        >
                            <FlexLayout desktopWidth="100" spacing="tight">
                                <Select value={sortTable?.column} options={[{ label: "Sort Title", value: "title" }, { label: "Sort Price", value: "price" },]} onChange={(e) => setSortTable(prev => { return { ...prev, column: e } })} />
                                <Select value={sortTable?.order} options={[{ label: "Ascending", value: "asc" }, { label: "Descending", value: "desc" },]} onChange={(e) => setSortTable(prev => { return { ...prev, order: e } })} />
                            </FlexLayout>
                        </Popover>
                    </FlexLayout>
                </Card>

                <Grid
                    loading={isLoading}
                    columns={columns}
                    dataSource={sortedDataSource}
                    size="small"
                />
            </FlexLayout>
        </BodyLayout>
    )
}

export default Plan