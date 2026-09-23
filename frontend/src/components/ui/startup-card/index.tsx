"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Startup } from "@/data/types";
import CardFront from "./CardFront";
import CardBack from "./CardBack";

interface Props {
  startup: Startup;
  index?: number;
}

export default function StartupCard({ startup, index = 0 }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3), ease: [0.25, 0.46, 0.45, 0.94] }}
      className="perspective group h-[425px] cursor-pointer"
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front side */}
        <div className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          <CardFront startup={startup} />
        </div>

        {/* Back side */}
        <div className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardBack startup={startup} />
        </div>
      </div>
    </motion.div>
  );
}
