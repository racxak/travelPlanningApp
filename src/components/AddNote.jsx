import { AiOutlineClose } from "react-icons/ai";
import style from "../pages/Pages.module.css";
import styleLists from "./travelLists/TravelLists.module.css" 


function AddNote({ isOpen, children, closePopup, isList }) {

	if (!isOpen) return null;

	if (isList === undefined) {
    isList = false; 
  }

	return (
		<div
		className={isList ? styleLists.card : 
		`${style.notes} ${style.addNoteMargin}`}
		>
				<button className={style.closeBtn} onClick={closePopup}>
					<AiOutlineClose></AiOutlineClose>
				</button>
				{children}
		</div>
	);
};

export default AddNote;
