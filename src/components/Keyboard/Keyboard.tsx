import { ArrowBigUpDash, MenuSquareIcon } from "lucide-react";
import { Key } from "./Key";
import styles from "./Keyboard.module.css";
import {
    MdOutlineBackspace,
    MdKeyboardTab,
    MdKeyboardReturn,
} from "react-icons/md";
import { FaWindows } from "react-icons/fa";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import {
    addActiveKey,
    removeActiveKey,
    setIsRunning,
} from "../../features/keyboardSlice";

type KeyDef = {
    bottom?: string;
    top?: string;
    match?: string;
    icon?: React.ReactNode;
    width: number;
};

const rows: KeyDef[][] = [
    [
        { bottom: "`", top: "~", width: 60 },
        { bottom: "1", top: "!", width: 60 },
        { bottom: "2", top: "@", width: 60 },
        { bottom: "3", top: "#", width: 60 },
        { bottom: "4", top: "$", width: 60 },
        { bottom: "5", top: "%", width: 60 },
        { bottom: "6", top: "^", width: 60 },
        { bottom: "7", top: "&", width: 60 },
        { bottom: "8", top: "*", width: 60 },
        { bottom: "9", top: "(", width: 60 },
        { bottom: "0", top: ")", width: 60 },
        { bottom: "-", top: "_", width: 60 },
        { bottom: "=", top: "+", width: 60 },
        { icon: <MdOutlineBackspace size={24} />, match: "Backspace", width: 125 },
    ],
    [
        { icon: <MdKeyboardTab size={26} />, match: "Tab", width: 90 },
        { bottom: "Q", width: 60 },
        { bottom: "W", width: 60 },
        { bottom: "E", width: 60 },
        { bottom: "R", width: 60 },
        { bottom: "T", width: 60 },
        { bottom: "Y", width: 60 },
        { bottom: "U", width: 60 },
        { bottom: "I", width: 60 },
        { bottom: "O", width: 60 },
        { bottom: "P", width: 60 },
        { bottom: "[", top: "{", width: 60 },
        { bottom: "]", top: "}", width: 60 },
        { bottom: "\\", top: "|", width: 95 },
    ],
    [
        { bottom: "Caps", match: "Caps", width: 120 },
        { bottom: "A", width: 60 },
        { bottom: "S", width: 60 },
        { bottom: "D", width: 60 },
        { bottom: "F", width: 60 },
        { bottom: "G", width: 60 },
        { bottom: "H", width: 60 },
        { bottom: "J", width: 60 },
        { bottom: "K", width: 60 },
        { bottom: "L", width: 60 },
        { bottom: ";", top: ":", width: 60 },
        { bottom: "'", top: '"', width: 60 },
        { icon: <MdKeyboardReturn size={26} />, bottom: "Enter", match: "Enter", width: 135 },
    ],
    [
        { icon: <ArrowBigUpDash size={20} />, bottom: "Shift-L", width: 160 },
        { bottom: "Z", width: 60 },
        { bottom: "X", width: 60 },
        { bottom: "C", width: 60 },
        { bottom: "V", width: 60 },
        { bottom: "B", width: 60 },
        { bottom: "N", width: 60 },
        { bottom: "M", width: 60 },
        { bottom: ",", top: "<", width: 60 },
        { bottom: ".", top: ">", width: 60 },
        { bottom: "/", top: "?", width: 60 },
        { icon: <ArrowBigUpDash size={20} />, bottom: "Shift-R", width: 165 },
    ],
    [
        { bottom: "Ctrl-L", width: 110 },
        { icon: <FaWindows size={20} />, match: "Win", width: 80 },
        { bottom: "Alt-L", width: 90 },
        { match: "Space", width: 400 },
        { bottom: "Alt-R", width: 90 },
        { icon: <MenuSquareIcon size={20} />, match: "Context", width: 85 },
        { bottom: "Ctrl-R", width: 110 },
    ],
];

export default function Keyboard() {
    const dispatch = useDispatch();
    const wrongKeys = useSelector((state: RootState) => state.keyboard.wrongKeys);

    const { activeKeys } = useSelector(
        (state: RootState) => state.keyboard
    );

    const codeMap: Record<string, string> = {
        ShiftLeft: "Shift-L",
        ShiftRight: "Shift-R",
        ControlLeft: "Ctrl-L",
        ControlRight: "Ctrl-R",
        AltLeft: "Alt-L",
        AltRight: "Alt-R",
        MetaLeft: "Win",
        MetaRight: "Win",
        ContextMenu: "Context",
        CapsLock: "Caps",
        Space: "Space",
        Tab: "Tab",
        Enter: "Enter",
        Backspace: "Backspace",
    };

    const normalizeKey = (e: KeyboardEvent) => {
        if (e.code.startsWith("Key")) return e.code.replace("Key", "");
        if (e.code.startsWith("Digit")) return e.code.replace("Digit", "");

        const specialKeys: Record<string, string> = {
            Backquote: "`",
            Minus: "-",
            Equal: "=",
            BracketLeft: "[",
            BracketRight: "]",
            Backslash: "\\",
            Semicolon: ";",
            Quote: "'",
            Comma: ",",
            Period: ".",
            Slash: "/",
        };

        if (specialKeys[e.code]) return specialKeys[e.code];
        if (codeMap[e.code]) return codeMap[e.code];
        return e.code;
    };

    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            const physical = normalizeKey(e);
            dispatch(addActiveKey(physical));
        };

        const handleUp = (e: KeyboardEvent) => {
            const physical = normalizeKey(e);
            dispatch(removeActiveKey(physical));
        };

        window.addEventListener("keydown", handleDown);
        window.addEventListener("keyup", handleUp);

        return () => {
            window.removeEventListener("keydown", handleDown);
            window.removeEventListener("keyup", handleUp);
        };
    }, [dispatch]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const startTimer = () => {
            clearTimeout(timeoutId);
            console.log("Getting in");
            timeoutId = setTimeout(() => {
                dispatch(setIsRunning(false));
            }, 10000);
        };

        startTimer();

        const handleKeyDown = () => {
            clearTimeout(timeoutId);
            startTimer();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearTimeout(timeoutId);
        };
    }, [dispatch]);

    const activeSet = useMemo(
        () => new Set(activeKeys),
        [activeKeys]
    );

    const wrongSet = useMemo(
        () => new Set(wrongKeys),
        [wrongKeys]
    );

    return (
        <div className={styles.keyboard}>
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.row}>
                    {row.map((keyDef, keyIndex) => {
                        const label = keyDef.bottom ?? keyDef.top ?? "";
                        const matchKey = keyDef.match ?? label;

                        return (
                            <Key
                                key={`${rowIndex}-${keyIndex}`}
                                topLabel={keyDef.top}
                                label={label}
                                icon={keyDef.icon}
                                width={keyDef.width}
                                isActive={activeSet.has(matchKey)}
                                isWrong={wrongSet.has(matchKey)}
                                matchKey={matchKey}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
