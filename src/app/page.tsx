"use client";

import { useEffect, useRef, useState } from "react";


import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Menu, X, Home as HomeIcon, Settings, Bell, User, Type, Text, Clock, History, Moon, Sun, AlignLeft, AlignRight, Maximize2, Minimize2, Delete, ALargeSmall, Timer } from "lucide-react"
import * as Popover from '@radix-ui/react-popover';

 function MobileMenu({ 
  darkMode, 
  setFontFamily, 
  setFontSize, 
  fontSizeIndex, 
  setFontSizeIndex,
  startTimer,
  stopTimer,
  timerRunning,
  setShowSidebar,
  showSidebar,
  shareWithChatGPT,
  shareWithClaude,
  toggleDarkMode,
  toggleRtlMode,
  rtlMode,
  toggleFullScreen,
  isFullscreen,
  setBackspaceDisabled,
  backspaceDisabled,
  fontFamily
}: { 
  darkMode: boolean;
  setFontFamily: (font: string) => void;
  setFontSize: (size: number) => void;
  fontSizeIndex: number;
  setFontSizeIndex: (index: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  timerRunning: boolean;
  setShowSidebar: (show: boolean) => void;
  showSidebar: boolean;
  shareWithChatGPT: () => void;
  shareWithClaude: () => void;
  toggleDarkMode: () => void;
  toggleRtlMode: () => void;
  rtlMode: boolean;
  toggleFullScreen: () => void;
  isFullscreen: boolean;
  setBackspaceDisabled: (disabled: boolean) => void;
  backspaceDisabled: boolean;
  fontFamily: string;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const y = useMotionValue(0)
  const dragY = useTransform(y, [-50, 50], [-50, 50])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const fontOptions = [
    { name: "Lato", value: "Lato" },
    { name: "Arial", value: "Arial" },
    { name: "System", value: "system-ui" },
    { name: "Serif", value: "Times New Roman" },
  ]

  const fontSizeOptions = [16, 18, 20, 22, 24, 26]

  const handleDrag = (event: any, info: any) => {
    const dragDistance = info.offset.y;
    const threshold = 20; // Distance needed to trigger a change
    
    if (Math.abs(dragDistance) > threshold) {
      const direction = dragDistance > 0 ? -1 : 1; // Up is negative, down is positive
      const newIndex = Math.max(0, Math.min(fontSizeOptions.length - 1, fontSizeIndex + direction));
      
      if (newIndex !== fontSizeIndex) {
        setFontSizeIndex(newIndex);
        setFontSize(fontSizeOptions[newIndex]);
        y.set(0); // Reset position immediately
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    y.set(0); // Reset position on drag end
  };

  const cycleFontSize = () => {
    const nextIndex = (fontSizeIndex + 1) % fontSizeOptions.length;
    setFontSizeIndex(nextIndex);
    setFontSize(fontSizeOptions[nextIndex]);
  };

  const menuItems = [
    { 
      icon: <Type className="h-5 w-5" />, 
      label: "Font",
      onClick: () => {
        const currentIndex = fontOptions.findIndex(f => f.value === fontFamily)
        const nextIndex = (currentIndex + 1) % fontOptions.length
        setFontFamily(fontOptions[nextIndex].value)
      }
    },
    { 
      icon: <ALargeSmall className="h-5 w-5" />, 
      label: "Text Size",
      component: (
        <motion.div
          drag="y"
          dragConstraints={{ top: -50, bottom: 50 }}
          onDrag={handleDrag}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          dragElastic={0}
          dragMomentum={false}
          style={{ y: dragY }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-md cursor-grab active:cursor-grabbing"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={cycleFontSize}
        >
          <ALargeSmall className="h-5 w-5" />
          <span className="sr-only">Text Size</span>
        </motion.div>
      )
    },
    { 
      icon: <Timer className="h-5 w-5" />, 
      label: "Timer",
      onClick: () => timerRunning ? stopTimer() : startTimer()
    },
    { 
      icon: <History className="h-5 w-5" />, 
      label: "History",
      onClick: () => setShowSidebar(!showSidebar)
    },
  ]

  const topMenuItems = [
    { 
      icon: <img src="/chatgpt_icon.png" alt="ChatGPT" className="h-5 w-5" />, 
      label: "ChatGPT",
      onClick: shareWithChatGPT
    },
    { 
      icon: <img src="/claude_icon.png" alt="Claude" className={`h-5 w-5 ${!darkMode ? "invert" : ""}`} />, 
      label: "Claude",
      onClick: shareWithClaude
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: "Settings",
      onClick: () => setShowSettings(true)
    },
  ]

  return (
    <div className="md:hidden fixed bottom-6 right-6 z-50">
      {/* Top Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 flex flex-col items-end space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {topMenuItems.map((item, index) => (
              <motion.button
                key={index}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.05 * (topMenuItems.length - 1 - index),
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  transition: {
                    delay: 0.05 * index,
                  },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={item.onClick}
              >
                {item.icon}
                <span className="sr-only">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-0 right-16 flex items-end space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {menuItems.map((item, index) => (
              item.component ? (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.05 * (menuItems.length - 1 - index),
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    transition: {
                      delay: 0.05 * index,
                    },
                  }}
                >
                  {item.component}
                </motion.div>
              ) : (
                <motion.button
                  key={index}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.05 * (menuItems.length - 1 - index),
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    transition: {
                      delay: 0.05 * index,
                    },
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </motion.button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`rounded-lg p-4 w-72 shadow-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                    Settings
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`p-1 rounded-full hover:bg-opacity-10 ${
                      darkMode ? "hover:bg-white" : "hover:bg-gray-900"
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Appearance
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Dark Mode
                      </span>
                      <button
                        onClick={toggleDarkMode}
                        className={`p-1.5 rounded-full ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        {darkMode ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        RTL Mode
                      </span>
                      <button
                        onClick={toggleRtlMode}
                        className={`p-1.5 rounded-full ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        {rtlMode ? (
                          <AlignLeft className="h-4 w-4" />
                        ) : (
                          <AlignRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Editor
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Fullscreen
                      </span>
                      <button
                        onClick={toggleFullScreen}
                        className={`p-1.5 rounded-full ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Backspace
                      </span>
                      <button
                        onClick={() => setBackspaceDisabled(!backspaceDisabled)}
                        className={`p-1.5 rounded-full ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <Delete className={`h-4 w-4 ${backspaceDisabled ? "opacity-50" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Button */}
      <motion.button
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground ${
          isOpen ? "shadow-lg" : "shadow-md opacity-80"
        }`}
        onClick={toggleMenu}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.button>
    </div>
  )
}


export default function Home() {
  const [text, setText] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(2); // Start at 18px (index 2)
  const [fontFamily, setFontFamily] = useState<string>("Lato");
  const [timeRemaining, setTimeRemaining] = useState<number>(900); // 15 minutes
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [editingTimer, setEditingTimer] = useState<boolean>(false);
  const [backspaceDisabled, setBackspaceDisabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullScreen] = useState<boolean>(false);
  const [timerInput, setTimerInput] = useState<string>("15:00");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [rtlMode, setRtlMode] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderText, setPlaceholderText] = useState<string>("");
  const resetTimerRef = useRef<boolean>(false);

  const [lastSetDuration, setLastSetDuration] = useState<number>(900); // Track the last user-set duration

  const placeholderOptions = [
    "Begin writing",
    "Pick a thought and go",
    "Start typing",
    "What's on your mind",
    "Just start",
    "Type your first thought",
    "Start with one sentence",
    "Just say it",
  ];

  // Font options
  const fontOptions = [
    { name: "Lato", value: "Lato" },
    { name: "Arial", value: "Arial" },
    { name: "System", value: "system-ui" },
    { name: "Serif", value: "Times New Roman" },
  ];

  // Font size options
  const fontSizeOptions = [16, 18, 20, 22, 24, 26];

  interface Entry {
    id: string;
    date: string;
    content: string;
    previewText: string;
    filename: string;
  }

  // Create a new entry
  const createNewEntry = () => {
    const id = crypto.randomUUID();
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    });
    const dateString = dateFormatter.format(now);

    const isoDate = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `[${id}]-[${isoDate}].md`;

    const newEntry: Entry = {
      id,
      date: dateString,
      content: "",
      previewText: "",
      filename,
    };

    // Add to beginning of entries list
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedEntryId(id);
    setText("");

    // Set random placeholder
    setPlaceholderText(
      placeholderOptions[Math.floor(Math.random() * placeholderOptions.length)]
    );
  };

  // Save current entry to localStorage
  const saveEntry = (entry: Entry) => {
    const updatedEntry = {
      ...entry,
      content: text,
      previewText:
        text.replace(/\n/g, " ").trim().slice(0, 30) +
        (text.length > 30 ? "..." : ""),
    };

    const updatedEntries = entries.map((e) =>
      e.id === updatedEntry.id ? updatedEntry : e
    );

    setEntries(updatedEntries);
    localStorage.setItem("freewrite-entries", JSON.stringify(updatedEntries));
  };

  // Load entries from localStorage
  const loadEntries = () => {
    const savedEntries = localStorage.getItem("freewrite-entries");
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries) as Entry[];
      setEntries(parsed);

      if (parsed.length > 0) {
        setSelectedEntryId(parsed[0].id);
        setText(parsed[0].content);
      } else {
        createNewEntry();
      }
    } else {
      createNewEntry();
    }
  };

  // Load selected entry content
  const loadEntry = (entryId: string) => {
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      setText(entry.content);
      setSelectedEntryId(entryId);
    }
  };

  // Delete entry
  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter((e) => e.id !== entryId);
    setEntries(updatedEntries);
    localStorage.setItem("freewrite-entries", JSON.stringify(updatedEntries));

    if (selectedEntryId === entryId) {
      if (updatedEntries.length > 0) {
        setSelectedEntryId(updatedEntries[0].id);
        setText(updatedEntries[0].content);
      } else {
        createNewEntry();
      }
    }
  };

  // Share with ChatGPT
  const shareWithChatGPT = () => {
    const aiChatPrompt = `below is my journal entry. wyt? talk through it with me like a friend. don't therpaize me and give me a whole breakdown, don't repeat my thoughts with headings. really take all of this, and tell me back stuff truly as if you're an old homie.
    
    Keep it casual, dont say yo, help me make new connections i don't see, comfort, validate, challenge, all of it. dont be afraid to say a lot. format with markdown headings if needed.

    do not just go through every single thing i say, and say it back to me. you need to proccess everythikng is say, make connections i don't see it, and deliver it all back to me as a story that makes me feel what you think i wanna feel. thats what the best therapists do.

    ideally, you're style/tone should sound like the user themselves. it's as if the user is hearing their own tone but it should still feel different, because you have different things to say and don't just repeat back they say.

    else, start by saying, "hey, thanks for showing me this. my thoughts:"
        
    my entry:
    ${text}`;

    const encodedText = encodeURIComponent(aiChatPrompt);
    window.open(`https://chat.openai.com/?m=${encodedText}`, "_blank");
  };

  // Share with Claude
  const shareWithClaude = () => {
    const claudePrompt = `Take a look at my journal entry below. I'd like you to analyze it and respond with deep insight that feels personal, not clinical.
    Imagine you're not just a friend, but a mentor who truly gets both my tech background and my psychological patterns. I want you to uncover the deeper meaning and emotional undercurrents behind my scattered thoughts.
    Keep it casual, dont say yo, help me make new connections i don't see, comfort, validate, challenge, all of it. dont be afraid to say a lot. format with markdown headings if needed.
    Use vivid metaphors and powerful imagery to help me see what I'm really building. Organize your thoughts with meaningful headings that create a narrative journey through my ideas.
    Don't just validate my thoughts - reframe them in a way that shows me what I'm really seeking beneath the surface. Go beyond the product concepts to the emotional core of what I'm trying to solve.
    Be willing to be profound and philosophical without sounding like you're giving therapy. I want someone who can see the patterns I can't see myself and articulate them in a way that feels like an epiphany.
    Start with 'hey, thanks for showing me this. my thoughts:' and then use markdown headings to structure your response.

    Here's my journal entry:
    ${text}`;

    const encodedText = encodeURIComponent(claudePrompt);
    window.open(`https://claude.ai/new?q=${encodedText}`, "_blank");
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Parse time input into seconds
  const parseTimeInput = (input: string): number => {
    const parts = input.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10) || 0;
      const secs = parseInt(parts[1], 10) || 0;
      return mins * 60 + secs;
    }
    return 900; // Default to 15 minutes
  };

  // Handle timer input change
  const handleTimerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimerInput(e.target.value);
  };

  // Handle timer input blur
  const handleTimerInputBlur = () => {
    const seconds = parseTimeInput(timerInput);
    setTimeRemaining(seconds);
    setLastSetDuration(seconds); // Save the user-set duration
    setEditingTimer(false);
  };

  // Handle timer input key press
  const handleTimerInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const seconds = parseTimeInput(timerInput);
      setTimeRemaining(seconds);
      setLastSetDuration(seconds); // Save the user-set duration
      setEditingTimer(false);
    } else if (e.key === "Escape") {
      setTimerInput(formatTime(timeRemaining));
      setEditingTimer(false);
    }
  };

  // Timer functionality
  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    // Prevent multiple rapid clicks
    if (resetTimerRef.current) return;
    resetTimerRef.current = true;

    // Reset to the last user-set duration
    setTimeRemaining(lastSetDuration);
    setTimerInput(formatTime(lastSetDuration)); // Update the display too

    // Make sure timer is stopped before starting it again
    setTimerRunning(false);

    // Use setTimeout to ensure state updates before starting timer again
    setTimeout(() => {
      setTimerRunning(true);
      resetTimerRef.current = false;
    }, 100);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .catch((err) => console.error("Failed to enter fullscreen", err));
    } else {
      document
        .exitFullscreen()
        .catch((err) => console.error("Failed to exit fullscreen", err));
    }
  };

  // Load disabled backspace localStorage settings.
  useEffect(() => {
    const stored = localStorage.getItem("freewrite-backspace-disabled");
    if (stored !== null) {
      setBackspaceDisabled(stored === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "freewrite-backspace-disabled",
      backspaceDisabled.toString()
    );
  }, [backspaceDisabled]);

  //UI in sync even when exit fullscreen manually
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Effect for timer
  useEffect(() => {
    // Initialize interval outside the conditional
    let interval: NodeJS.Timeout | undefined;

    if (timerRunning && timeRemaining > 0) {
      // Make sure controls stay visible when timer is running
      setShowControls(true);

      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerRunning(false);
      setShowControls(true);
    }

    // Clear interval on cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeRemaining]);

  // Effect to save current entry when text changes
  useEffect(() => {
    if (selectedEntryId) {
      const entry = entries.find((e) => e.id === selectedEntryId);
      if (entry) {
        saveEntry(entry);
      }
    }
  }, [text]);

  // Load entries and settings on initial render
  useEffect(() => {
    loadEntries();

    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem("freewrite-sidebar-visible");
    if (savedSidebarState !== null) {
      setShowSidebar(savedSidebarState === "true");
    }

    // Load dark mode state from localStorage
    const savedDarkMode = localStorage.getItem("freewrite-dark-mode");
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }

    // Load RTL mode state from localStorage
    const savedRtlMode = localStorage.getItem("freewrite-rtl-mode");
    if (savedRtlMode !== null) {
      setRtlMode(savedRtlMode === "true");
    }

    // Set random placeholder
    setPlaceholderText(
      placeholderOptions[Math.floor(Math.random() * placeholderOptions.length)]
    );

    // Focus textarea
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  // Save sidebar state when it changes
  useEffect(() => {
    localStorage.setItem("freewrite-sidebar-visible", showSidebar.toString());
  }, [showSidebar]);

  // Save dark mode state when it changes
  useEffect(() => {
    localStorage.setItem("freewrite-dark-mode", darkMode.toString());
  }, [darkMode]);

  // Save RTL mode state when it changes
  useEffect(() => {
    localStorage.setItem("freewrite-rtl-mode", rtlMode.toString());
  }, [rtlMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle RTL mode
  const toggleRtlMode = () => {
    setRtlMode(!rtlMode);
  };

  // Calculate line height based on font size
  const lineHeight = fontSize * 1.5;

  // Update timerInput whenever timeRemaining changes
  useEffect(() => {
    if (!editingTimer) {
      setTimerInput(formatTime(timeRemaining));
    }
  }, [timeRemaining, editingTimer]);

  // Add style to document head for select elements
  useEffect(() => {
    // Create a style element
    const style = document.createElement("style");

    // Define CSS rules
    const css = `
      .dark-select {
        background-color: #1f2937 !important;
        color: #e5e7eb !important;
        border-color: #374151 !important;
      }
      .dark-select option {
        background-color: #1f2937 !important;
        color: #e5e7eb !important;
      }
    `;

    // Set the CSS text
    style.textContent = css;

    // Append to head
    document.head.appendChild(style);

    // Clean up when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const cycleFontSize = () => {
    const nextIndex = (fontSizeIndex + 1) % fontSizeOptions.length;
    setFontSizeIndex(nextIndex);
    setFontSize(fontSizeOptions[nextIndex]);
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <button
        onClick={toggleFullScreen}
        className={`absolute top-4 right-4 z-50 p-2 rounded-md shadow hover:bg-opacity-80 transition ${
          darkMode
            ? "bg-gray-800 text-gray-200 border border-gray-700"
            : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
        }`}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          // Exit fullscreen icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-fullscreen-exit"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z" />
          </svg>
        ) : (
          // Enter fullscreen icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-fullscreen"
            viewBox="0 0 16 16"
          >
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5" />
          </svg>
        )}
      </button>
      {/* Sidebar */}
      <div
        className={`w-64 border-r ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        } transition-all duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative h-full z-10 ${
          showSidebar ? "block" : "hidden md:block md:hidden"
        }`}
      >
        <div
          className={`p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } flex justify-between items-center`}
        >
          <h2 className="text-lg font-medium">Entries</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={createNewEntry}
              className={`p-1 rounded ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              title="New Entry"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Hide sidebar button (desktop only) */}
            <button
              onClick={() => setShowSidebar(false)}
              className={`p-1 rounded ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } hidden md:block`}
              title="Hide sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-56px)]">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-3 border-b ${
                darkMode ? "border-gray-700" : "border-gray-100"
              } cursor-pointer ${
                selectedEntryId === entry.id
                  ? darkMode
                    ? "bg-gray-700"
                    : "bg-gray-100"
                  : darkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => loadEntry(entry.id)}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {entry.date}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEntry(entry.id);
                  }}
                  className={`${
                    darkMode
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Delete entry"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } truncate`}
              >
                {entry.previewText || "Empty entry"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* Sidebar peek indicator (only visible when sidebar is hidden on desktop) */}
        <div
          className={`absolute left-0 top-20 h-24 w-1 ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } cursor-pointer rounded-r hover:w-2 transition-all duration-200 ${
            !showSidebar ? "md:block hidden" : "hidden"
          }`}
          onClick={() => setShowSidebar(true)}
          title="Show entries"
        ></div>

        {/* Editor */}
        <div className="flex-1 flex justify-center overflow-hidden">
          <div
            className={`w-full max-w-3xl px-4 pt-16 pb-20 relative ${
              showSidebar ? "md:ml-64" : ""
            } transition-all duration-300`}
          >
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full h-full resize-none outline-none ${
                darkMode
                  ? "bg-gray-900 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
              style={{
                fontFamily,
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
                color: darkMode ? "white" : "black",
                background: darkMode ? "#111827" : "white",
                direction: rtlMode ? "rtl" : "ltr",
                textAlign: rtlMode ? "right" : "left",
              }}
              placeholder={placeholderText}
              spellCheck={false}
              onKeyDown={(e) => {
                if (backspaceDisabled && e.key === "Backspace") {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>


        <MobileMenu 
          darkMode={darkMode}
          setFontFamily={setFontFamily}
          setFontSize={setFontSize}
          fontSizeIndex={fontSizeIndex}
          setFontSizeIndex={setFontSizeIndex}
          startTimer={startTimer}
          stopTimer={stopTimer}
          timerRunning={timerRunning}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
          shareWithChatGPT={shareWithChatGPT}
          shareWithClaude={shareWithClaude}
          toggleDarkMode={toggleDarkMode}
          toggleRtlMode={toggleRtlMode}
          rtlMode={rtlMode}
          toggleFullScreen={toggleFullScreen}
          isFullscreen={isFullscreen}
          setBackspaceDisabled={setBackspaceDisabled}
          backspaceDisabled={backspaceDisabled}
          fontFamily={fontFamily}
        />

        {/* Bottom controls */}
        <div
          className={`hidden md:flex border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } p-3 flex justify-between items-center transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => !timerRunning && setShowControls(false)}
        >
          {/* Font controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={cycleFontSize}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                  darkMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-transparent text-gray-800 hover:bg-gray-100"
                }`}
                title="Change font size"
              >
                <ALargeSmall className="h-4 w-4" />
                <span className="text-sm">{fontSize}px</span>
              </button>

              <button
                onClick={() => {
                  const currentIndex = fontOptions.findIndex(f => f.value === fontFamily)
                  const nextIndex = (currentIndex + 1) % fontOptions.length
                  setFontFamily(fontOptions[nextIndex].value)
                }}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                  darkMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-transparent text-gray-800 hover:bg-gray-100"
                }`}
                title="Change font"
              >
                <Type className="h-4 w-4" />
                <span className="text-sm">{fontOptions.find(f => f.value === fontFamily)?.name}</span>
              </button>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className="flex items-center space-x-2">
              {editingTimer ? (
                <input
                  type="text"
                  value={timerInput}
                  onChange={handleTimerInputChange}
                  onBlur={handleTimerInputBlur}
                  onKeyDown={handleTimerInputKeyPress}
                  className={`timer-input ${
                    darkMode ? "bg-gray-800 text-gray-200" : ""
                  }`}
                  autoFocus
                />
              ) : (
                <span
                  className={`text-sm cursor-pointer hover:underline ${
                    timerRunning
                      ? darkMode
                        ? "text-gray-300 font-semibold"
                        : "text-gray-600 font-semibold"
                      : ""
                  }`}
                  onClick={() => !timerRunning && setEditingTimer(true)}
                  title={
                    timerRunning
                      ? "Timer is running"
                      : "Click to edit timer duration"
                  }
                >
                  {formatTime(timeRemaining)}
                </span>
              )}
              {!timerRunning ? (
                <button
                  onClick={startTimer}
                  className={`${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Start timer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className={`${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Stop timer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={resetTimer}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Reset and start timer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* AI helpers */}
            <div className="flex items-center space-x-2">
              <button
                onClick={shareWithChatGPT}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Share with ChatGPT"
              >
                <img src="/chatgpt_icon.png" alt="ChatGPT" className="h-5 w-5" />
              </button>
              <button
                onClick={shareWithClaude}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Share with Claude"
              >
                <img 
                  src="/claude_icon.png" 
                  alt="Claude" 
                  className={`h-5 w-5 ${!darkMode ? "invert" : ""}`} 
                />
              </button>
            </div>

            {/* History icon */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`${
                darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Show history"
            >
              <History className="h-5 w-5" />
            </button>

            {/* Settings icon */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className={`${
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  } p-1`}
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className={`rounded-lg p-4 w-72 shadow-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                  sideOffset={5}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                        Settings
                      </h3>
                      <Popover.Close className={`p-1 rounded-full hover:bg-opacity-10 ${
                        darkMode ? "hover:bg-white" : "hover:bg-gray-900"
                      }`}>
                        <X className="h-4 w-4" />
                      </Popover.Close>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Appearance
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Dark Mode
                          </span>
                          <button
                            onClick={toggleDarkMode}
                            className={`p-1.5 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            {darkMode ? (
                              <Moon className="h-4 w-4" />
                            ) : (
                              <Sun className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            RTL Mode
                          </span>
                          <button
                            onClick={toggleRtlMode}
                            className={`p-1.5 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            {rtlMode ? (
                              <AlignLeft className="h-4 w-4" />
                            ) : (
                              <AlignRight className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Editor
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Fullscreen
                          </span>
                          <button
                            onClick={toggleFullScreen}
                            className={`p-1.5 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            {isFullscreen ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Backspace
                          </span>
                          <button
                            onClick={() => setBackspaceDisabled(!backspaceDisabled)}
                            className={`p-1.5 rounded-full ${
                              darkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            <Delete className={`h-4 w-4 ${backspaceDisabled ? "opacity-50" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Popover.Arrow className={`fill-current ${darkMode ? "text-gray-800" : "text-white"}`} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
