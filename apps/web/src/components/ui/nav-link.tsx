"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className: string;
    conditionalStyle?: string;
}

//wrap link with forwardRef to pass ref to the underlying element
const NavLink = ({href, children, className, conditionalStyle} : NavLinkProps) => {
    let path = usePathname();
    let isActive: boolean = `${path}` === href;
    
    return (
      <Link
        href={href}
        className={`${className} ${isActive ? conditionalStyle : ""}`}
      >
        {" "}
        {children}{" "}
      </Link>
    );
}

export { NavLink };