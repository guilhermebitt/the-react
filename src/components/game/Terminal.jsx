// Dependencies
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

// Stylesheets
import '../../assets/css/components_style/Terminal.css';


function Terminal() {
    const [terminalText, setTerminalText] = useLocalStorage('terminalText', []);

    useEffect(() => {
        // Verifying if the terminal text change, when the
        // length hit the max (30), the last messages will
        // be removed. But the text will be kept into log
        if (terminalText.length > 20) {
            const newTerminalText = [...terminalText];

            newTerminalText.splice(20, 1);

            setTerminalText(newTerminalText);
        }
    }, [terminalText]);

    return (
        <div className="terminal">
            {(Array.isArray(terminalText) ? terminalText : []).map((html, index) => (
                <div
                    key={index}
                    className="terminal-line"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            ))}
        </div>
    )
};

export default Terminal;