import React from "react";
import { motion } from "framer-motion";
import styles from "./Key.module.css";

interface KeyProps extends React.HTMLAttributes<HTMLDivElement> {
    topLabel?: string;
    label?: string;
    icon?: React.ReactNode;
    width?: number;
    isActive?: boolean;
    isWrong?: boolean;
    matchKey?: string;
}

const KeyComponent: React.FC<KeyProps> = ({
    topLabel,
    label,
    icon,
    width = 60,
    isActive = false,
    isWrong = false,
    matchKey,
    ...props
}) => {
    const isIconWithLabel = icon && label;
    const specialClass = label && label.length > 1 ? styles.specialLabel : "";

    const keyText = (matchKey || label || "").toString();

    let colorClass = styles.keyDark;
    if (/^[A-Z]$/.test(keyText)) {
        colorClass = styles.keyLight;
    } else if (keyText === "Space") {
        colorClass = styles.keyYellow;
    } else if (keyText === "Shift-L" || keyText === "Shift-R") {
        colorClass = styles.keyDark;
    } else if (keyText === "Caps" || keyText === "Tab" || keyText.startsWith("Ctrl") || keyText.startsWith("Alt") || keyText === "Win" || keyText === "Context") {
        colorClass = styles.keyMid;
    } else if (keyText === "`" || /^[0-9]$/.test(keyText)) {
        colorClass = styles.keyMidDark;
    }

    return (
        <motion.div
            className={`${styles.key} ${colorClass} 
    ${isActive ? styles.active : ""} 
    ${isWrong ? styles.wrongKey : ""}
   ${["F", "J"].includes(keyText) ? styles.keyUnderLine : ""}
`}

            style={{ width }}
            layout
            initial={false}
            animate={{
                scale: isActive ? 0.985 : 1,
                y: isActive ? 2 : 0,
                transition: { type: "spring", stiffness: 420, damping: 26 }
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ y: 2, scale: 0.985 }}
            {...props}
        >
            <div className={isIconWithLabel ? styles.keyContentRow : styles.keyContent}>
                {topLabel && <div className={styles.topLabel}>{topLabel}</div>}
                {icon && <div className={styles.icon}>{icon}</div>}
                {label && <div className={`${styles.label} ${specialClass}`}>{label}</div>}
            </div>
        </motion.div>
    );
};

export const Key = React.memo(
    KeyComponent,
    (prev, next) =>
        prev.isActive === next.isActive &&
        prev.isWrong === next.isWrong
);

