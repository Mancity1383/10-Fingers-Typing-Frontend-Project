import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FailModal.module.css";
import FailImage from "../../assets/Fail.png";

export default function FailModal({ open, onClose, error, field }: { open: boolean; onClose: () => void; error: string; field: string }) {
    const modalJSX = (
        <AnimatePresence>
            {open && (
                <motion.div
                    className={styles.overlay}
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className={styles.body}>
                            <motion.img
                                src={FailImage}
                                className={styles.failImage}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                            />
                            <h2 className={styles.failTitle}>Oops...</h2>
                            <p className={styles.failText}>
                                Something went wrong. <br />
                                <strong>{field}</strong>: {error}
                            </p>
                        </div>

                        <div className={styles.footer}>
                            <button onClick={onClose} className={styles.button}>
                                OK
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
    return createPortal(modalJSX, document.body);
}