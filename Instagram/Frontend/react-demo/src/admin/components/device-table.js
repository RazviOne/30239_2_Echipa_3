import React from "react";
import Table from "../../commons/tables/table";


const columns = [
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Description',
        accessor: 'description',
    },
    {
        Header: 'Address',
        accessor: 'address'
    },
    {
        Header: 'Average Hourly Consumption',
        accessor: 'mhec'
    }
];

const filters = [
    {
        accessor: 'description',
    }
];

class DeviceTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deviceTableData: this.props.deviceTableData
        };
    }

    render() {
        return (
            <Table
                data={this.state.deviceTableData}
                columns={columns}
                search={filters}
                pageSize={10}
            />
        )
    }
}

export default DeviceTable;