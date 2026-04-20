import React, { useEffect } from "react";
import styles from "./StatusNavBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import {
    setIsRunning,
    resetGame,
    incrementElapsedTime,
} from "../../features/keyboardSlice";

import { FaPause, FaPlay } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { Timer, Gauge, PercentCircle } from "lucide-react";
import { VscDebugRestart } from "react-icons/vsc";
import { AnimatePresence, motion } from "framer-motion";

const MAX_SPEED_FOR_GAUGE = 120;

const StatusNavBar: React.FC = () => {
    const dispatch = useDispatch();
    const { elapsedTime, isRunning, speed, accuracy, failCount } = useSelector(
        (state: RootState) => state.keyboard
    );

    useEffect(() => {
        if (!isRunning) return;

        const id = setInterval(() => {
            dispatch(incrementElapsedTime());
        }, 1000);

        return () => clearInterval(id);
    }, [isRunning, dispatch]);

    const clampedSpeed = Math.min(Math.max(speed, 0), MAX_SPEED_FOR_GAUGE);
    const angle = (clampedSpeed / MAX_SPEED_FOR_GAUGE) * 180 - 90;

    let accClass = styles.accGood;
    if (accuracy < 90) accClass = styles.accWarn;
    if (accuracy < 75) accClass = styles.accBad;
    if (accuracy < 50) accClass = styles.accVeryBad;

    let speedLevel: "0" | "slow" | "medium" | "fast" | "veryfast" | "extreme" = "0";
    if (speed > 0 && speed < 30) speedLevel = "slow";
    else if (speed >= 30 && speed < 50) speedLevel = "medium";
    else if (speed >= 50 && speed < 70) speedLevel = "fast";
    else if (speed >= 70 && speed < 100) speedLevel = "veryfast";
    else if (speed >= 100) speedLevel = "extreme";

    const handlePause = () => dispatch(setIsRunning(false));
    const handleResume = () => dispatch(setIsRunning(true));

    const handleRestart = () => {
        dispatch(resetGame());
    };

    return (
        <div className={styles.statusNav}>
            <div className={styles.statusNavInner}>

                <div className={styles.leftControls}>
                    <button
                        className={`${styles.keyButton} ${styles.keyButtonPrimary} ${!isRunning ? styles.keyButtonDisabled : ""
                            }`}
                        onClick={handlePause}
                        disabled={!isRunning}
                    >
                        <div className={styles.keyButtonContent}>
                            <FaPause size={14} />
                        </div>
                    </button>

                    <button
                        className={`${styles.keyButton} ${styles.keyButtonPrimary} ${isRunning ? styles.keyButtonDisabled : ""
                            }`}
                        onClick={handleResume}
                        disabled={isRunning}
                    >
                        <div className={styles.keyButtonContent}>
                            <FaPlay size={14} />
                        </div>
                    </button>
                </div>

                <div className={styles.centerStats}>
                    {/* Errors */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={`${styles.labelSmall}`}>Errors</span>
                            <MdErrorOutline className={`${styles.icon} ${styles.iconError}`} />
                        </div>
                        <div className={styles.cardBody}>
                            <span className={styles.valueMain}>{failCount}</span>
                            <span className={styles.valueSub}>mistyped keys</span>
                        </div>
                    </div>

                    {/* Time */}
                    {/* Time */}
                    <div className={`${styles.card}`} data-type="timer">
                        <div className={styles.cardHeader}>
                            <span className={styles.labelSmall}>Time</span>
                            <Timer className={styles.icon} />
                        </div>

                        <div className={styles.cardBody} data-type="timer">
                            <div className={styles.timeSplit}>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={`m-${Math.floor(elapsedTime / 60)}`}
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -5, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className={styles.valueMain}
                                        data-type="timer"
                                    >
                                        {String(Math.floor(elapsedTime / 60)).padStart(2, "0")}
                                    </motion.span>
                                </AnimatePresence>
                                <span className={styles.valueSub} data-type="timer">min</span>
                            </div>
                            <span className={styles.colon}>:</span>
                            <div className={styles.timeSplit}>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={`s-${elapsedTime % 60}`}
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -5, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className={styles.valueMain}
                                        data-type="timer"
                                    >
                                        {String(elapsedTime % 60).padStart(2, "0")}
                                    </motion.span>
                                </AnimatePresence>
                                <span className={styles.valueSub} data-type="timer">sec</span>
                            </div>

                        </div>
                        <span className={styles.valueSub}>elapsed</span>
                    </div>


                    {/* Accuracy */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.labelSmall}>Accuracy</span>
                            <PercentCircle className={`${styles.icon}`} />
                        </div>
                        <div className={styles.accuracyWrapper}>
                            <div
                                className={`${styles.accuracyCircle} ${accClass}`}
                                style={{ 'scale': accuracy / 100 }}
                            >
                                <span className={styles.accuracyText}>{accuracy}%</span>
                            </div>
                            <div>
                                <span className={styles.valueSub}>precision</span>
                            </div>
                        </div>
                    </div>

                    {/* Speed */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.labelSmall}>Speed</span>
                            <Gauge className={styles.icon} />
                        </div>
                        <div className={styles.speedRow}>
                            <div className={styles.gaugeOuter}>
                                <div
                                    className={`${styles.gaugeArc} ${styles[`speedLevel_${speedLevel}`] || ""
                                        }`}
                                >
                                    <div
                                        className={styles.gaugeNeedle}
                                        style={{ transform: `rotate(${angle}deg)` }}
                                    />
                                    <div className={styles.gaugeCenterDot} />
                                </div>
                            </div>
                            <div className={styles.speedMeta}>
                                <span className={styles.valueMain}>{speed}</span>
                                <span className={styles.valueSub}>WPM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* right controls */}

                <div className={styles.rightControls}>
                    <button
                        className={`${styles.keyButton} ${styles.keyButtonPrimary}`}
                        onClick={handleRestart}
                    >
                        <div className={styles.keyButtonContent}>
                            <VscDebugRestart size={14} />
                            Restart
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusNavBar;
