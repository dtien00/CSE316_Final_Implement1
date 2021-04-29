const ObjectId = require('mongoose').Types.ObjectId;
const Todolist = require('../models/todolist-model');


// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of todolist objects on success, and an empty array on failure
		**/
		getAllTodos: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const todolists = await Todolist.find({owner: _id});
			if(todolists) return (todolists);

		},
		/** 
		 	@param 	 {object} args - a todolist id
			@returns {object} a todolist on success and an empty object on failure
		**/
		getTodoById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const todolist = await Todolist.findOne({_id: objectId});
			if(todolist) return todolist;
			else return ({});
		},

	},
	Mutation: {
		/** 
		 	@param 	 {object} args - a todolist id and an empty item object
			@returns {string} the objectID of the item or an error message
		**/
		addItem: async(_, args) => {
			//Revision #2
			const { _id, item , index } = args;
			const listId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Todolist.findOne({_id: listId});
			if(!found) return ('Todolist not found');
			if(item._id === '') item._id = objectId;
			let listItems = found.items;

			//Revision #2
			if(index < 0) listItems.push(item);
  			else listItems.splice(index, 0, item);
			
			const updated = await Todolist.updateOne({_id: listId}, { items: listItems });

			if(updated) return (item._id);

			else return ('Could not add item');
		},
		/** 
		 	@param 	 {object} args - an empty todolist object
			@returns {string} the objectID of the todolist or an error message
		**/
		addTodolist: async (_, args) => {
			const { todolist } = args;
			const objectId = new ObjectId();
			const { id, name, owner, items } = todolist;
			const newList = new Todolist({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				items: items
			});
			const updated = newList.save();
			if(updated) return objectId;
			else return ('Could not add todolist');
		},
		/** 
		 	@param 	 {object} args - a todolist objectID and item objectID
			@returns {array} the updated item array on success or the initial 
							 array on failure
		**/
		deleteItem: async (_, args) => {
			const  { _id, itemId } = args;
			const listId = new ObjectId(_id);
			const found = await Todolist.findOne({_id: listId});
			let listItems = found.items;
			listItems = listItems.filter(item => item._id.toString() !== itemId);
			const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
			if(updated) return (listItems);
			else return (found.items);

		},
		/** 
		 	@param 	 {object} args - a todolist objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteTodolist: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Todolist.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},
		/** 
		 	@param 	 {object} args - a todolist objectID, field, and the update value
			@returns {boolean} true on successful update, false on failure
		**/
		updateTodolistField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Todolist.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "";
		},
		/** 
			@param	 {object} args - a todolist objectID, an item objectID, field, and
									 update value. Flag is used to interpret the completed 
									 field,as it uses a boolean instead of a string
			@returns {array} the updated item array on success, or the initial item array on failure
		**/
		updateItemField: async (_, args) => {
			// console.log("YESSSSSSS");
			const { _id, itemId, field,  flag } = args;
			let { value } = args
			const listId = new ObjectId(_id);
			const found = await Todolist.findOne({_id: listId});
			let listItems = found.items;
			if(flag === 1) {
				if(value === 'complete') { value = true; }
				if(value === 'incomplete') { value = false; }
			}
			listItems.map(item => {
				if(item._id.toString() === itemId) {	
					
					item[field] = value;
				}
			});
			const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
			if(updated) return (listItems);
			else return (found.items);
		},
		/**
			@param 	 {object} args - contains list id, item to swap, and swap direction
			@returns {array} the reordered item array on success, or initial ordering on failure
		**/
		reorderItems: async (_, args) => {
			// console.log("SUCCESS");
			const { _id, itemId, direction } = args;
			const listId = new ObjectId(_id);
			const found = await Todolist.findOne({_id: listId});
			let listItems = found.items;
			const index = listItems.findIndex(item => item._id.toString() === itemId);
			// move selected item visually down the list
			if(direction === 1 && index < listItems.length - 1) {
				let next = listItems[index + 1];
				let current = listItems[index]
				listItems[index + 1] = current;
				listItems[index] = next;
			}
			// move selected item visually up the list
			else if(direction === -1 && index > 0) {
				let prev = listItems[index - 1];
				let current = listItems[index]
				listItems[index - 1] = current;
				listItems[index] = prev;
			}
			const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
			if(updated) return (listItems);
			// return old ordering if reorder was unsuccessful
			listItems = found.items;
			return (found.items);

		},

		//EXPERIMENT
		sortItems: async (_, args) => {
			const {_id, field} = args;
			const listId = new ObjectId(_id);
			const found = await Todolist.findOne({_id: listId});
			const newList = [...found.items];
			if(field=='default')
				return newList;
			else if(field=='description')
				newList.sort((a,b) => a.description.localeCompare(b.description));
			else if(field=='due_date')
				newList.sort((a,b) => a.due_date.localeCompare(b.due_date));
			else if(field=='completed')
				newList.sort((a,b) => (a.completed==true ? 'c':'i').localeCompare((b.completed==true ? 'c':'i')));
			else if(field=='assigned_to')
				newList.sort((a,b) => a.assigned_to.localeCompare(b.assigned_to));
			if(newList.toString()==found.items.toString())
				newList.reverse();
			
			const updated = await Todolist.updateOne({_id: listId}, {items: newList});
			// const experimentList = await Todolist.update({_id: listId}, {$unset:{"__typename":""}});
			console.log("completed");
			console.log(typeof(newList));
			console.log(newList);
			return newList;
			// return experimentList;

			/*const {_id, field} = args;
			console.log("FIELD: " + field);
			const listId = new ObjectId(_id);
			// const found = await Todolist.findOne({_id: listId}).sort('description')
			// const found = await (Todolist.findOne({_id: listId}))//.sort({description : 1});
			const found = await (Todolist.findOne({_id: listId}));
			console.log(found);
			// return found.items;
			console.log("FOUND ITEMS: ", found.items);

			const newList = [...found.items]

			for(let i = 0; i<newList.length; i++){
				for(let j = i; j<newList.length; j++){
					// console.log("COMPARING: " + (newList[i].description) + " VS " + (newList[j].description) +
					// 	" " + (newList[i].description).localeCompare(newList[j].description))
					if((newList[i].description).localeCompare(newList[j].description)>0){
						var temp = newList[i];
						newList[i]=newList[j];
						newList[j]=temp;
					}
				}

			}		

			// console.log("CHECK: ", [...found.items].toString())
			// console.log("NEW LIST: ", newList.toString())
			console.log("EQUALITY: ", [...found.items].toString()==newList.toString())
			if([...found.items].toString()==newList.toString()){
				// console.log("REVERSING");
				newList.reverse();
			}

			console.log("SORTED LIST: ", newList)

			// console.log("LIST ID : " + listId);
			// const updated = await Todolist.updateOne({_id: listId}, {items: newList});
			// const result = await (Todolist.findOne({_id: listId}))
			// console.log("RESULT: ", newList);
			// console.log(updated);
			console.log("boop");
			return newList;*/

		},

		updateCollection: async (_, args) => {
			const {items, _id} = args;
			const listId = _id;
			const newItems = items;
			console.log("reached");
			// const updated = await Todolist.replaceOne({_id: listId}, newItems)
			// console.log("_ID: ", _id);
			// const updated = await Todolist.updateOne({_id: listId}, {items: newList});
			return true;
			/*console.log("REACHED");
			const {newList, _id} = args;
			console.log("UPDATING COLLECTION ASASAS");
			const updated = await Todolist.updateOne({_id: _id}, {items: newList});
			if(updated)
				return true;
			return false;*/

		},


		revertCollection: async (_, args) => {
			const {oldList, listID} = args;
			console.log("reverted");
			const listIDO = ObjectId(listID);
			const found = await Todolist.findOne({_id: listIDO});
			const updated = await found.updateOne({items: oldList});
			console.log("OLD LIST ", oldList);
			console.log("UPDATED LIST ", found);
			if(updated)
				return true;
			return false;
		}

	}
}
			// found.sort({'description' : 1});
			// listItems.sort('description');
			// if(field=='description')
			// 	listItems.sort(
			// 		{description: 1}
			// 	);
			// else if(field=='due_date')
			// 	listItems.sort((a,b) => a.due_date.localeCompare(b.due_date));
			// else if(field=='completed')
			// 	listItems.sort(
			// 		'completed'
			// 	);
			// else if(field=='assigned_to')
			// 	listItems.sort((a,b) => a.assigned_to.localeCompare(b.assigned_to));

			// console.log("LIST:");
			// newList.forEach((item)=> (console.log(item.description + " " + item.due_date + " " + item.completed)));
			// console.log("___");
			// console.log("Comparing list: ");
			// found.items.forEach((item)=> (console.log(item.description + " " + item.due_date + " "  + item.completed)));

			// console.log("EQUAL? " + newList==[...found.items]);