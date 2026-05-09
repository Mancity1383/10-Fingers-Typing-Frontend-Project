import { motion, AnimatePresence } from "framer-motion";
import styles from "./SuccessPage.module.css";
import SuccessImage from "../../assets/Success.png"; 

export default function SuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
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
                            <div className={styles.imageWrapper}>
                                <motion.img 
                                    src={SuccessImage} 
                                    alt="Success" 
                                    className={styles.successImage} 
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                />
                            </div>
                            
                            <h2 className={styles.successTitle}>Success!</h2>
                            
                            <p className={styles.successText}>
                                Your practice has been created successfully!
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
}