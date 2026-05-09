import styles from "./SideBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { resetGame, setMainText, updateActivePresetId } from "../../features/keyboardSlice";
import emptyStarImage from "../../assets/star_2.png";
import filledStarImage from "../../assets/star.png";
import type { RootState } from "../../store/store";
import { motion } from "framer-motion";
import CreateNewPracticeModal from "../CreateNewPracticeModal/CreateNewPracticeModal";
import { useState } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
    const [CreateNewPracticeModalOpen, setCreateNewPracticeModalOpen] = useState(false);
    const dispatch = useDispatch();
    const handleSelectPreset = (id: number, text: string) => {
        dispatch(updateActivePresetId(id));
        dispatch(setMainText(text));
        dispatch(resetGame())
    };
    const { scores,presets } = useSelector((state: RootState) => state.userData);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const starVariants = {
        hidden: { opacity: 0, scale: 0, y: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 260, damping: 20 }
        },
    };

    return (
        <>
            <CreateNewPracticeModal open={CreateNewPracticeModalOpen} onClose={() => setCreateNewPracticeModalOpen(false)}
             onOpen={() => setCreateNewPracticeModalOpen(true)} />
            <div
                className={`${styles.overlay} ${open ? styles.show : ""}`}
                onClick={onClose}
            />
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
                                onClick={() => handleSelectPreset(preset.id, preset.text)}
                            >
                                <div className={styles.presetHeader}>
                                    <div className={styles.presetHeaderInfo}>
                                        <span className={styles.presetTitle}>{preset.title}</span>
                                        <motion.div
                                            className={styles.starRating}
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate={open ? "visible" : "hidden"}
                                        >
                                            {[...Array(5)].map((_, index) => {
                                                const score = scores?.[preset.id] ?? 0;
                                                const isFilled = index < score;

                                                return (
                                                    <motion.img
                                                        key={index}
                                                        variants={starVariants}
                                                        src={isFilled ? filledStarImage : emptyStarImage}
                                                        alt="star"
                                                        className={styles.starIcon}
                                                        whileHover={{ scale: 1.2 }}
                                                    />
                                                );
                                            })}
                                        </motion.div>
                                    </div>
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
                    <button
                        className={styles.addPresetButton}
                        onClick={() => setCreateNewPracticeModalOpen(true)}
                        aria-label="Add new preset"
                    >
                        <span className={styles.plusIcon}>+</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
