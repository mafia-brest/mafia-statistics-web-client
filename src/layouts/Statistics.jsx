import withStyles from '@material-ui/core/styles/withStyles'

import image from 'assets/img/sidebar-1.jpg'

import appStyle
    from 'assets/jss/material-dashboard-pro-react/layouts/statisticsStyle.jsx'
import cx from 'classnames'
import StatisticsNavbar from 'components/Navbars/StatisticsNavbar.jsx'
import Sidebar from 'components/Sidebar/Sidebar.jsx'
import PropTypes from 'prop-types'
import React from 'react'
import {trackPromise} from 'react-promise-tracker'
import {Route, Switch} from 'react-router-dom'

import routes from 'routes.js'
import {
    ACCESS_TOKEN,
    mafiaStatisticsApi,
    utilApi
} from '../api/mafiaStatisticsApi'
import defaultAvatar from '../assets/img/default-avatar.png'
import logo from '../assets/img/nl-logo-white.png'
import Footer from '../components/Footer/Footer'
import LoadingIndicator from '../components/LoadingIndicator/LoadingIndicator'
import {trackMetriks} from '../util/util'

class Statistics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mobileOpen: false,
            miniActive: false,
            image: image,
            color: 'blue',
            bgColor: 'black',
            hasImage: true,
            fixedClasses: 'dropdown',
            currentUser: {
                id: '',
                nickname: '',
                gender: '',
                photoUrl: '',
                roles: []
            },
            authenticated: false,
            isLoading: true
        }
        this.resizeFunction = this.resizeFunction.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this)
    }

    componentDidMount() {
        trackMetriks(window.location.pathname)

        trackPromise(
            mafiaStatisticsApi.getPlayerById('me')
                .then(data => {
                        utilApi.isImageExists(data.photoUrl).then(
                            data => {
                            }, error => {
                                this.setState({
                                    currentUser: {
                                        ...this.state.currentUser,
                                        photoUrl: defaultAvatar
                                    }
                                })
                            }
                        )

                        this.setState({
                            currentUser: data,
                            authenticated: true
                        })
                    }, error => {
                        this.setState({
                            authenticated: false
                        })
                    }
                )
        ).then(r => this.setState({isLoading: false}))

        window.addEventListener('resize', this.resizeFunction)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFunction)
    }

    componentDidUpdate(e) {
        trackMetriks(e.history.location.pathname)

        if (e.history.location.pathname !== e.location.pathname) {
            this.refs.mainPanel.scrollTop = 0
            if (this.state.mobileOpen) {
                this.setState({mobileOpen: false})
            }
        }
    }

    loadCurrentlyLoggedInUser() {
        mafiaStatisticsApi.getPlayerById('me')
            .then(data => {
                    this.setState({
                        currentUser: data,
                        authenticated: true
                    })
                }, error => {
                    this.setState({
                        authenticated: false
                    })
                }
            )
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN)
        this.setState({
            authenticated: false,
            currentUser: null
        })
    }

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen})
    }

    getRoute() {
        return this.props.location.pathname !== '/statistics/full-screen-maps'
    }

    getActiveRoute = routes => {
        let activeRoute = ''
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveRoute = this.getActiveRoute(routes[i].views)
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute
                }
            } else {
                if (
                    window.location.href.indexOf(
                        routes[i].layout + routes[i].path.replace(':id?', '')
                    ) !== -1
                ) {
                    return routes[i].name
                }
            }
        }
        return activeRoute
    }
    getRoutes = routes => {
        return routes.map((prop, key) => {
            if (prop.collapse) {
                return this.getRoutes(prop.views)
            }
            if (prop.layout === '/statistics') {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        exact={prop.exact}
                        key={key}
                    />
                )
            } else {
                return null
            }
        })
    }

    sidebarMinimize() {
        this.setState({miniActive: !this.state.miniActive})
    }

    resizeFunction() {
        if (window.innerWidth >= 960) {
            this.setState({mobileOpen: false})
        }
    }

    render() {
        const {classes, ...rest} = this.props
        const mainPanel =
            classes.mainPanel +
            ' ' +
            cx({
                [classes.mainPanelSidebarMini]: this.state.miniActive
            })
        return (<>
                {this.state.isLoading
                    ? <LoadingIndicator />
                    : (<div className={classes.wrapper}>
                        <Sidebar
                            routes={routes}
                            logoText={'Ничего Личного'}
                            logo={logo}
                            image={this.state.image}
                            handleDrawerToggle={this.handleDrawerToggle}
                            open={this.state.mobileOpen}
                            color={this.state.color}
                            bgColor={this.state.bgColor}
                            miniActive={this.state.miniActive}
                            authenticated={this.state.authenticated}
                            currentUser={this.state.currentUser}
                            handleLogout={this.handleLogout}
                            {...rest}
                        />
                        <div className={mainPanel} ref="mainPanel">
                            <StatisticsNavbar
                                sidebarMinimize={this.sidebarMinimize.bind(this)}
                                miniActive={this.state.miniActive}
                                brandText={this.getActiveRoute(routes)}
                                handleDrawerToggle={this.handleDrawerToggle}
                                authenticated={this.state.authenticated}
                                currentUser={this.state.currentUser}
                                handleLogout={this.handleLogout}
                                {...rest}
                            />
                            {this.getRoute() ? (
                                <div className={classes.content}>
                                    <div className={classes.container}>
                                        <Switch>{this.getRoutes(routes)}</Switch>
                                    </div>
                                </div>
                            ) : (
                                <div className={classes.map}>
                                    <Switch>{this.getRoutes(routes)}</Switch>
                                </div>
                            )}
                            {this.getRoute() ? <Footer fluid /> : null}
                        </div>
                    </div>)}
            </>
        )
    }
}

Statistics.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(appStyle)(Statistics)
