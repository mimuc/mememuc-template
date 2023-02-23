import {ReactNode, useEffect} from "react";
import {Button, Checkbox, DatePicker, Input, Layout, Popconfirm, Segmented, theme} from "antd";
import {ClockCircleOutlined, FilterFilled, FilterOutlined, HeartOutlined} from "@ant-design/icons";
import styled from "styled-components";
import {api} from "src/api";
import {useFilterState, useMemesState, useSearchState, useSortState} from "src/states";
import {Header} from "src/components";
import dayjs, { Dayjs } from "dayjs";

type MemeLayoutProps = {
    children: ReactNode;
}


const Content = styled(Layout.Content)`
  margin-top: 100px;
  padding-inline: 100px !important;
`;

const Filter = () => {
    const [filter, setFilter] = useFilterState();
    const toggleFilter = () => {
        if (filter.creationDate) {
            setFilter(prev => ({...prev, creationDate: null}));
        } else {
            const oneYearAgo = dayjs(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
            setFilter(prev => ({...prev, creationDate: oneYearAgo}));
        }
    }

    const handleDateChange = (date: Dayjs) => {
        setFilter(prev => ({...prev, creationDate: date}));
    }

    return (
        <>
            <Checkbox defaultChecked={!!filter.creationDate} onChange={toggleFilter}>Filter newer than</Checkbox>
            <DatePicker
                onChange={handleDateChange as any}
                allowClear={false}
                disabled={!filter.creationDate}
                value={filter.creationDate ? dayjs(filter.creationDate) : null}
                placeholder={""}/>
        </>
    );
}


export const MemeLayout = ({children}: MemeLayoutProps) => {
    const {token} = theme.useToken();
    const [, setMemes] = useMemesState();
    const [sort, setSort] = useSortState();
    const [search, setSearch] = useSearchState();
    const [filter,] = useFilterState();

    useEffect(() => {
        api.memes.list(0, 10, sort, filter, search).then(setMemes);
    }, [sort, filter, search]);

    const handleSortChange = (value: 'latest' | 'popular') => {
        setSort(value);
    }

    const handleSearch = (value: string | null) => {
        setSearch(value === '' ? null : value);
    }

    return (
        <Layout>
            <Header>
                <Input.Search
                    style={{width: 400, marginRight: token.marginXS}}
                    enterButton
                    allowClear
                    onSearch={handleSearch}
                    placeholder="Search by user"
                />
                <Popconfirm
                    title="Filters"
                    icon={<FilterFilled style={{color: 'black'}}/>}
                    description={<Filter/>}
                    showCancel={false}
                >
                    <Button icon={<FilterOutlined type={filter ? 'primary' : 'default'}/>}/>
                </Popconfirm>
                <div style={{display: 'inline-block', marginLeft: token.marginXS}}>
                    <Segmented
                        defaultValue={sort}
                        options={[
                            {
                                value: 'latest',
                                label: 'Latest',
                                icon: <ClockCircleOutlined/>,
                            },
                            {
                                value: 'popular',
                                label: 'Popular',
                                icon: <HeartOutlined/>,
                            },
                        ]}
                        onChange={handleSortChange as any}
                    />
                </div>
            </Header>
            <Content>
                {children}
            </Content>
        </Layout>
    );
}