"use client";

import * as FiIcons from "react-icons/fi";
import * as SiIcons from "react-icons/si";
import { FiCode } from "react-icons/fi";

const DynamicIcon = ({ name, className, style }) => {
  if (!name) return null;

  // Try Feather Icons first
  let IconComponent = FiIcons[name];

  // Try Simple Icons if not found in Feather
  if (!IconComponent) {
    IconComponent = SiIcons[name];
  }

  // Fallback to FiCode if still not found
  if (!IconComponent) {
    return <FiCode className={className} style={style} />;
  }

  return <IconComponent className={className} style={style} />;
};

export default DynamicIcon;
