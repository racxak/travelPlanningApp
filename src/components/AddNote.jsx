import { AiOutlineClose } from "react-icons/ai";
import style from "../pages/Pages.module.css";

function AddNote({ isOpen, children, closePopup }) {

	if (!isOpen) return null;

	return (
		<div className={`${style.notes} ${style.addNoteMargin}`}>
			<div>
				<button className={style.closeBtn} onClick={closePopup}>
					<AiOutlineClose></AiOutlineClose>
				</button>
				{children}
			</div>
		</div>
	);
};

export default AddNote;
