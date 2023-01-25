import { Badge, BodyLayout, Button, Card, FlexLayout, Grid, Select, TextField, TextStyles } from "@cedcommerce/ounce-ui";
import { useMemo, useState } from "react";
import useGetRequests from "../../../hooks/getRequests";
import Pagination from "../Activity/Pagination";

function ManageUser() {
    const [searchSelect, setSearchSelect] = useState("contains")
    const [searchedText, setSearchedText] = useState("")

    const { data, isLoading, errors } = useGetRequests(`/frontend/adminpanelamazonmulti/getBDAs?target_marketplace=all`)
    const totalCount = useMemo(() => data?.data?.length, [data]);

    const options = [
        { label: "10", value: "10" },
        { label: "20", value: "20" },
        { label: "50", value: "50" },
        { label: "100", value: "100" },
    ]

    const dataSource = useMemo(() => {
        return data?.data?.map((d: any) => {
            return {
                key: d.user_id,
                user_id: d.user_id,
                username: d.username,
                role: "BDA",
            }
        })
    }, [data])

    const filteredDataSource = useMemo(() => {
        if (searchedText === "") return dataSource;
        if (searchSelect === "contains") {
            return dataSource?.filter((d: any) => {
                return d.username.includes(searchedText) || d.user_id.includes(searchedText)
            })
        }
        else if (searchSelect === "equals") {
            return dataSource?.filter((d: any) => {
                return d.username === searchedText || d.user_id === searchedText;
            })
        }
    }, [dataSource, searchedText])

    const columns = [
        {
            align: 'center',
            dataIndex: 'user_id',
            key: 'user_id',
            title: 'User Id',
            width: 150
        },
        {
            align: 'center',
            dataIndex: 'username',
            key: 'username',
            title: 'Username',
            width: 150
        },
        {
            align: 'center',
            dataIndex: 'role',
            key: 'role',
            title: 'Role',
            width: 150
        },
        {
            align: 'center',
            dataIndex: 'actions',
            key: 'actions',
            title: 'Actions',
            width: 150,
            render: () => {
                return (
                    <Select value="active" options={[{ label: "Active", value: "active" }, { label: "InActive", value: "inactive" }]} />
                )
            }
        }
    ]

    return (
        <BodyLayout Layout="Full">
            <FlexLayout direction="vertical" spacing="tight" desktopWidth="100">
                <Card cardType="Subdued">
                    <FlexLayout halign="fill" valign="center">
                        <TextStyles type="SubHeading">Manage User and Roles</TextStyles>
                        <Button>Add New</Button>
                    </FlexLayout>
                </Card>
                <Card>
                    <FlexLayout halign="fill" valign="center">
                        <FlexLayout valign="center" spacing="extraTight">
                            <TextField
                                onChange={setSearchedText}
                                placeHolder="Search by UserId or TargetId"
                                prefix={<TextStyles>Search</TextStyles>}
                                type="text"
                                value={searchedText}
                            />
                            <Select value={searchSelect} options={[{ label: "equals", value: "equals" }, { label: "contains", value: "contains" }]} onChange={setSearchSelect} />
                        </FlexLayout>
                        <Badge
                            position="bottom"
                            size="regular"
                            type="Positive-100"
                        >
                            Total User Count: {totalCount ?? 0}
                        </Badge>
                        <Pagination options={options} totalCount={totalCount} />
                    </FlexLayout>
                </Card>

                <Grid
                    loading={isLoading}
                    columns={columns}
                    dataSource={filteredDataSource}
                    size="small"
                />

            </FlexLayout>
        </BodyLayout>
    )
}

export default ManageUser