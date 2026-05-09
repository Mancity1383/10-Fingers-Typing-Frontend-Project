import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import style from "./SelectOptions.module.css";

interface Option {
    value: string;
    label: string;
    className?: string;
}

interface SelectOptionsProps {
    value: string;
    onChange?: (val: string) => void;
    className?: string;
    options: Option[];
}

export default function SelectOptions({ value, onChange, className, options }: SelectOptionsProps) {
    const selected = options.find((opt) => opt.value === value);

    return (
        <Listbox value={value} onChange={onChange}>
            <div className={style.container}>
                <ListboxButton className={`${style.button} ${className}`}>
                    {({ open }) => (
                        <>
                            <span>{selected?.label}</span>

                            <motion.span
                                animate={{ rotate: open ? 180 : 0 }}
                                transition={{ duration: 0.25 }}
                                className={style.arrow}
                            >
                                <ChevronDown size={14} />
                            </motion.span>
                        </>
                    )}
                </ListboxButton>




                {/* Dropdown Options */}
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="opacity-0 -translate-y-2 scale-95"
                    enterTo="opacity-100 translate-y-0 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100 translate-y-0 scale-100"
                    leaveTo="opacity-0 -translate-y-2 scale-95"
                >
                    <ListboxOptions className={style.options}>
                        {options.map((opt) => (
                            <ListboxOption
                                key={opt.value}
                                value={opt.value}
                                className={`${style.option} ${style[opt.value]}`}
                            >
                                {opt.label}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>

                </Transition>
            </div>
        </Listbox>
    );
}
