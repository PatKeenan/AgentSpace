import { AnimatePresence, motion } from "framer-motion";

export const Spacer = (props: { isVisible: boolean; delay?: boolean }) => {
    const { isVisible, delay } = props;
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1, originY: 0 }}
                    transition={{
                        duration: 0.175,
                        delay: delay ? 0.1 : 0,
                        type: "tween",
                    }}
                    className="mb-4 mt-1 h-[2.5rem] rounded-md bg-gray-300 shadow-md"
                />
            )}
        </AnimatePresence>
    );
};
