import { useSelector } from "react-redux";
import { Modal } from "../Modal/Modal";
import styles from "./ResultModal.module.css";
import type { RootState } from "../../store/store";
import { FaMedal } from "react-icons/fa";

type Props = {
    open: boolean;
    onClose: () => void;
};

function formatTime(seconds: number): string {
    const s = Math.floor(seconds);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
}

type MedalType = "gold" | "silver" | "bronze" | "none";

function getMedal(accuracy: number, wpm: number): MedalType {
    if (accuracy >= 95 && wpm >= 60) return "gold";
    if (accuracy >= 90 && wpm >= 40) return "silver";
    if (accuracy >= 80 && wpm >= 20) return "bronze";
    return "none";
}

export default function ResultModal({ open, onClose }: Props) {

    const {
        elapsedTime,
        accuracy,
        speed,
        failCount,
        totalChars,
        typedChars,
        correctCount,
        wrongCount,
    } = useSelector((state: RootState) => state.keyboard);

    const medal = getMedal(accuracy ?? 0, speed ?? 0)

    const timeLabel = formatTime(elapsedTime ?? 0);
    const accLabel = `${Math.round(accuracy ?? 0)}%`;
    const speedLabel = `${Math.round(speed ?? 0)} WPM`;

    return (
        <Modal isOpen={open} onClose={onClose}>
            <div className={styles.resultModal}>
                <Modal.Header className={styles.header}>
                    <div className={styles.title}>Session summary</div>
                    <div className={styles.subtitle}>
                        Here’s how you did in this typing round.
                    </div>
                </Modal.Header>

                <Modal.Body className={styles.body}>
                    <div className={styles.bodyParts}>
                        {medal !== "none" && (
                            <div className={styles.medalSection}>
                                <div
                                    className={`${styles.medalCircle} ${medal === "gold"
                                        ? styles.gold
                                        : medal === "silver"
                                            ? styles.silver
                                            : styles.bronze
                                        }`}
                                >
                                    <FaMedal className={`${styles.medalIcon} ${medal === "gold"
                                        ? styles.MedalGold
                                        : medal === "silver"
                                            ? styles.MedalSilver
                                            : styles.MedalBronze
                                        }`} />
                                </div>

                                <div className={styles.medalInfo}>
                                    <span className={styles.medalLabel}>
                                        {medal.charAt(0).toUpperCase() + medal.slice(1)} Medal
                                    </span>
                                    <span className={styles.medalSubtitle}>
                                        Great job! Keep practicing to reach the next level.
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className={styles.metricsRow}>
                            <div className={styles.metricCard}>
                                <div className={styles.metricLabel}>Errors</div>
                                <div className={styles.metricValue}>
                                    {failCount}
                                </div>
                            </div>
                            <div className={styles.metricCard}>
                                <div className={styles.metricLabel}>Time</div>
                                <div className={styles.metricValue}>
                                    {timeLabel}
                                </div>
                            </div>
                            <div className={styles.metricCard}>
                                <div className={styles.metricLabel}>Accuracy</div>
                                <div className={styles.accuracyValue}>
                                    {accLabel}
                                </div>
                            </div>
                            <div className={styles.metricCard}>
                                <div className={styles.metricLabel}>Speed</div>
                                <div className={styles.speedValue}>
                                    <span className={styles.speedDot} />
                                    <span className={styles.speedText}>{speedLabel}</span>
                                </div>
                            </div>

                        </div>
                        <p className={styles.summary}>You typed {typedChars}/{totalChars} chars
                            with<span className={styles.correctText}> {correctCount} correct</span> and <span className={styles.wrongText}>{wrongCount} wrong</span></p>
                    </div>


                </Modal.Body>

                <Modal.Footer className={styles.footer}>
                    <button
                        className={`${styles.button} ${styles.buttonPrimary}`}
                        onClick={onClose}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}
