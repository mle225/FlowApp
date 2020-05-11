// import built in library
import React from 'react';
import PropTypes from 'prop-types';
import "tachyons";

// import developers's dependencies
import "./Common/Accounting.css";
import "./Common/background.css";
import backLogo from "./Common/settings.png"
// import fake data
// import {task, accountings} from "./Common/example_accountings.js";

import BackBt from './Common/BackBt';
import SearchBar from './Common/SearchBar';
import Butt from './Common/Butt';

export default class Accounting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: '',
			searchfield: '',
			event: {
				id: '',
				name: '',
				accountings: [],
			},
			edited: false,
		}
	}
	// ok
	static propTypes = {
		eventid: PropTypes.string,
		changePage: PropTypes.func,
	}

	// ok 
	componentDidMount = () => {
		this.fetchData()
	}
	
	fetchData = () => {
		const link = "http://localhost:3000/getAccountingPage/" + this.props.eventid
		fetch(link)
		.then(response => response.json())
		.then(event => {
			this.loadEvent(event)
			if (!event.accountings[0]) {
				this.state.event.accountings=[];
			}
		})
		.catch(err => console.log("Couldn't show accounting page"))
	}

	// ok
	loadEvent = (data) => {
	    this.setState({ event: {
	    	id: data.id,
	    	name: data.name,
	    	accountings: data.accountings,
	    }})
	}

	// ok
	back = () => {
		this.props.changePage('tasks');
	}

	// ok
	searchChange = (event) => {
		this.setState({searchfield : event.target.value})
	}

	// ok
	updateEdited = () => {
		this.setState({edited: true})
	}

	// ok
	save = (event) => {
		if (!this.state.edited) {
			console.log("Yo yo yo, edit something mother fucker");
			this.fetchData();
		} else {
			const saveData = this.state.event.accountings.forEach(acc => {
				fetch('http://localhost:3000/saveaccounting', {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
			          memberid: acc.id,
			          eventid: this.state.event.id,
			          paid: acc.paid,
			          joined: acc.joined,
					})
				})
				.then(response => {
					console.log("succeed");
				})
				.catch(err => console.log("some stupid problems with saving data"));			
			})
		}
	}

	render () {
		const accountings = this.state.event.accountings;
		const fAcc = accountings.filter(acc => {
				return acc.name.toLowerCase().includes(this.state.searchfield.toLowerCase());
			})  
		return (
			<div id="accounting-screen">
				<div class="not-flow">
					<TopBar 
						back={this.back}
						task={this.state.event.name}
						/>
					<SearchBar
						searchChange={this.searchChange}
					/>
					<Title/>
					<RowName/>
			 	</div>
			 	<div class="flow">
					<List 
						accountings={fAcc}
						updateEdited={this.updateEdited}
					/>
				</div>
				<div className="tc">
					<Butt 
						className='gen'
						onClick={this.save}
						value="Save Values"
					/>
				</div>
			</div>
		)
	}
}

class TopBar extends React.Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
		task: PropTypes.object,
	}

	render () {
		const task = this.props.task;

		return (
		  	<div id = "accounting-top-bar" className = "flex items-center w-100">
	  			{/* Back */}
		  		<BackBt 
		  			onClick={this.props.back}
		  		/>
		  		{/* Task */}
		  		<div class = "pt1 pl3 pr3 f3 tr white b">
		  			<div id = "TASK">Task:</div>
		  		</div>

		  		{/* Name */}
		  		<div class = "pt1 pl3 pr3 f3 tl white b">
		  			<div id = "accounting-task">{task}</div>
		  		</div>
		  	</div>
		)
	}
}

class Title extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
	  		<div id = "ACCOUNTING" className = "pb3 f3 white b tc">Accounting</div>
		)
	}
}

class RowName extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
		  	<div id = "accounting-title-row" className = "pb3 dt flex justify-around w-100 white b">
		  		{/* Name */}
		  		<div id = "accounting-title-name" className = "pl2 plr2 w-third dtc tc">
		  			Name
		  		</div>

		  		{/* Pay */}
		  		<div id = "accounting-title-pay" className = "pl2 plr2 w-third dtc tc">
		  			Pay
		  		</div>

		  		{/* Joined */}
		  		<div id="accounting-title-joined" className = "pl2 plr2 w-third dtc tc">
		  			Joined
		  		</div>
		  	</div>
		)
	}
}

class List extends React.Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
		accountings: PropTypes.object,
		updateEdited: PropTypes.func,
	}

	render () {
	  const accountings = this.props.accountings;

	  const rows = []
	  let i = 0

	  accountings.forEach((accounting) => {
	  	let rowType = null;
	  	if (i % 2 !== 0) {
	  		rowType = "row-one";
	  	} else {
	  		rowType = "row-two";
	  	}
	  	i = i + 1;

	  	rows.push(
	  		<Row rowType={rowType} accounting={accounting} updateEdited={this.props.updateEdited}/>
	  	);
	  });

	  return (
	  	<div>
	  		{rows}
	  	</div>
	  );
	}
}

class Row extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			accounting: this.props.accounting,
			paid : this.props.accounting.paid,
			joined : this.props.accounting.joined
		}
	}

	static propTypes = {
		rowType: PropTypes.string,
		accounting: PropTypes.object,
		updateEdited: PropTypes.func,
	}

	updatePaid = event => {
		this.setState({paid: event.target.value})
		this.props.accounting.paid = event.target.value
		this.props.updateEdited()
	}

	updateJoined = event => {
		this.setState({joined: event.target.checked})
		this.props.accounting.joined = event.target.checked
		this.props.updateEdited()
	}

	render () {
		const rowType = this.props.rowType;
		const name = this.props.accounting.name;
		const id = "user-" + this.props.accounting.id;
		const {paid, joined} = this.state;
		return (
			<div className="accounting-row-wrapper" id = {id}>
			  	<div className = {rowType}>
				  	<div className = "dt flex justify-between accounting-row">
				  		{/* Name */}
				  		<div className = "dtc tc w-third accounting-name">
				  			{name}
				  		</div>

				  		{/* Pay */}
				  		<div className = "dtc tc w-third accounting-pay">
				  			<input className = "input-pay"
								type="number"
							   	defaultValue = "0"
						       	value={paid}
						       	onChange={this.updatePaid}
						    />
				  		</div>

				  		{/* Joined */}
				  		<div className = "dtc tc w-third accoungint-joined">
							{joined === true
								? <input defaultChecked type="checkbox" onChange={this.updateJoined}/>
							    : <input type="checkbox" onChange={this.updateJoined}/>
							}
				  		</div>

				  	</div>
			  	</div>
		  	</div>

		)
	}
}
