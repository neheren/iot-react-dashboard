import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Drawer from './Drawer'
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import Login from './Login';
import auth from '../auth';
import Admin from './Admin';
import Customer from './Customer';
import { Select, Grid, Card, CardContent } from '@material-ui/core'
import Supplier from './Supplier';

const Root = styled.div`
    
`

const Header = styled.div`
	
`


class Basic extends Component {

	constructor(props){
		super(props)
		this.state = {
			users: [],
			chosenUser: null,
			adminLogin: null,
		}
	}

	componentDidMount() {
		this.setState({adminLogin: auth.getAuthToken(auth.USER_TYPES.ADMIN)})
	}

	updateThis = () => {
		this.forceUpdate()
	}


	render() {
		return (
			<Root>
				<Router>
						<Drawer>
							<Switch>
								<Route path="/customer">
									{auth.getAuthToken(auth.USER_TYPES.CUSTOMER)
										? <Customer onLogout={this.updateThis} />
										:	<> 
											<h1>
												Login as Customer
											</h1>
											<Login tokenType={auth.USER_TYPES.CUSTOMER} onLogin={this.updateThis} />
										</>
									}
								</Route>
								<Route path="/admin">
									{auth.getAuthToken(auth.USER_TYPES.ADMIN)
										? <Admin onLogout={this.updateThis} />
										:	<> 
											<h1>
												Login as Administrator
											</h1>
											<Login tokenType={auth.USER_TYPES.ADMIN} onLogin={this.updateThis} />
										</>
									}
								</Route>
								<Route path="/supplier">
									{auth.getAuthToken(auth.USER_TYPES.SUPPLIER)
										? <Supplier onLogout={this.updateThis} />
										: <Login tokenType={auth.USER_TYPES.SUPPLIER} onLogin={this.updateThis} />
									}
								</Route>
								<Route path="/settings">
									settings
								</Route>
								<Route path="/">
								<Card>
									<CardContent>
										<h1>IoT Excerise 2 Dashboard</h1>
										<h2>Implemented by:</h2>
										<ul>
											<li>Anton Sandberg</li>
											<li>Nikolaj Schlüter</li>
											<li>Sune Klem</li>
										</ul>
									</CardContent>
								</Card>

								</Route>
							</Switch>
						</Drawer>
				</Router>
			</Root>
		)
	}
}

Basic.propTypes = {}

export default Basic

