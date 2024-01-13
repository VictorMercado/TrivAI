"use client";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { motion } from "framer-motion";
import { cn } from "@/src/utils";

type TabSwitcherProps = {
  routes: string[];
  className?: string;
};

const TabSwitcher = ({ routes, className }: TabSwitcherProps) => {
  let style = "text-xl text-gray-500 text-center hover:text-blue-500";
  let conditionalStyle = "!text-blue-500";
  const baseRoute = usePathname();
  console.log(baseRoute);
  
  return (
    <div
      data-theme=""
      className="mx-auto my-6 grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 w-max"
    >
      {routes.map((route) => {
        return (
          <motion.span key={route} className={cn("", className)}>
            <NavLink
              href={`/${route}`}
              className={style}
              conditionalStyle={conditionalStyle}
            >
              <b>{route.charAt(0).toUpperCase() + route.slice(1)}</b>
            </NavLink>
          </motion.span>
        );
      })}
    </div>
  );
}

export { TabSwitcher }