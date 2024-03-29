import withStyles from '@material-ui/core/styles/withStyles'
import priceImage1 from 'assets/img/card-2.jpeg'
import dashboardStyle
    from 'assets/jss/material-dashboard-pro-react/views/dashboardStyle'
import Card from 'components/Card/Card.jsx'
import CardBody from 'components/Card/CardBody.jsx'
import CardFooter from 'components/Card/CardFooter.jsx'
import CardHeader from 'components/Card/CardHeader.jsx'
import Button from 'components/CustomButtons/Button.jsx'
import GridContainer from 'components/Grid/GridContainer.jsx'
import GridItem from 'components/Grid/GridItem.jsx'
import PropTypes from 'prop-types'
import React from 'react'
import {trackPromise} from 'react-promise-tracker'
import {NavLink} from 'react-router-dom'
import {mafiaStatisticsApi} from '../../api/mafiaStatisticsApi'
import LoadingIndicator
    from '../../components/LoadingIndicator/LoadingIndicator'
import Table from '../../components/Table/Table'
import {capitalize, getMention, getSubtextDate} from '../../util/util'

class RatingByMonths extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ratingByMonths: {},
            isLoading: true
        }
    }

    componentDidMount() {
        trackPromise(
            mafiaStatisticsApi.getRatingByMonths(25)
                .then(
                    data => this.setState({ratingByMonths: data}),
                    error => this.props.history.push('/auth/error')
                )
        ).then(r => this.setState({isLoading: false}))
    }

    render() {
        const {classes} = this.props
        return (
            <div>
                <h3>Рейтинг по месяцам</h3>
                <br />
                <GridContainer>
                    {this.state.isLoading
                        ? <LoadingIndicator />
                        : Object.keys(this.state.ratingByMonths).map((date, key) => {
                            const ratingByOneMonth = this.state.ratingByMonths[date]
                            const ratingByOneMonthLink = `/statistics/rating/${date}`
                            const tableData = []

                            if (this.state.ratingByMonths[date].length > 0) {
                                tableData.push([
                                    '#1',
                                    getMention(this.state.ratingByMonths[date][0])
                                    + ' ' +
                                    this.state.ratingByMonths[date][0].nickname,
                                    this.state.ratingByMonths[date][0].points
                                ])
                            }

                            if (this.state.ratingByMonths[date].length > 1) {
                                tableData.push([
                                    '#2',
                                    getMention(this.state.ratingByMonths[date][1])
                                    + ' ' +
                                    this.state.ratingByMonths[date][1].nickname,
                                    this.state.ratingByMonths[date][1].points
                                ])
                            }

                            if (this.state.ratingByMonths[date].length > 2) {
                                tableData.push([
                                    '#3',
                                    getMention(this.state.ratingByMonths[date][2])
                                    + ' ' +
                                    this.state.ratingByMonths[date][2].nickname,
                                    this.state.ratingByMonths[date][2].points
                                ])
                            }

                            const mostGamesPlayer = ratingByOneMonth
                                .slice()
                                .sort((a, b) => a.gamesTotal - b.gamesTotal)
                                .reverse()
                                [0]

                            return (
                                <GridItem xs={12} sm={12} md={3} key={key}>
                                    <Card product>
                                        <CardHeader image>
                                            <img src={priceImage1}
                                                 alt="..." />
                                        </CardHeader>
                                        <CardBody>
                                            <h4 className={classes.cardProductTitle}>
                                                {capitalize(getSubtextDate(
                                                    mostGamesPlayer.fromDate, mostGamesPlayer.toDate
                                                ))}
                                            </h4>
                                            <br />
                                            <p className={classes.cardProductDesciprion}>
                                                <GridItem xs={12} sm={12}
                                                          md={12}>
                                                    <Table
                                                        tableData={tableData}
                                                    />
                                                </GridItem>
                                            </p>
                                        </CardBody>
                                        <CardFooter product>
                                            <div className={classes.price}>
                                                Максимальное кол-во сыгранных
                                                игр:
                                                <h4>
                                                    {getMention(mostGamesPlayer)}
                                                    {mostGamesPlayer.nickname} {' - '}
                                                    {mostGamesPlayer.gamesTotal} {' '}
                                                    игр
                                                </h4>
                                            </div>
                                        </CardFooter>
                                        <CardFooter product>
                                            <div className={classes.price}
                                                 style={{width: '100%'}}>
                                                <NavLink
                                                    to={ratingByOneMonthLink}>
                                                    <Button color="primary"
                                                            style={{width: '100%'}}>
                                                        Подробнее
                                                    </Button>
                                                </NavLink>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </GridItem>
                            )
                        })}
                </GridContainer>
            </div>
        )
    }
}

RatingByMonths.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(dashboardStyle)(RatingByMonths)
