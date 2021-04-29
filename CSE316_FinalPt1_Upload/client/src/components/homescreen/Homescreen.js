import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import Globe							from '../../transparent_globe_altered.png'
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../modals/Login';
import Update 							from '../modals/Update';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction
	} 				from '../../utils/jsTPS';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import WInput from 'wt-frontend/build/components/winput/WInput';
import { waitFor } from '@testing-library/dom';
import WCard from 'wt-frontend/build/components/wcard/WCard';
import WCContent from 'wt-frontend/build/components/wcard/WCContent';


const Homescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [showUpdate, toggleShowUpdate] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showHomeScreen, toggleHomeScreen] = useState(true);

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [SortItems]				= useMutation(mutations.SORT_ITEMS);
	const [UpdateCollection]		= useMutation(mutations.UPDATE_COLLECTION);
	const[RevertCollection]			= useMutation(mutations.REVERT_COLLECTION);
	// const [MoveListToTop] 			= useMutation(mutations.SET_LIST_TO_TOP);

	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { todolists = data.getAllTodos; }

	const auth = props.user === null ? false : true;

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);
			}
		}
	}

	const tpsUndo = async () => {
		console.log("UNDOING");
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		setActiveList(activeList);
		console.log(activeList.items);
		return retVal;
	}

	const tpsRedo = async () => {
		console.log("REDOING");
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		return retVal;
	}


	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		const lastID = items.length >= 1 ? items[items.length - 1].id + 1 : 0;
		const newItem = {
			_id: '',
			id: lastID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: 'Not Assigned',
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item, index) => { 
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		console.log(value);
		console.log(prev);
		if(!(value==prev)){
			let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
			props.tps.addTransaction(transaction);
			tpsRedo();
		}

	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const createNewList = async () => {
		const length = todolists.length
		const id = length >= 1 ? todolists[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
		let list = {
			_id: '',
			id: id,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
		}
		const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
		await refetchTodos(refetch);
		if(data) {
			let _id = data.addTodolist;
			handleSetActive(_id);
		} 
	};

	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		refetch();
		setActiveList({});
	};

	const updateListField = async (_id, field, value, prev) => {
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const handleSetActive = (id) => {
		//Renders the boolean value for the all lists to be false
		// todolists.map((list) => (list.isTopList=false));

		// todolists.map((list) => (console.log(list.isTopList)));
		//Finds the new todolist to be the top one
		const todo = todolists.find(todo => todo.id === id || todo._id === id);
		console.log(todolists);
		console.log(todolists[0]);
		console.log(todo);
		console.log("ACTIVE ID " + todo.id);

		const headList = todo;
		const baseList = todolists.filter(list => list.id!=todolists[0].id);

		console.log("ACTIVE LIST: " + headList);
		console.log("BASE LIST : " + baseList);
		baseList.unshift(headList);
		console.log("NEW LIST: " + baseList);
		// let index = 0;
		// for(let i =0; i<todolists.length; i++){
		// 	if(todolists[i].id===id||todo._id===id)
		// 		index = i;
		// }
		setActiveList(todo);
	};

	const setListToTop = (id) => {

	}

	const seeNewList = async (list) => {
		console.log("REACHED");
		const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
		setActiveList(list);
	}
	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		console.log("Logging in");
		toggleShowUpdate(false);
		toggleShowCreate(false);
		toggleHomeScreen(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		console.log("Creating");
		toggleShowUpdate(false);
		toggleShowLogin(false);
		toggleHomeScreen(false);
		toggleShowCreate(!showCreate);
	};

	const setShowUpdate = () => {
		console.log("UPDATING");
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleHomeScreen(false);
		toggleShowUpdate(!showUpdate)
	}

	const setHomeScreen = () => {
		console.log("Logging out: displaying home screen");
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleHomeScreen(!showHomeScreen);
	}

	const test = () => {
		console.log("TEST");
	}

	const updateUser = () => {
		console.log("TEST11");
	}

	return (
		<>
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' 
								setHomeScreen={setHomeScreen}
							/>
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
							setShowUpdate={setShowUpdate}
							logout={setHomeScreen}
							user={props.user}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			


			<Router>
				<div className="Homescreen">
					<Nav />
					<Switch>
						<Route path="/" exact component={Homescreen}/>
					</Switch>
				</div>
			</Router>
			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchTodos={refetch} setShowLogin={setShowLogin} />)
			}

			{
				showUpdate && (<Update fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} setHomeScreen={setHomeScreen} updateUser={updateUser}/>)
			}


			{	(showHomeScreen) && (
				<> 
					<h1 className="welcome-prompt">
							Welcome to the World Data Mapper
					</h1>
					<img className="welcome-icon" src={Globe} alt="welcome image"/>
				</>
				)
			}
		</WLayout>

		</>
	);
};

export default Homescreen;