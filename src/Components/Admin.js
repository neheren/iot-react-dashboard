import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash';
import Chart from './Chart'
import moment from 'moment'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import { Select, Grid, Card, CardContent } from '@material-ui/core'
import Logout from './Logout'
import auth from '../auth'
import List from '@material-ui/core/List'
import DatePicker from '../DatePicker'
import UserThump from './UserThump';



export default class Admin extends Component {
    static propTypes = {
        onLogout: PropTypes.func,
    }

	constructor(props){
		super(props)
		this.state = {
			users: [],
			chosenUser: null,
            login: auth.getAuthToken(auth.USER_TYPES.ADMIN),
            fromDate: moment().subtract(7, 'days'),
            toDate: moment(),

		}

    }
    
    
    getUsers = async () => {
        let response = await fetch (
            `https://smart-meter-app-iot.herokuapp.com/admin/return-users?secret_token=${this.state.login.token}`
        )

        let data = await response.json()

        for (let i = 0; i < data.result.length; i++) {
          const whData = await this.getAverageWh(data.result[i].id)
          console.log({whData})
          data.result[i].avgKWh = Math.round(whData.avgKWh * 10) / 10
          data.result[i].totalSpending = Math.round(whData.totalSpending * 10) / 10
        }
        
        return data.result
    }

    getAverageWh = async (userId) => {
        try{
            let response = await fetch (
                `https://smart-meter-app-iot.herokuapp.com/admin/avg-spending/${userId}?secret_token=${
                    this.state.login.token
                }&startDate=${
                    moment().startOf('month').format('YYYY-MM-DD')
                }&endDate=${
                    moment().format('YYYY-MM-DD')
                }`
            )
            let data = await response.json()
            console.log({data})
            return data.result
        } catch(e) { 
            return 'could not get'
        }
    } 

	componentDidMount() {
        this.getUsers().then((users) => {
            this.setState({
                users: users,
                chosenUser: users[0].id,
            })
        })
    }
    

    render() {
        const { login, users, chosenUser } = this.state
        const chosenUserObejct = _.filter(users, user => chosenUser == user.id)[0]
        return login && (
            <div>
                <Grid container spacing={2}>
                    <Grid item sm={12} >
                        <Card elevation={2}>
                            <CardContent>
                                <Grid container>
                                    <Grid item sm={12} md={6} >
                                        <h2>
                                            Welcome, {login.user.firstName + ' ' + login.user.lastName}
                                        </h2>
                                        <Typography color="textSecondary">
                                            Email: <b>{login.user.email}</b>
                                        </Typography>
                                        <br/>
                                        <Logout tokenType={auth.USER_TYPES.ADMIN} onLogout={this.props.onLogout}/>
                                    </Grid>
                                    <Grid item sm={12} md={6} >
                                        <List style={{
                                                width: '100%',
                                                overflowY: "auto",
                                                maxHeight: 500,
                                            }}>
                                            <h3>
                                                Administrator of
                                            </h3>
                                                {
                                                    this.state.users.map((user, i) => i < 3 ?
                                                        <UserThump user={user} />
                                                        : <p>...</p>
                                                    )

                                                }
                                        </List>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item sm={12} >
                        <Card elevation={2}>
                            <CardContent >
                                <h2>Power usage of {chosenUserObejct && chosenUserObejct.firstName}</h2>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <br/>
                                        <FormControl variant="outlined" fullWidth>
                                            <InputLabel>User</InputLabel>
                                            <Select
                                            value={this.state.chosenUser || 0}
                                            onChange={(event) => this.setState({chosenUser: event.target.value})}
                                            label="User"
                                            >
                                            {
                                                this.state.users.map((user) => <MenuItem key={user.id} value={user.id}>{user.meterId + ': ' + user.firstName + ' ' + user.lastName}</MenuItem>)
                                            }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <DatePicker  label="From date"
                                            selectedDate={this.state.fromDate}
                                            handleDateChange={date => this.setState({fromDate: moment(date)})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <DatePicker label="To date"
                                                selectedDate={this.state.toDate}
                                                handleDateChange={date => this.setState({toDate: moment(date)})}
                                            />
                                    </Grid>
                                </Grid>
                                {
                                    this.state.chosenUser && <Chart 
                                        type={auth.USER_TYPES.ADMIN}
                                        token={this.state.login.token}
                                        id={this.state.chosenUser}
                                        fromDate={this.state.fromDate}
                                        toDate={this.state.toDate}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
