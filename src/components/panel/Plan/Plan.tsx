import { AdvanceFilter, BodyLayout, Button, Card, FlexLayout, Grid, Popover, Select, Tag, TextField, TextStyles } from "@cedcommerce/ounce-ui";
import { useMemo, useState } from "react";
import { Filter } from "react-feather";
import { prepaidOptions } from "../../../constants";
import useGetRequests from "../../../hooks/getRequests";
import FilterTabs from "./FilterTabs";

function Plan() {
    const [searchedText, setSearchedText] = useState("")
    const [isSortClose, setIsSortClose] = useState(false)
    const [sortTable, setSortTable] = useState<{ column: string, order: string }>({ column: "", order: "" })
    // filters
    const [allFilters, setAllFilters] = useState<{ [key: string]: any }>({})
    const [tags, setTags] = useState<{ name: string, value: string }[]>([{ name: "Title/Id", value: "" }, { name: "Price", value: "" }, { name: "Discount", value: "" }])

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

    const textFilterDataSource = dataSource?.filter((d: any) => {
        return d.title.includes(searchedText) || d.plan_id.includes(searchedText)
    })

    const sortedDataSource = () => {
        if (sortTable.column === "title" && sortTable.order !== "") {
            if (sortTable.order === "asc") return textFilterDataSource?.sort((a: any, b: any) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
            else return textFilterDataSource?.sort((a: any, b: any) => (a.title > b.title) ? -1 : ((b.title > a.title) ? 1 : 0));
        } else if (sortTable.column === "price" && sortTable.order !== "") {
            if (sortTable.order === "asc") return textFilterDataSource?.sort((a: any, b: any) => a.custom_price - b.custom_price)
            else return textFilterDataSource?.sort((a: any, b: any) => b.custom_price - a.custom_price)
        } else return textFilterDataSource;
    }

    const allTags = useMemo(() => {
        let tagQuery: string[] = [];
        tags.forEach(tag => {
            const findCode = prepaidOptions.find(opt => opt.value === allFilters?.[tag.name]?.code)
            if (tag.value === "") return;
            else tagQuery.push(tag.name + " " + (findCode ? findCode?.label : "includes") + " " + tag.value);
        })
        return tagQuery;
    }, [tags])

    const handleChange = (e: string) => {
        setSearchedText(e)
        setTags((prev: any) => {
            return prev.map((data: any) => {
                if (data.name === "Title/Id") return { ...data, value: e }
                return data;
            })
        })
    }

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
                        <TextField name="Search"
                            thickness="thin"
                            onChange={handleChange}
                            placeHolder="Search by Id or Title"
                            type="text"
                            value={searchedText}
                        />
                        <AdvanceFilter disableReset={false} disableApply={false}
                            resetFilter={() => {
                                setSearchedText("")
                                setTags([{ name: "Title or Id", value: "" }, { name: "Price", value: "" }, { name: "Discount", value: "" }])
                                setAllFilters({})
                            }}
                            button="More Filters"
                            filters={[
                                {
                                    children: <FilterTabs placeHolder="Search By Price" objKey="Price" advanceFilter={allFilters} setAdvanceFilter={setAllFilters} />,
                                    name: 'Search By Price'
                                },
                                {
                                    children: <FilterTabs placeHolder="Search By Discount" objKey="Discount" advanceFilter={allFilters} setAdvanceFilter={setAllFilters} />,
                                    name: 'Search By Discount'
                                },
                            ]}
                            heading="Filters" icon={<Filter color="#2a2a2a" size={16} />} type="Outlined"
                            onApply={() => {
                                Object.keys(allFilters).forEach((key) => {
                                    setTags((prev: any) => {
                                        return prev.map((data: any) => {
                                            if (data.name === key) return { ...data, value: allFilters[key].value }
                                            return data;
                                        })
                                    })
                                })
                            }} />
                        <Popover open={isSortClose} activator={<Button onClick={() => setIsSortClose(prev => !prev)}>Sort</Button>} popoverContainer="body" popoverWidth={300} onClose={() => setIsSortClose(false)}>
                            <FlexLayout desktopWidth="100" spacing="tight">
                                <Select value={sortTable?.column} options={[{ label: "Sort Title", value: "title" }, { label: "Sort Price", value: "price" },]} onChange={(e) => setSortTable(prev => { return { ...prev, column: e } })} />
                                <Select value={sortTable?.order} options={[{ label: "Ascending", value: "asc" }, { label: "Descending", value: "desc" },]} onChange={(e) => setSortTable(prev => { return { ...prev, order: e } })} />
                            </FlexLayout>
                        </Popover>
                    </FlexLayout>
                </Card>
                <FlexLayout>
                    {allTags.length !== 0 && allTags.map((tag) => {
                        return <Tag key={tag}>{tag}</Tag>
                    })}
                </FlexLayout>
                <Grid loading={isLoading} columns={columns} dataSource={sortedDataSource()} size="small" />
            </FlexLayout>
        </BodyLayout>
    )
}

export default Plan