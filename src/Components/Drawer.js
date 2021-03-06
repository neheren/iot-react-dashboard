import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import PowerIcon from '@material-ui/icons/Power';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from "react-router-dom";
import { Container } from '@material-ui/core'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const customerTheme = createMuiTheme({
	palette: {
		primary: {
			main: '#70b0ec',
		},
	}   
})



const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
		},
		appBarShift: {
			marginLeft: drawerWidth,
			width: `calc(100% - ${drawerWidth}px)`,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		menuButton: {
			marginRight: 36,
		},
		hide: {
			display: 'none',
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
			whiteSpace: 'nowrap',
		},
		drawerOpen: {
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		drawerClose: {
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			overflowX: 'hidden',
			width: theme.spacing(7) + 1,
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(9) + 1,
			},
		},
		toolbar: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			padding: theme.spacing(0, 1),
			// necessary for content to be below app bar
			...theme.mixins.toolbar,
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(3),
		},
	}),
);

export default function MiniDrawer(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = React.useState(true);
	const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const updateCurrentPath = () => {
		setCurrentPath(window.location.pathname)
	} 


	const chosenTheme = ({
		'/admin': createMuiTheme({
			palette: {
				primary: {
					main: '#191f52',
				},
			}   
		}), 
		'/customer': createMuiTheme({
			palette: {
				primary: {
					main: '#5D88BB',
				},
			}   
		}),
		'/supplier': createMuiTheme({
			palette: {
				primary: {
					main: '#292733',
				},
			}   
		}),
	})[currentPath]

	return (
		<ThemeProvider theme={chosenTheme}>
		<div className={classes.root}>
				<CssBaseline />
				<AppBar
					position="fixed"
					className={clsx(classes.appBar, {
						[classes.appBarShift]: open,
					})}
				>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
							edge="start"
							className={clsx(classes.menuButton, {
								[classes.hide]: open,
							})}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" noWrap>
							{({'/admin': 'Admin', '/customer': 'Customer', '/supplier': 'Supplier'})[currentPath]} controlpanel
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open,
					})}
					classes={{
						paper: clsx({
							[classes.drawerOpen]: open,
							[classes.drawerClose]: !open,
						}),
					}}
				>
					<div className={classes.toolbar}>
						<IconButton onClick={handleDrawerClose}>
							{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
						</IconButton>
					</div>
					<Divider />
					<List onClick={updateCurrentPath}>
						<Link to="/" >
							<ListItem button selected={currentPath === '/'}>
								<ListItemIcon> <HomeIcon/> </ListItemIcon>
								<ListItemText primary={'Home'} />
							</ListItem>
						</Link>
					</List>
					<Divider />
					<List onClick={updateCurrentPath}>
						<Link to="/customer" >
							<ListItem button selected={currentPath === '/customer'}>
								<ListItemIcon> <PersonIcon/> </ListItemIcon>
								<ListItemText primary={'Customer'} />
							</ListItem>
						</Link>
						
						<Link to="/admin" >
							<ListItem button selected={currentPath === '/admin'}>
								<ListItemIcon> <SupervisorAccountIcon/> </ListItemIcon>
								<ListItemText primary={'Administrator'} />
							</ListItem>
						</Link>
					</List>
					<Divider />
					<List onClick={updateCurrentPath}>
						<Link to="/supplier" >
							<ListItem button selected={currentPath === '/supplier'}>
								<ListItemIcon><PowerIcon/></ListItemIcon>
								<ListItemText primary={'Electricity Supplier'} />
							</ListItem>
						</Link>
					</List>
					{/* <List>
						<Link to="/settings">
							<ListItem button>
								<ListItemIcon><SettingsIcon/></ListItemIcon>
								<ListItemText primary={'Settings'} />
							</ListItem>
						</Link>
					</List> */}
				</Drawer>
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Container>
						{props.children}
					</Container>
				</main>					
		</div>

		</ThemeProvider>
	);
}
