import React from "react";
import Table from "../../commons/tables/table";


const columns = [
    {
        Header: 'ID',
        accessor: 'personId',
    },
    {
        Header: 'Username',
        accessor: 'username',
    },
    {
        Header: 'Password',
        accessor: 'password'
    }
];

const filters = [
    {
        accessor: 'username',
    }
];

class PersonTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            personTableData: this.props.personTableData
        };
    }

    render() {
        return (
            <Table
                data={this.state.personTableData}
                columns={columns}
                search={filters}
                pageSize={10}
            />
        )
    }
}

export default PersonTable;