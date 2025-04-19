"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ========================
// Context
// ========================
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
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
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div
        className={cn(
          "flex size-full flex-1 flex-col gap-y-4 overflow-y-auto",
          className,
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// ========================
// Trigger
// ========================
const List = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-fit flex-wrap gap-2 rounded-xl bg-transparent p-1 backdrop-blur-sm">
      {children}
    </div>
  );
};

interface TriggerProps extends React.ComponentProps<"button"> {
  id: string;
  children: ReactNode;
}

const Trigger = ({ id, children, className, ...props }: TriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "relative rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab"
          className="bg-opacity-50 bg-accent absolute inset-0 !rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
          transition={{ type: "spring", duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
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
          className={cn("p-1", props.className)}
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
