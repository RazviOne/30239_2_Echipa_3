import React from "react";
import Table from "../../commons/tables/table";


const columns = [
    {
        Header: 'ID',
        accessor: 'idPerson'
    },
    {
        Header: 'Name',
        accessor: 'name'
    },
    {
        Header: 'Username',
        accessor: 'username'
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
        accessor: 'birthDate',
        Cell: ({ value }) => {
            // console.log(value);
            let yearData = parseInt(value.substring(0, 4));
            let monthData = parseInt(value.substring(5, 7));
            let dayData = parseInt(value.substring(8, 10));
            let hourData = parseInt(value.substring(11, 13));
            let minuteData = parseInt(value.substring(14, 16));
            // let secondData = parseInt(value.substring(17, 19));
            // console.log(`Year: ${yearData}\nMonth: ${monthData}\nDay: ${dayData}\nHour: ${hourData}\nMinute: ${minuteData}\nSecond: ${secondData}\n`);
            // let dateString = dayData + '.' + monthData + '.' + yearData + " " + hourData + ':' + minuteData + ':' + secondData;
            return dayData.toString().padStart(2, '0') +
                '.' +
                monthData.toString().padStart(2, '0') +
                '.' +
                yearData +
                " " +
                hourData.toString().padStart(2, '0') +
                ':' +
                minuteData.toString().padStart(2, '0');
        }
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
                pageSize={5}
            />
        )
    }
}

export default PersonTable;