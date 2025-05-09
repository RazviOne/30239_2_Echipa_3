import React from "react";
import Table from "../../commons/tables/table";


const columns = [
    {
        Header: 'ID',
        accessor: 'idPerson',
    },
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Username',
        accessor: 'username',
    },
    {
        Header: 'Password',
        accessor: 'password'
    },
    {
        Header: 'User Score',
        accessor: 'userScore'
    },
    {
        Header: 'Admin',
        accessor: 'isAdmin',
        Cell: ({ value }) => (value ? '✔' : '❌')
    },
    {
        Header: 'Banned',
        accessor: 'isBanned',
        Cell: ({ value }) => (value ? '✔' : '❌')
    },
    {
        Header: 'Email',
        accessor: 'email'
    },
    {
        Header: 'Phone Number',
        accessor: 'phoneNumber'
    },
    {
        Header: 'Birth Date',
        accessor: 'birthDate'
    },
    {
        Header: 'Home City',
        accessor: 'homeCity'
    },
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