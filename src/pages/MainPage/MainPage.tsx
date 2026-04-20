import Keyboard from "../../components/Keyboard/Keyboard";
import TypingBox from "../../components/TypingBox/TypingBox";
import StatusNavBar from "../../components/NavBar/StatusNavBar";
import styles from "./MainPage.module.css";
import keyBoardIcon from "../../assets/keyboardIcon.png"
import ResultModal from "../../components/ResultModal/ResultModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { PanelLeft, PanelsTopLeft } from "lucide-react";
import Sidebar from "../../components/SideBar/SideBar";

export default function MainPage() {

  const [isResultOpen, setResultOpen] = useState(false);
  const {
    isRunning,
    currentIndex,
    totalChars
  } = useSelector((state: RootState) => state.keyboard);

  useEffect(() => {
    if (!isRunning && currentIndex >= totalChars && totalChars > 0) {
      setResultOpen(true);
    }
  }, [isRunning, currentIndex, totalChars]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <button
        className={styles.sidebarToggle}
        onClick={() => setSidebarOpen(true)}
      >
        <PanelsTopLeft size={26} strokeWidth={2.2} />
      </button>
      <ResultModal open={isResultOpen} onClose={() => setResultOpen(false)} />

      <div className={styles.projectHeader}>
        <img
          src={keyBoardIcon}
          alt="Project Icon"
          className={styles.projectIcon}
        />
        <h1 className={styles.projectTitle}>10 Fingers Type</h1>
      </div>

      <div className={styles.leftColumn}>
        <StatusNavBar />
        <TypingBox />
      </div>

      <Keyboard />
    </div>
  );
}
