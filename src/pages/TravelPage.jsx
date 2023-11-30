import React, { useState, useEffect, useRef, mapRef } from "react";
import Navbar from "../components/navbar/Navbar";
import AuthUser from "../components/auth/AuthUser";
import MyMap from "../components/map/Map";
import styles from "./Pages.module.css";
import { AiOutlineMore, AiOutlineSearch } from "react-icons/ai";
import MoreWindow from "../components/MoreWindow";
import {
	collection,
	updateDoc,
	doc,
	onSnapshot,
	getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { journalNotesInputs } from "../components/journalSource";
import TravelLists from "../components/travelLists/TravelLists";
import EmptyPage from "../components/emptyPage/EmptyPage";
import Spinner from '../components/spinner/Spinner';

const travelButtons = [
	{ label: "Podróże", path: "/twoje-podroze" },
	{ label: "Dziennik", path: "/dziennik" },
	{ UserComponent: <AuthUser />, path: "#" },
];

const TravelPage = () => {
	const [listTitle, setListTitle] = useState("");

	const { travelId } = useParams();
	const [userMarkers, setUserMarkers] = useState([]);
	const { currentUser } = useContext(AuthContext);
	const [openMoreId, setOpenMoreId] = useState(null);
	const [editingMarkerId, setEditingMarkerId] = useState(null);
	const [editedMarkerTitle, setEditedMarkerTitle] = useState("");
	const [editedMarkerInfo, setEditedMarkerInfo] = useState("");
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredMarkers = userMarkers.filter((marker) =>
		`${marker.title} ${marker.geocode[0]} ${marker.geocode[1]} ${marker.info}`
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);
	
	useEffect(() => {
		if (currentUser && travelId) {
			const markersRef = collection(db, "allJournals", travelId, "userMarkers");

			const unsubscribe = onSnapshot(markersRef, (querySnapshot) => {
				const markers = [];
				querySnapshot.forEach((doc) => {
					markers.push({ id: doc.id, ...doc.data() });
				});
				setUserMarkers(markers);
				setLoading(false); 
			});

			const docRef = doc(db, "allJournals", travelId);
			getDoc(docRef)
				.then((docSnap) => {
					if (docSnap.exists()) {
						setListTitle(docSnap.data().title);
					} else {
						console.log("No such document!");
					}
				})
				.catch((error) => {
					console.log("Error getting document:", error);
				});
			return () => unsubscribe();
		}
	}, [currentUser, travelId]);


	const handleEdit = (marker) => {
		setEditingMarkerId(marker.id);
		setEditedMarkerTitle(marker.title);
		setEditedMarkerInfo(marker.info);
	};

	const saveChanges = async (id) => {
		try {
			await updateDoc(doc(db, "allJournals", travelId, "userMarkers", id), {
				title: editedMarkerTitle,
				info: editedMarkerInfo,
			});
			const updatedMarkers = userMarkers.map((n) =>
				n.id === id
					? { ...n, title: editedMarkerTitle, info: editedMarkerInfo }
					: n
			);
			setUserMarkers(updatedMarkers);
			setEditingMarkerId(null);
			setEditedMarkerTitle("");
			setEditedMarkerInfo("");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Navbar buttons={travelButtons} />
			<div className={styles.pageContainer}>
				<h1 className={styles.travelTitleLabel}>{listTitle}</h1>
				<div className={styles.mapAndNotesContainer}>
					<MyMap/>
					<div className={styles.locations}>
						<h2 className={styles.savedLoc}>Zapisane lokalizacje</h2>
						
						<input
							type="text"
							placeholder="Znajdź swoje ulubione miejsca"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={styles.searchBar}
						/>

						<div className={styles.markersList}>

						{filteredMarkers.length===0 && loading===false && <EmptyPage id="markers"/>}
						
						{loading===true && <Spinner id="markers"/>}

							{filteredMarkers.map((marker) => (
									<div

										className={styles.markersListItem}
										key={marker.id}
									>
										{editingMarkerId !== marker.id && (
											<button
												className={
													openMoreId === marker.id
														? styles.moreBtnBlock
														: styles.moreBtn
												}
												onClick={() =>
													openMoreId === marker.id
														? setOpenMoreId(null)
														: setOpenMoreId(marker.id)
												}
											>
												<AiOutlineMore />
											</button>
										)}
										{openMoreId === marker.id && (
											<MoreWindow
												isOpen={openMoreId}
												setIsOpen={setOpenMoreId}
												id={marker.id}
												notes={userMarkers}
												setNotes={setUserMarkers}
												note={marker}
												collectionPath={`allJournals/${travelId}/userMarkers`}
												isEditing={editingMarkerId === marker.id}
												setIsEditing={(isEditing) => {
													handleEdit(marker);
												}}
											></MoreWindow>
										)}
										{editingMarkerId === marker.id ? (
											<div className={styles.editingMarkers}>
												<input
													className={`${styles.reset} ${styles.title}`}
													type="text"
													value={editedMarkerTitle}
													placeholder="tytuł"
													onChange={(e) => setEditedMarkerTitle(e.target.value)}
												/>
												<span
													className={`${styles.longitudeAndLatitude}`}
													style={{ marginBottom: "4px" }}
												>
													{marker.geocode[0]}, {marker.geocode[1]}
												</span>
												<input
													className={`${styles.reset} ${styles.markerInfo}`}
													type="text"
													value={editedMarkerInfo}
													placeholder="notatka"
													onChange={(e) => setEditedMarkerInfo(e.target.value)}
												/>
												<div className={styles.centerBtnEdit}>
													<button
														className={`${styles.btn} ${styles.btnEdit}`}
														onClick={() => saveChanges(marker.id)}
													>
														Zapisz
													</button>
												</div>
											</div>
										) : (
											<>
												<h3>{marker.title}</h3>
												<span className={styles.longitudeAndLatitude}>
													{marker.geocode[0]}, {marker.geocode[1]}
												</span>
												<p className={styles.markerInfo}>{marker.info}</p>
											</>
										)}
									</div>
								))
							}
						</div>
						
					</div>
				</div>
				<div className={styles.allToDoListsContainer}>
					<TravelLists />
				</div>
			</div>
		</div>
	);
};

export default TravelPage;
