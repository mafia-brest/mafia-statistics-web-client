import withStyles from '@material-ui/core/styles/withStyles'
import Assignment from '@material-ui/icons/Assignment'
import Close from '@material-ui/icons/Close'
import Dvr from '@material-ui/icons/Dvr'
import Favorite from '@material-ui/icons/Favorite'

import {cardTitle} from 'assets/jss/material-dashboard-pro-react.jsx'
import Card from 'components/Card/Card.jsx'
import CardBody from 'components/Card/CardBody.jsx'
import CardHeader from 'components/Card/CardHeader.jsx'
import CardIcon from 'components/Card/CardIcon.jsx'
import Button from 'components/CustomButtons/Button.jsx'
import GridContainer from 'components/Grid/GridContainer.jsx'
import GridItem from 'components/Grid/GridItem.jsx'
import React from 'react'
import ReactTable from 'react-table'

import {dataTable} from 'variables/general.jsx'

const styles = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: '15px',
        marginBottom: '0px'
    }
}

class Players extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: dataTable.dataRows.map((prop, key) => {
                return {
                    id: key,
                    name: prop[0],
                    position: prop[1],
                    office: prop[2],
                    age: prop[3],
                    actions: (
                        // we've added some custom button actions
                        <div className="actions-right">
                            {/* use this button to add a like kind of action */}
                            <Button
                                justIcon
                                round
                                simple
                                onClick={() => {
                                    let obj = this.state.data.find(o => o.id === key)
                                    alert(
                                        'You\'ve clicked LIKE button on \n{ \nName: ' +
                                        obj.name +
                                        ', \nposition: ' +
                                        obj.position +
                                        ', \noffice: ' +
                                        obj.office +
                                        ', \nage: ' +
                                        obj.age +
                                        '\n}.'
                                    )
                                }}
                                color="info"
                                className="like"
                            >
                                <Favorite />
                            </Button>{' '}
                            {/* use this button to add a edit kind of action */}
                            <Button
                                justIcon
                                round
                                simple
                                onClick={() => {
                                    let obj = this.state.data.find(o => o.id === key)
                                    alert(
                                        'You\'ve clicked EDIT button on \n{ \nName: ' +
                                        obj.name +
                                        ', \nposition: ' +
                                        obj.position +
                                        ', \noffice: ' +
                                        obj.office +
                                        ', \nage: ' +
                                        obj.age +
                                        '\n}.'
                                    )
                                }}
                                color="warning"
                                className="edit"
                            >
                                <Dvr />
                            </Button>{' '}
                            {/* use this button to remove the data row */}
                            <Button
                                justIcon
                                round
                                simple
                                onClick={() => {
                                    var data = this.state.data
                                    data.find((o, i) => {
                                        if (o.id === key) {
                                            // here you should add some custom code so you can delete the data
                                            // from this component and from your server as well
                                            data.splice(i, 1)
                                            return true
                                        }
                                        return false
                                    })
                                    this.setState({data: data})
                                }}
                                color="danger"
                                className="remove"
                            >
                                <Close />
                            </Button>{' '}
                        </div>
                    )
                }
            })
        }
    }

    render() {
        const {classes} = this.props
        return (
            <GridContainer>
                <GridItem xs={12}>
                    <Card>
                        <CardHeader color="primary" icon>
                            <CardIcon color="primary">
                                <Assignment />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>React
                                Table</h4>
                        </CardHeader>
                        <CardBody>
                            <ReactTable
                                data={this.state.data}
                                filterable
                                columns={[
                                    {
                                        Header: 'Name',
                                        accessor: 'name'
                                    },
                                    {
                                        Header: 'Position',
                                        accessor: 'position'
                                    },
                                    {
                                        Header: 'Office',
                                        accessor: 'office'
                                    },
                                    {
                                        Header: 'Age',
                                        accessor: 'age'
                                    },
                                    {
                                        Header: 'Actions',
                                        accessor: 'actions',
                                        sortable: false,
                                        filterable: false
                                    }
                                ]}
                                defaultPageSize={10}
                                showPaginationTop
                                showPaginationBottom={false}
                                className="-striped -highlight"
                            />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        )
    }
}

export default withStyles(styles)(Players)
