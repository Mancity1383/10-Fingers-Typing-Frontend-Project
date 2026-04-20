import { type ReactNode, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import style from "./Modal.module.css";

type ModalProps = {
    isOpen: boolean;
    className?: string;
    onClose: () => void;
    children: ReactNode;
};

type ModalComponent = React.FC<ModalProps> & {
    Header: React.FC<{ className?: string, children: ReactNode }>;
    Body: React.FC<{ children: ReactNode, className?: string }>;
    Footer: React.FC<{ children: ReactNode, className?: string }>;
};

export const Modal: ModalComponent = ({ isOpen, className, onClose, children}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleCancel = (e: Event) => {
            e.preventDefault();
            onClose();
        };

        dialog.addEventListener("cancel", handleCancel);

        if (isOpen) {
            if (!dialog.open) dialog.showModal();
        }
        return () => {
            dialog.removeEventListener("cancel", handleCancel);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className={style.modalBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />


                    <motion.dialog
                        ref={dialogRef}
                        className={`${style.modalContainer} ${className ?? ""}`}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {children}
                    </motion.dialog>
                </>
            )}
        </AnimatePresence>
    );
};

Modal.Header = function Header({ className, children }) {
    return <div className={className ? className : style.modalHeader}>
        {children}</div>;
};

Modal.Body = function Body({ children, className }) {
    return <div className={className ? className : style.modalBody}>{children}</div>;
};

Modal.Footer = function Footer({ children, className }) {
    return <div className={className ? className : style.modalFooter}>{children}</div>;
};
