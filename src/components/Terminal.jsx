// Dependencies
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

// Stylesheets
import '../assets/css/components_style/Terminal.css';


function Terminal(props) {
    const [terminalText, setTerminalText] = useLocalStorage('terminalText', []);

    return (
        <div className="terminal">
            {terminalText.map((html, index) => (
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