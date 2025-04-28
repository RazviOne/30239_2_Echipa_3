import React from "react";
import Table from "../../commons/tables/table";


const columns = [
    {
        Header: 'Device ID',
        accessor: 'deviceId',
    },
    {
        Header: 'Person ID',
        accessor: 'personId',
    }
];

const filters = [
    {
        accessor: 'deviceId',
    }
];

class DeviceLinkTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deviceLinkTableData: this.props.deviceLinkTableData
        };
    }

    render() {
        return (
            <Table
                data={this.state.deviceLinkTableData}
                columns={columns}
                search={filters}
                pageSize={10}
            />
        )
    }
}

export default DeviceLinkTable;