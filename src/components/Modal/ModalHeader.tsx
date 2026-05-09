import type { ReactNode } from "react";

type Props = {
    title: string;
    onClose: () => void;
    className?: string;
    titleClassName?: string;
    closeClassName?: string;
    children?: ReactNode
};

export default function ModalHeader({
    title,
    onClose,
    className,
    titleClassName,
    closeClassName,
    children
}: Props) {
    return (
        <header className={className}>
            {children}
            <h2 className={titleClassName}>{title}</h2>

            <button
                className={closeClassName}
                onClick={onClose}
                aria-label="Close"
            >
                ✕
            </button>
        </header>
    );
}
