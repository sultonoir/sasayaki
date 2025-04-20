"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ========================
// Context
// ========================
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  hoveredTab: string | null;
  setHoveredTab: (id: string | null) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab component must be used within <AnimatedTabs.Root>");
  }
  return context;
};

// ========================
// Root Component
// ========================
interface AnimatedTabsRootProps {
  defaultTab: string;
  children: ReactNode;
  className?: string;
}

const Root = ({ defaultTab, children, className }: AnimatedTabsRootProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const value = useMemo(
    () => ({ activeTab, setActiveTab, hoveredTab, setHoveredTab }),
    [activeTab, hoveredTab],
  );

  return (
    <TabsContext.Provider value={value}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// ========================
// Trigger
// ========================
const List = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-muted-foreground inline-flex rounded-lg px-2">
      {children}
    </div>
  );
};

interface TriggerProps extends React.ComponentProps<"button"> {
  id: string;
  children: ReactNode;
}

const Trigger = ({ id, children, className, ...props }: TriggerProps) => {
  const { activeTab, setActiveTab, setHoveredTab, hoveredTab } =
    useTabsContext();
  const isActive = activeTab === id;
  const isHovered = hoveredTab === id;

  return (
    <button
      onMouseEnter={() => setHoveredTab(id)}
      onMouseLeave={() => setHoveredTab(null)}
      onClick={() => setActiveTab(id)}
      className={cn(
        "relative flex h-full items-center justify-center p-2 text-sm font-medium text-white transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="isActive"
          layout
          className="bg-primary absolute inset-x-0 bottom-0 h-0.5"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.5,
          }}
        />
      )}
      {isHovered && (
        <motion.div
          layoutId="shouldShowHighlight"
          layout
          className="bg-accent absolute inset-x-0 top-[6px] h-6 rounded-sm contain-strict"
          style={{ borderRadius: 6 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            mass: 0.5,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </button>
  );
};

// ========================
// Content
// ========================
interface ContentProps extends HTMLMotionProps<"div"> {
  id: string;
  children: ReactNode;
}

const Content = ({ id, children, ...props }: ContentProps) => {
  const { activeTab } = useTabsContext();

  return (
    <>
      {activeTab === id && (
        <motion.div
          key={id}
          initial={{
            opacity: 0,
            scale: 0.95,
            x: -10,
            filter: "blur(10px)",
          }}
          animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, x: -10, filter: "blur(10px)" }}
          transition={{
            duration: 0.5,
            ease: "circInOut",
            type: "spring",
          }}
          className={cn("flex-1 p-1 outline-none", props.className)}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

// ========================
// Export as Compound
// ========================
export const AnimatedTabs = {
  Root,
  List,
  Trigger,
  Content,
};
