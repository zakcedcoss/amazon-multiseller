import { Badge, BodyLayout, Button, Card, CheckBox, FlexLayout, Grid, Tag } from "@cedcommerce/ounce-ui";
import { useEffect, useMemo, useState } from "react";
import { MoreVertical } from "react-feather";
import { appPlanOptions, filterOptions, installOptions, options, prepaidOptions } from "../../../constants";
import useGetRequests from "../../../hooks/getRequests";
import Pagination from "../Activity/Pagination";
import FilterDateRange from "../FilterDateRange";
import FilterSelect from "../FilterSelect";
import FilterTextSelect from "../FilterTextSelect";

function User() {
    const [activePage, setActivePage] = useState(1);
    const [countPerPage, setCountPerPage] = useState(10);
    const [viewColumns, setViewColumns] = useState(false)
    const [hiddenColumns, setHiddenColumns] = useState<{ [key: string]: boolean }>({})
    // filters
    const [allFilters, setAllFilters] = useState<{ [key: string]: any }>({})

    const filterQuery = useMemo(() => {
        let query = "";
        Object.keys(allFilters).forEach((key) => {
            if (allFilters[key]?.code?.trim() === "" || allFilters[key]?.code === undefined || allFilters[key]?.value?.toString()?.trim() === "" || allFilters[key]?.value === undefined) return;
            if (key === "created_at") {
                const date = allFilters[key]?.value?.split("%");
                query += `&filter[${key}][${allFilters[key]?.code}][to]=${date[1]}&filter[${key}][${allFilters[key]?.code}][from]=${date[0]}`;
                return;
            }
            query += `&filter[${key}][${allFilters[key]?.code}]=${allFilters[key]?.value}`
        })
        return query;
    }, [allFilters])

    const allTags = useMemo(() => {
        let tagsQuery: string[] = [];
        Object.keys(allFilters).forEach((key) => {
            if (allFilters[key]?.code?.trim() === "" || allFilters[key]?.code === undefined || allFilters[key]?.value?.trim() === "" || allFilters[key]?.value === undefined) return;

            tagsQuery.push(key + ":" + allFilters[key]?.value);
        })

        return tagsQuery;
    }, [allFilters])

    const removeTag = (tagName: string) => {
        const { [tagName]: _, ...rest } = allFilters;
        setAllFilters(rest);
    }
    // console.log({ filterQuery }, "aaaaaaaaaaa");

    const { data, isLoading, errors } = useGetRequests(`/frontend/adminpanelamazonmulti/getUsersData?target_marketplace=all&count=${countPerPage}&activePage=${activePage}${filterQuery}`)
    const totalCount = useMemo(() => data?.count, [data]);

    const { data: all, isLoading: allLoading, errors: allErrors } = useGetRequests(`/frontend/adminpanelamazonmulti/getMigrationCount?target_marketplace=all`)

    const dataSource = useMemo(() => {
        return data?.data?.rows?.map((d: any) => {
            return {
                user_id: d.user_id,
                installStatus: d["Install_Status_Shopify"],
                name: d.shops[0].name,
                username: d.username,
                email: d.email,
                shopUrl: d.shops[0].domain,
                migrationStatus: d.migration_status.status,
                migrationStart: "NA",
                migrationEnd: "NA",
                phone: d.shops[0].phone ?? "NA",
                plan: d.shops[0].plan_display_name,
                app_plan: d.app_plan ?? "NA",
                activated_at: d.shops[0].updated_at,
                prepaid_used_credit: "NA",
                prepaid_available_credit: "NA",
                postpaid_used_credit: "NA",
                postpaid_available_credit: "NA",
                installed_at: "NA",
                last_login: "NA",
                last_updated: "NA",
                action: null,
            }
        })
    }, [data])

    const columns = [
        {
            align: 'center',
            dataIndex: 'installStatus',
            key: 'installStatus',
            title: <FilterSelect title="Install/Uninstall" allFilters={allFilters} setAllFilters={setAllFilters} code="8" objKey="uninstall_status" options={installOptions.slice(0, -1)} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'user_id',
            key: 'user_id',
            title: <FilterTextSelect title="User Id" allFilters={allFilters} setAllFilters={setAllFilters} objKey="user_id" options={filterOptions} />,
            width: 50
        },
        {
            align: 'center',
            dataIndex: 'name',
            key: 'name',
            title: <FilterTextSelect title="Name" allFilters={allFilters} setAllFilters={setAllFilters} objKey="shops.name" options={filterOptions} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'username',
            key: 'username',
            title: <FilterTextSelect title="Username" allFilters={allFilters} setAllFilters={setAllFilters} objKey="username" options={filterOptions} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'email',
            key: 'email',
            title: <FilterTextSelect title="Email" allFilters={allFilters} setAllFilters={setAllFilters} objKey="email" options={filterOptions} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'shopUrl',
            key: 'shopUrl',
            title: <FilterTextSelect title="Shop Url" allFilters={allFilters} setAllFilters={setAllFilters} objKey="shops.domain" options={filterOptions} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'action',
            key: 'action',
            title: 'Action',
            width: 200,
            render: () => {
                return <Button type="Outlined" icon={<MoreVertical />} />

            }
        },
        {
            align: 'center',
            dataIndex: 'migrationStatus',
            key: 'migrationStatus',
            title: 'Migration Status',
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'migrationStart',
            key: 'migrationStart',
            title: 'migration Start',
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'migrationEnd',
            key: 'migrationEnd',
            title: 'Migration End',
            width: 300
        },
        {
            align: 'center',
            dataIndex: 'phone',
            key: 'phone',
            title: <FilterTextSelect title="Contact Number" allFilters={allFilters} setAllFilters={setAllFilters} objKey="shops.phone" options={filterOptions} />,
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'plan',
            key: 'plan',
            title: <FilterTextSelect title="Shopify Plan" allFilters={allFilters} setAllFilters={setAllFilters} objKey="shops.plan_display_name" options={filterOptions} />,
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'amazon_seller',
            key: 'amazon_seller',
            title: 'View Amazon Seller',
            width: 200,
            render: () => {
                return <Button type="Plain">View Shops</Button>
            }
        },
        {
            align: 'center',
            dataIndex: 'app_plan',
            key: 'app_plan',
            title: <FilterSelect allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.plan_details.plan_id" code="1" title="App Plan" options={appPlanOptions} />,
            width: 300,
        },
        {
            align: 'center',
            dataIndex: 'activated_at',
            key: 'activated_at',
            title: 'Plan Activated At',
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'prepaid_used_credit',
            key: 'prepaid_used_credit',
            title: <FilterTextSelect title="Prepaid Used Credit" allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.prepaid.total_used_credits" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'prepaid_available_credit',
            key: 'prepaid_available_credit',
            title: <FilterTextSelect title="Prepaid Available Credit" allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.prepaid.available_credits" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'postpaid_used_credit',
            key: 'postpaid_used_credit',
            title: <FilterTextSelect title="Postpaid Used Credit" allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.postpaid.total_used_credits" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'postpaid_available_credit',
            key: 'postpaid_available_credit',
            title: <FilterTextSelect title="Postpaid Available Credit" allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.postpaid.available_credits" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'installed_at',
            key: 'installed_at',
            title: <FilterDateRange allFilters={allFilters} setAllFilters={setAllFilters} objKey="created_at" code="7" title="Created At" />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'last_login',
            key: 'last_login',
            title: 'Last Login At',
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'last_updated',
            key: 'last_updated',
            title: 'Last Updated At',
            width: 200,
        },
    ]

    const modifiedCols = columns.filter(cols => {
        return hiddenColumns[cols.key];
    })

    useEffect(() => {
        const hiddenCols = columns.reduce((acc: any, col: any) => {
            return { ...acc, [col.key]: true }
        }, {})
        setHiddenColumns(hiddenCols)
    }, [])

    return (
        <BodyLayout Layout="Full">
            <FlexLayout direction="vertical" spacing="tight" desktopWidth="100">
                <Card>
                    <FlexLayout halign="fill" valign="center">
                        <FlexLayout spacing="tight">
                            <Button onClick={() => setViewColumns(prev => !prev)}>View Columns</Button>
                            <Button onClick={() => setAllFilters({})}>Reset All Filters</Button>
                        </FlexLayout>
                        <FlexLayout spacing="tight" valign="center">
                            <Badge size="regular" type="Info-100">Total Count = {all?.data?.total ?? 0}</Badge>
                            <Badge size="regular" type="Positive-100">Total Completed = {all?.data?.complete ?? 0}</Badge>
                            <Badge size="regular" type="Warning-100">Migration Inprogress = {all?.data?.progress ?? 0}</Badge>
                        </FlexLayout>
                        <Pagination
                            options={options}
                            totalCount={totalCount}
                            activePage={activePage}
                            countPerPage={countPerPage}
                            onPrev={() => setActivePage(activePage - 1)}
                            onNext={() => setActivePage(activePage + 1)}
                            onSelect={(e) => setCountPerPage(e)}
                        />
                    </FlexLayout>
                </Card>
                {allTags.length !== 0 && allTags.map(tag => {
                    return <Tag key={tag} destroy={() => removeTag(tag.split(":")[0])}>{tag}</Tag>
                })}
                {viewColumns && <Card>
                    <FlexLayout spacing="tight">
                        {columns.map(col => {
                            return (
                                <CheckBox
                                    checked={hiddenColumns[col.key]}
                                    key={col.key}
                                    labelVal={col.key}
                                    onClick={() => {
                                        setHiddenColumns(prev => {
                                            return { ...prev, [col.key]: !prev[col.key] }
                                        })
                                    }}
                                />
                            )
                        })}
                    </FlexLayout>
                </Card>}
                <Grid loading={isLoading} dataSource={dataSource} columns={modifiedCols} scrollX={1500} />
            </FlexLayout>
        </BodyLayout>
    )
}

export default User