import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { addPreset } from "../../features/userDataSlice";
import SelectOptions from "../SelectOptions/SelectOptions";
import styles from "./CreateNewPracticeModal.module.css";
import { Modal } from "../Modal/Modal";
import ModalHeader from "../Modal/ModalHeader";
import SuccessModal from "./SuccessModal.tsx";
import { useEffect, useState } from "react";
import FailModal from "./FailModal.tsx";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    text: z.string().min(20, "at least 20 characters are required"),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    length: z.enum(["Short", "Medium", "Long"]),
    tags: z.string()
});

type FormData = z.infer<typeof schema>;

export default function CreateNewPracticeModal({ open, onClose, onOpen }: { open: boolean; onClose: () => void; onOpen: () => void }) {
    const dispatch = useDispatch();
    const [successPageOpen, setSuccessPageOpen] = useState(false);
    const [failPageOpen, setFailPageOpen] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            text: "",
            difficulty: "Easy",
            length: "Short",
            tags: "",
        }
    });

    const difficulty = watch("difficulty");
    const length = watch("length");

    const onSubmit = (data: FormData) => {
        const tagArray = data.tags
            .split(",")
            .map(t => t.trim())
            .filter(t => t !== "");

        dispatch(addPreset({
            ...data,
            tags: tagArray
        }));
        reset();
        onClose();
        setSuccessPageOpen(true);
    };

    const getDifficultyClass = (val: string) => {
        if (val === "Easy") return styles.difficultyEasy;
        if (val === "Medium") return styles.difficultyMedium;
        if (val === "Hard") return styles.difficultyHard;
        return "";
    };

    const getLengthClass = (val: string) => {
        if (val === "Short") return styles.lengthShort;
        if (val === "Medium") return styles.lengthMedium;
        if (val === "Long") return styles.lengthLong;
        return "";
    }

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setFailPageOpen(true);
            onClose();
        }
    }, [errors]);

    return (
        <>
        <SuccessModal open={successPageOpen} onClose={() => setSuccessPageOpen(false)} />
        <FailModal  open={failPageOpen} onClose={() => {setFailPageOpen(false); onOpen() }} error={Object.values(errors)[0]?.message} field={Object.keys(errors)[0]} />
        <Modal isOpen={open} onClose={onClose}>
            <div className={styles.modalOverlay} >
                <Modal.Header className={styles.header}>
                    <Modal.Header className={styles.header}>
                        <ModalHeader
                            title="Create New Practice"
                            onClose={() => {onClose(); reset()}}
                            titleClassName={styles.title}
                            closeClassName={styles.close}
                        />
                    </Modal.Header>
                </Modal.Header>
                <Modal.Body className={styles.body}>
                    <form id="practice-form" onSubmit={handleSubmit(onSubmit)} className={styles.projectForm}>

                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input type="text" placeholder="Title" {...register("title")} className={styles.input} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Text</label>
                            <textarea placeholder="Text" {...register("text")} className={styles.textarea} />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Difficulty</label>
                            <div className={styles.selectWrapper}>
                                <SelectOptions
                                    value={difficulty}
                                    onChange={(val) => setValue("difficulty", val as any)}
                                    className={`${styles.select} ${getDifficultyClass(difficulty)}`}
                                    options={[
                                        { value: "Easy", label: "Easy" },
                                        { value: "Medium", label: "Medium" },
                                        { value: "Hard", label: "Hard" }
                                    ]}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Length</label>
                            <div className={styles.selectWrapper}>
                                <SelectOptions
                                    value={length}
                                    onChange={(val) => setValue("length", val as any)}
                                    className={`${styles.select} ${getLengthClass(length)}`}
                                    options={[
                                        { value: "Short", label: "Short" },
                                        { value: "Medium", label: "Medium" },
                                        { value: "Long", label: "Long" }
                                    ]}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tags</label>
                            <input
                                type="text"
                                placeholder="Tags (comma separated)"
                                {...register("tags")}
                                className={styles.input}
                            />
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer className={styles.footer}>
                    <button form="practice-form" type="submit" className={styles.button}>
                        Create
                    </button>
                </Modal.Footer>
            </div>
        </Modal>
        </>
    );
}