import styles from "./SideBar.module.css";
import { useDispatch } from "react-redux";
import { resetGame, setMainText } from "../../features/keyboardSlice";

type Props = {
    open: boolean;
    onClose: () => void;
};

const presets = [
    {
        id: "easy-hello-world",
        title: "Warmup – Hello World",
        text: "Hello world! This is a simple typing warmup to get your fingers moving.",
        difficulty: "Easy",
        length: "Short",
        tags: ["warmup", "beginner"],
    },
    {
        id: "medium-productivity",
        title: "Productivity Focus",
        text: "Staying focused while typing helps improve accuracy and speed over time.",
        difficulty: "Medium",
        length: "Medium",
        tags: ["focus", "accuracy"],
    },
    {
        id: "hard-programming",
        title: "Code Style Snippet",
        text: `function typingPractice() {
return "Train your fingers to write clean and consistent code.";
}`,
        difficulty: "Hard",
        length: "Medium",
        tags: ["code", "symbols"],
    },
];

export default function Sidebar({ open, onClose }: Props) {
    const dispatch = useDispatch();

    const handleSelectPreset = (text: string) => {
        dispatch(setMainText(text));
        dispatch(resetGame())
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${open ? styles.show : ""}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Sidebar</h2>
                        <p className={styles.subtitle}>Typing text items</p>
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>
                        ✕
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.sectionLabel}>Practice texts</p>

                    <div className={styles.presetList}>
                        {presets.map((preset) => (
                            <button
                                key={preset.id}
                                className={styles.presetItem}
                                onClick={() => handleSelectPreset(preset.text)}
                            >
                                <div className={styles.presetHeader}>
                                    <span className={styles.presetTitle}>{preset.title}</span>
                                    <span
                                        className={`${styles.difficulty} ${preset.difficulty === "Easy"
                                            ? styles.easy
                                            : preset.difficulty === "Medium"
                                                ? styles.medium
                                                : styles.hard
                                            }`}
                                    >
                                        {preset.difficulty}
                                    </span>
                                </div>

                                <p className={styles.presetPreview}>{preset.text}</p>

                                <div className={styles.presetMeta}>
                                    <span className={styles.metaBadge}>{preset.length}</span>
                                    {preset.tags.map((tag) => (
                                        <span key={tag} className={styles.metaTag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
