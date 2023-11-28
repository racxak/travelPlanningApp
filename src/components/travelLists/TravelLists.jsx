import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import AuthUser from "../auth/AuthUser";
import {
	collection,
	addDoc,
	onSnapshot,
	doc,
	updateDoc,
	deleteDoc,
	getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./TravelLists.module.css";
import styles1 from "../../pages/Pages.module.css";

import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import AddNote from "../AddNote";
import { AiOutlineMore } from "react-icons/ai";
import MoreWindow from "../MoreWindow";
import { useParams } from "react-router-dom";
import EmptyPage from "../emptyPage/EmptyPage";

const TravelLists = () => {
	const [userLists, setUserLists] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
	});
	const [inputErrors, setInputErrors] = useState({});
	const { currentUser } = useContext(AuthContext);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [openMoreId, setOpenMoreId] = useState(null);
	const { travelId } = useParams();
	const [currentListItems, setCurrentListItems] = useState([]);
	const [editedListItems, setEditedListItems] = useState([]);
	const [editingListId, setEditingListId] = useState(null);
	const [editedListTitle, setEditedListTitle] = useState("");
	const [isAddingItem, setIsAddingItem] = useState(false);
	const [newItemTitle, setNewItemTitle] = useState("");
	const [editingItemId, setEditingItemId] = useState(null);
	const [editedItemTitle, setEditedItemTitle] = useState("");

	const [isAddingItemWhileEditing, setIsAddingItemWhileEditing] =
		useState(false);

	const handleEdit = (list, item) => {
		setEditingListId(list.id);
		setEditedListTitle(list.title);
		if (item) {
			setEditingItemId(item.id);
			setEditedItemTitle(item.title);
		} else {
			setEditingItemId(null);
			setEditedItemTitle("");
		}
	};

	const saveChanges = async (id) => {
		try {
			const noteDocRef = doc(
				db,
				"allJournals",
				travelId,
				"userLists",
				editingListId
			);
			await updateDoc(noteDocRef, {
				title: editedListTitle,
			});

			setUserLists((prevLists) =>
				prevLists.map((list) =>
					list.id === editingListId ? { ...list, title: editedListTitle } : list
				)
			);
			setEditingListId(null);
			setEditedListTitle("");
		} catch (error) {
			console.log(error);
		}
	};

	const saveItemTitleEdit = async (listId, itemId, newTitle) => {
		const updatedLists = userLists.map((list) => {
			if (list.id === listId) {
				return {
					...list,
					items: list.items.map((item) => {
						if (item.id === itemId) {
							return { ...item, title: newTitle };
						}
						return item;
					}),
				};
			}
			return list;
		});

		setUserLists(updatedLists);

		try {
			const listDocRef = doc(db, "allJournals", travelId, "userLists", listId);
			await updateDoc(listDocRef, {
				items: updatedLists.find((list) => list.id === listId).items,
			});
		} catch (error) {
			console.error("Error updating item title: ", error);
		}
	};

	const saveItemChanges = async () => {
		const listDocRef = doc(
			db,
			"allJournals",
			travelId,
			"userLists",
			editingListId
		);

		const docSnap = await getDoc(listDocRef);
		if (docSnap.exists()) {
			const listData = docSnap.data();

			const updatedItems = listData.items.map((item) => {
				if (item.id === editingItemId) {
					return { ...item, title: editedItemTitle };
				}
				return item;
			});

			await updateDoc(listDocRef, { items: updatedItems });

			setUserLists((prevLists) =>
				prevLists.map((list) =>
					list.id === editingListId ? { ...list, items: updatedItems } : list
				)
			);
			setEditingItemId(null);
			setEditedItemTitle("");
			setIsAddingItemWhileEditing(false);
		}
	};


	const handleDelete = async (itemId) => {
    try {
        const listDocRef = doc(db, "allJournals", travelId, "userLists", editingListId);
        const docSnap = await getDoc(listDocRef);
        if (docSnap.exists()) {
            const listData = docSnap.data();
            const updatedItems = listData.items.filter(item => item.id !== itemId);

            await updateDoc(listDocRef, { items: updatedItems });

            setUserLists(prevLists =>
                prevLists.map(list => {
                    if (list.id === editingListId) {
                        return { ...list, items: updatedItems };
                    }
                    return list;
                })
            );
        }
    } catch (error) {
        console.log(error);
    }
};


	const ListItem = ({ listId, key, item }) => {
		const [localTitle, setLocalTitle] = useState(item.title);
		const handleLocalTitleChange = (e) => {
			setLocalTitle(e.target.value);
		};

		const handleSave = () => {
			saveItemTitleEdit(listId, item.id, localTitle);
		};

		return (
			<>
				{editingListId === listId ? (
					<div className={styles.centerListItems}>
						<input
							type="checkbox"
							id={item.id}
							name={item.title}
							checked={item.checked}
							onChange={(e) =>
								handleCheck({
									id: item.id,
									isChecked: e.target.checked,
									listId: listId,
								})
							}
						/>
						<input
							className={styles.editingItemTitle}
							type="text"
							value={localTitle}
							onChange={handleLocalTitleChange}
							onBlur={handleSave}
						/>
						<button
							onClick={() => handleDelete(item.id)}
							className={styles.deleteItemBtn}
						>
							<AiOutlineClose />
						</button>
					</div>
				) : (
					<div className={styles.centerListItems}>
						<input
							type="checkbox"
							id={item.id}
							name={item.title}
							checked={item.checked}
							onChange={(e) =>
								handleCheck({
									id: item.id,
									isChecked: e.target.checked,
									listId: listId,
								})
							}
						/>
						<label htmlFor={item.id}
						  className={item.checked ? styles.checkedItemLabel : ''}> {item.title}</label>
					</div>
				)}
			</>
		);
	};

	const handleCheck = async ({ id, isChecked, listId }) => {
		try {
			const listDocRef = doc(db, "allJournals", travelId, "userLists", listId);

			const docSnap = await getDoc(listDocRef);
			if (docSnap.exists()) {
				const listData = docSnap.data();

				const updatedItems = listData.items.map((item) => {
					if (item.id === id) {
						return { ...item, checked: isChecked };
					}
					return item;
				});

				await updateDoc(listDocRef, { items: updatedItems });

				setUserLists((prevLists) =>
					prevLists.map((list) =>
						list.id === listId ? { ...list, items: updatedItems } : list
					)
				);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const closePopup = () => {
		setIsPopupOpen(false);
		setFormData({
			title: "",
		});

		setNewItemTitle("");
		setIsAddingItem(false);
		setInputErrors({});
		setEditedListItems({});
	};

	useEffect(() => {
		if (currentUser && travelId) {
			const listsRef = collection(db, "allJournals", travelId, "userLists");

			const unsubscribeLists = onSnapshot(listsRef, (querySnapshot) => {
				const lists = [];
				querySnapshot.forEach((doc) => {
					let list = { id: doc.id, ...doc.data() };

					if (!Array.isArray(list.items)) {
						list.items = [];
					} else {
						list.items = list.items.map((item) => ({
							...item,
							checked: !!item.checked,
						}));
					}

					lists.push(list);
				});
				setUserLists(lists);
			});

			return () => {
				unsubscribeLists();
			};
		}
	}, [currentUser, travelId]);

	const handleAdd = async (e) => {
		e.preventDefault();
		let hasEmptyFields = false;
		let errors = {};
		if (!formData.title.trim()) {
			errors.title = "Tytuł jest wymagany";
			hasEmptyFields = true;
		}
		setInputErrors(errors);

		if (hasEmptyFields) {
			return;
		}

		let finalListItems = Array.isArray(currentListItems)
			? [...currentListItems]
			: [];

		if (newItemTitle.trim() !== "") {
			const newItem = {
				id: Math.random().toString(),
				title: newItemTitle,
				checked: false,
			};
			finalListItems.push(newItem);
		}

		try {
			const docRef = await addDoc(
				collection(db, "allJournals", travelId, "userLists"),
				{
					...formData,
					userUid: currentUser.uid,
					items: finalListItems,
				}
			);
			setNewItemTitle("");
			setIsAddingItem(false);
			setCurrentListItems([]);
			closePopup();
		} catch (err) {
			console.log(err);
		}
	};

	const handleAddListItem = () => {
		setIsAddingItem(true);
	};

	const handleAddListItemWhileEditing = () => {
		setIsAddingItemWhileEditing(true);
	};

	const handleSaveNewItem = () => {
		if (newItemTitle.trim() !== "") {
			const newItem = {
				id: Math.random(),
				title: newItemTitle,
				checked: false,
			};

			setCurrentListItems((prevItems) =>
				Array.isArray(prevItems) ? [...prevItems, newItem] : [newItem]
			);
			setNewItemTitle("");
			setIsAddingItem(false);
		}
	};

	const handleSaveNewItemWhileEditingList = async () => {
		if (newItemTitle.trim() !== "") {
			const newItem = {
				id: Math.random(),
				title: newItemTitle,
				checked: false,
			};

			setUserLists((prevLists) =>
				prevLists.map((list) => {
					if (list.id === editingListId) {
						return {
							...list,
							items: [...list.items, newItem],
						};
					}
					return list;
				})
			);

			try {
				const listDocRef = doc(
					db,
					"allJournals",
					travelId,
					"userLists",
					editingListId
				);
				const updatedList = userLists.find((list) => list.id === editingListId);
				await updateDoc(listDocRef, {
					items: updatedList ? [...updatedList.items, newItem] : [newItem],
				});
			} catch (error) {
				console.error("Error updating list in Firestore: ", error);
			}

			setNewItemTitle("");
			setIsAddingItemWhileEditing(false);
		}
	};

	const handleInput = (e) => {
		const id = e.target.id;
		const value = e.target.value;
		setFormData((prevState) => ({ ...prevState, [id]: value }));
	};

	return (
		<div className={styles.listsContainer}>
			<h2 className={styles.yoursListLabel}>Twoje listy </h2>
			<label> Dodaj nowy wpis</label>
	
			<button className={styles1.plusBtn} onClick={() => setIsPopupOpen(true)}>
				<AiOutlinePlus></AiOutlinePlus>
			</button>
			{userLists.length===0 && isPopupOpen===false&& <EmptyPage id="lists"/>}

			<div className={styles.pin_container}>
				<AddNote isOpen={isPopupOpen} closePopup={closePopup} isList={true}>
					<form className={styles.widthFixed} onSubmit={handleAdd}>
						<div className={styles.addNew}>
							<input
								className={
									inputErrors.title
										? `${styles.listTitle} ${styles1.errorInput}`
										: `${styles1.noteTitle} ${styles.listTitle}`
								}
								type="text"
								placeholder="Tytuł listy"
								value={formData.title}
								onChange={handleInput}
								id="title"
							/>

							{inputErrors.title && (
								<span className={styles1.errorMessage}>
									{inputErrors.title}
								</span>
							)}

							{currentListItems &&
								currentListItems.length > 0 &&
								currentListItems.map((item) => (
									<ListItem
										listId={currentListItems.id}
										key={item.id}
										item={item}
									/>
								))}

							{!isAddingItem && (
								<button
									onClick={handleAddListItem}
									className={`${styles1.plusBtn} ${styles.addNewItemList}`}
								>
									<AiOutlinePlus /> Dodaj element do listy
								</button>
							)}

							{isAddingItem && (
								<div className={styles.newListItem}>
									<input
										type="text"
										value={newItemTitle}
										onChange={(e) => setNewItemTitle(e.target.value)}
										className={`${styles1.reset} ${styles.newItemTitleInput}`}
									/>

									<button
										className={styles1.plusBtn}
										onClick={handleSaveNewItem}
									>
										<AiOutlinePlus></AiOutlinePlus>
									</button>
								</div>
							)}
						</div>
						<div className={styles.addBtnContainer}>
							<button className={styles1.btn} type="submit">
								Dodaj
							</button>
						</div>
					</form>
				</AddNote>

				{Array.isArray(userLists) &&
					userLists.map((list) => (
						<div key={list.id} className={`${styles.card} ${styles1.card}`}>
								  {editingListId !== list.id && (
							<button
								className={
									openMoreId === list.id
										? styles1.moreBtnBlock
										: styles1.moreBtn
								}
								onClick={() =>
									openMoreId === list.id
										? setOpenMoreId(null)
										: setOpenMoreId(list.id)
								}
							>
								<AiOutlineMore />
							</button>
									)}
							{openMoreId === list.id && (
								<MoreWindow
									isOpen={openMoreId}
									setIsOpen={setOpenMoreId}
									id={list.id}
									notes={userLists}
									setNotes={setUserLists}
									note={list}
									collectionPath={`allJournals/${travelId}/userLists`}
									isEditing={editingListId === list.id}
									setIsEditing={(isEditing) => {
										handleEdit(list);
									}}
								/>
							)}

							{editingListId === list.id ? (
								<>
									<h2 className={`${styles1.noteTitle} ${styles1.noteContent}`}>
										<input
											type="text"
											placeholder="Tutuł"
											className={`${styles1.reset}`}
											style={{ width: "100%", textAlign: "left" }}
											value={editedListTitle}
											onChange={(e) => setEditedListTitle(e.target.value)}
										/>
									</h2>

									{list.items &&
										list.items.map((item) => (
											<ListItem key={item.id} item={item} listId={list.id} />
										))}
									<div className={styles.fixPositionNewItemWhileEditingContainer}>
									{!isAddingItemWhileEditing && (
										<button
											onClick={handleAddListItemWhileEditing}
											className={`${styles1.plusBtn} ${styles.addNewItemList}`}
										>
											<AiOutlinePlus /> Dodaj element do listy
										</button>
									)}
									{isAddingItemWhileEditing && (
										<div className={styles.newListItem}>
											<input
												type="text"
												value={newItemTitle}
												onChange={(e) => setNewItemTitle(e.target.value)}
												className={`${styles1.reset} ${styles.newItemTitleInput}`}
											/>

											<button
												className={styles1.plusBtn}
												onClick={handleSaveNewItemWhileEditingList}
											>
												<AiOutlinePlus></AiOutlinePlus>
											</button>
											
										</div>
									)}

									<button
										onClick={() => {
											saveChanges();
											saveItemChanges();
										}}
										className={styles1.btn}
									>
										Zapisz
									</button>
									</div>
								</>
							) : (
								<>
									<h2 className={`${styles1.noteTitle} ${styles1.noteContent}`}>
										{list.title}
									</h2>
									{list.items &&
										list.items.map((item) => (
											<ListItem key={item.id} item={item} listId={list.id} />
										))}
								</>
							)}
						</div>
					))}
			</div>
		</div>
	);
};

export default TravelLists;
