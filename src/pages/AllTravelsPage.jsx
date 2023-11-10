import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { AiOutlineUser, AiTwotoneAudio } from "react-icons/ai";
import AuthUser from "../components/auth/AuthUser";
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import styles from "./Pages.module.css";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import AddNote from "../components/AddNote";
import { AiOutlineClose, AiOutlineMore } from "react-icons/ai";
import MoreWindow from "../components/MoreWindow";
import { useNavigate } from "react-router-dom";

const AllTravelsPage = ({ inputs }) => {
	const navigate = useNavigate();
	const [notes, setNotes] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		date: "",
	});

	const [inputErrors, setInputErrors] = useState({});
	const { currentUser } = useContext(AuthContext);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const [openMoreId, setOpenMoreId] = useState(null);

	const allTravelsButtons = [
		{ label: "Podróże", path: "/twoje-podroze" },
		{ label: "Dziennik", path: "/dziennik" },
		{ UserComponent: <AuthUser />, path: "#" },
	];

	const closePopup = () => {
		setIsPopupOpen(false);
		setFormData({
			title: "",
			date: "",
		});
		setInputErrors({});
	};

	useEffect(() => {
		const unsub = onSnapshot(
			query(
				collection(db, "allJournals"),
				where("userUid", "==", currentUser.uid)
			),
			(snapShot) => {
				let list = [];
				snapShot.docs.forEach((doc) => {
					list.push({ id: doc.id, ...doc.data() });
				});
				setNotes(list);
			},
			(error) => {
				console.log(error);
			}
		);

		return () => {
			unsub();
		};
	}, []);

	const handleAdd = async (e) => {
		e.preventDefault();

		// Weryfikuj, czy wszystkie pola są wypełnione
		let hasEmptyFields = false;
		let errors = {};
		inputs.forEach((input) => {
			if (!formData[input.id]) {
				hasEmptyFields = true;
				errors[input.id] = "Pole jest wymagane";
			}
		});

		if (hasEmptyFields) {
			setInputErrors(errors);
			return; // Nie dodawaj do bazy, jeśli są błędy
		} else {
			setInputErrors({}); // Wyczyść błędy
		}

		try {
			await addDoc(collection(db, "allJournals"), {
				...formData,
				userUid: currentUser.uid,
			});
			// fetchData();
			closePopup();
		} catch (err) {
			console.log(err);
		}
	};

	const handleDivClick = (note) => {
		const path = `/twoje-podroze/${note.id}`;
		navigate(path);
	};

	const handleInput = (e) => {
		const id = e.target.id;
		const value = e.target.value;
		setFormData((prevState) => ({ ...prevState, [id]: value }));
	};

	return (
		<div>
			<Navbar buttons={allTravelsButtons}></Navbar>

			<div className={styles.addNew}>
				<label> Rozpocznij nową podróż</label>
				<button className={styles.plusBtn} onClick={() => setIsPopupOpen(true)}>
					<AiOutlinePlus></AiOutlinePlus>
				</button>
			</div>

			<AddNote isOpen={isPopupOpen} closePopup={closePopup}>
				<div>
					<form onSubmit={handleAdd}>
						{inputs.map((input) => (
							<div key={input.id}>
								<input
									id={input.id}
									type={input.type}
									placeholder={input.placeholder}
									className={`${
										inputErrors[input.id] ? styles.errorInput : ""
									} ${
										input.id === "title" ? styles.inputTitle : styles.inputNotes
									}`}
									onChange={handleInput}
									value={formData[input.id] || ""}
								/>
								{inputErrors[input.id] && (
									<span className={styles.errorMessage}>
										{inputErrors[input.id]}
									</span>
								)}
							</div>
						))}
						<div className={styles.info}>
							<label className={styles.infoLabel}>
								{" "}
								Po ustaleniu nazwy podróży i daty, naciśnij w panel by dodać
								szczegóły podróży{" "}
							</label>
						</div>
						<div className={styles.addBtnContainer}>
							<button className={styles.btn} type="submit">
								Dodaj
							</button>
						</div>
					</form>
				</div>
			</AddNote>

			<div
				className={`${styles.scroller} ${
					isPopupOpen ? styles.scrollerShrinked : ""
				}`}
			>
				{Array.isArray(notes) &&
					notes.map((note) => (
						<div key={note.id} className={`${styles.notes} ${styles.travels}`}>
							<button
								className={
									openMoreId === note.id ? styles.moreBtnBlock : styles.moreBtn
								}
								onClick={() =>
									openMoreId === note.id
										? setOpenMoreId(null)
										: setOpenMoreId(note.id)
								}
							>
								<AiOutlineMore />
							</button>
							{openMoreId === note.id && (
								<MoreWindow
									isOpen={openMoreId}
									id={note.id}
									notes={notes}
									setNotes={setNotes}
									note={note}
								/>
							)}
							<div 
							className= {styles.divClick}
							onClick={() => handleDivClick(note)}>
								<h2 className={`${styles.noteTitle} ${styles.noteContent}`}>
									{note.title}
								</h2>
								<span>{note.date}</span>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default AllTravelsPage;
