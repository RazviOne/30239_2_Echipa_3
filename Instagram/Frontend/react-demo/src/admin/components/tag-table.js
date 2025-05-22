import React from "react";
import Table from "../../commons/tables/table";


const columns = [
    {
        Header: 'ID',
        accessor: 'idTag',
    },
    {
        Header: 'Name',
        accessor: 'name',
    }
];

const filters = [
    {
        accessor: 'idTag',
    }
];

class TagTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tagTableData: this.props.tagTableData
        };
    }

    render() {
        return (
            <Table
                data={this.state.tagTableData}
                columns={columns}
                search={filters}
                pageSize={10}
            />
        )
    }
}

export default TagTable;