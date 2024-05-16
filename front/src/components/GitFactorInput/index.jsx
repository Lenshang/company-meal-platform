import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Select, Space, Form, Row, Col, Flex, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";

function _GitFactorInput(props, ref) {
    const { value, onChange, disabled, ...other_props } = props;
    const [git, setGit] = useState("");
    const [gittag, setGittag] = useState("");
    const [gitclass, setGitclass] = useState("");
    useEffect(() => {
        if (value) {
            let v = value.split("::");
            if (v.length == 3) {
                setGit(v[0]);
                setGittag(v[1]);
                setGitclass(v[2]);
            }
        }
    }, [value]);
    return (
        <Space.Compact {...other_props}>
            <Input key={"git"} style={{ width: '70%' }} placeholder="git仓库地址" onChange={(v) => {
                let _v = v.target.value + "::" + gittag + "::" + gitclass;
                onChange(_v)
            }} />
            <Input key={"tag"} style={{ width: '15%' }} placeholder="tag" onChange={(v) => {
                let _v = git + "::" + v.target.value + "::" + gitclass;
                onChange(_v)
            }} />
            <Input key={"cls"} style={{ width: '15%' }} placeholder="类名" onChange={(v) => {
                let _v = git + "::" + gittag + "::" + v.target.value;
                onChange(_v)
            }} />
        </Space.Compact>
    )
}
const GitFactorInput = React.forwardRef(_GitFactorInput);

function _GitFactorInputGroup(props, ref) {
    const { value, onChange, disabled, ...other_props } = props;
    const [form] = Form.useForm();
    const [fields, setFields] = useState([]);
    const add = () => {
        setFields(f => [...f, '']);
    };
    const remove = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    }
    const handlerOnChange = values => {
        onChange(values.join(','));
    };
    return (
        <Row gutter={[0, 16]}>
            {fields.map((field, index) => {
                return (
                    <Col span={24} key={index}>
                        <Flex>
                            <GitFactorInput key={index} value={field} style={{ width: "100%" }} onChange={v => {
                                setFields(f => {
                                    f[index] = v;
                                    handlerOnChange(f);
                                    return [...f];
                                })
                            }} />
                            <Button type="link" onClick={() => { remove(index); }}><DeleteOutlined /></Button>
                        </Flex>
                    </Col>
                )
            })}
            <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
            >
                Add field
            </Button>
        </Row>
    )
}
const GitFactorInputGroup = React.forwardRef(_GitFactorInputGroup);

function _GitFactorSelector(props, ref) {
    const { value, onChange, data, loadData, loading, ...other_props } = props;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
        onChange(newSelectedRowKeys);
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters && handleReset(clearFilters);
                            // setTimeout(() => {
                            //     handleSearch(selectedKeys, confirm, dataIndex);
                            // }, 100);
                        }}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'index',
            dataIndex: 'index',
            width: 60,
        },
        {
            title: 'FactorName',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            // {
            //     key: 'odd',
            //     text: 'Select Odd Row',
            //     onSelect: (changeableRowKeys) => {
            //         let newSelectedRowKeys = [];
            //         newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            //             if (index % 2 !== 0) {
            //                 return false;
            //             }
            //             return true;
            //         });
            //         setSelectedRowKeys(newSelectedRowKeys);
            //     },
            // },
            // {
            //     key: 'even',
            //     text: 'Select Even Row',
            //     onSelect: (changeableRowKeys) => {
            //         let newSelectedRowKeys = [];
            //         newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            //             if (index % 2 !== 0) {
            //                 return true;
            //             }
            //             return false;
            //         });
            //         setSelectedRowKeys(newSelectedRowKeys);
            //     },
            // },
        ],
    };
    return (
        <>
            <Button onClick={() => { loadData(); }}>从Git读取Factor列表</Button>
            <Table loading={loading} rowSelection={rowSelection} columns={columns} dataSource={data} />
        </>
    );
}
const GitFactorSelector = React.forwardRef(_GitFactorSelector);

export { GitFactorInput, GitFactorInputGroup, GitFactorSelector }