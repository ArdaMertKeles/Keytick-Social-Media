import { useState } from "react"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const Faq = ({faq}) => {

    const [anchor, setAnchor] = useState(false)

    return(
        <div className="faqContainer">
            <div className="questionContainer">
                <div className="question">{faq.faq}</div>
                <KeyboardArrowDownIcon onClick={() => setAnchor(!anchor)} className={anchor ? 'anchor up' : 'anchor down'} />
            </div>
            {anchor && <div className="answer">{faq.answer}</div>}
        </div>
    )
}