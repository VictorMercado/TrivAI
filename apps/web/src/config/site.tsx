import {
  Eye,
  Home,
  LineChart,
  Scroll,
  Settings,
  Store,
  Shield,
  User,
  Sword,
  Users,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

type Route = {
  access: "USER" | "ADMIN" | "ALL";
  route: string;
  color: string;
  name: string;
  icon?: JSX.Element;
};

const routes: Array<Route> = [
  {
    access: "ALL",
    route: "/",
    color: "bg-[#f4b709]",
    name: "Home",
    icon: <Home />,
  },
  {
    access: "ADMIN",
    route: "/admin",
    color: "bg-[#f87171]",
    name: "Admin",
    icon: <Shield />,
  },
  {
    access: "USER",
    route: "/profile",
    color: "bg-[#DD7DFF]",
    name: "Profile",
    icon: <User />,
  },
  // {
  //   access: "USER",
  //   route: "/allegiance",
  //   color: "bg-[#39DBFF]",
  //   name: "Alleigance",
  //   icon: <Sword />,
  // },
  {
    access: "ALL",
    route: "/quizzes",
    color: "bg-[#39DBFF]",
    name: "Quizzes",
    icon: <Scroll />,
  },
  {
    access: "ALL",
    route: "/results",
    color: "bg-[#88FF8A]",
    name: "Results",
    icon: <LineChart />,
  },
  {
    access: "USER",
    route: "/friends",
    color: "bg-[#DD7DFF]",
    name: "Friends",
    icon: <Users />,
  },
  {
    access: "ALL",
    route: "/store",
    color: "bg-[#f4b709]",
    name: "Store",
    icon: <Store />,
  },
  {
    access: "ALL",
    route: "/about",
    color: "bg-[#f87171]",
    name: "About",
    icon: <Eye />,
  },
  {
    access: "USER",
    route: "/settings",
    color: "bg-[#f4b709]",
    name: "Settings",
    icon: <Settings />,
  },
];

export const siteConfig = {
  name: "TrivAI",
  titles: {
    home: "TrivAI",
    admin: "Admin",
    about: "About",
    profile: "Profile",
    results: "Results",
    quizzes: "Quizzes",
    friends: "Friends",
    allegiance: "Allegiance",
    settings: "Settings",
    store: "Store",
    notFound: "Not Found",
  },
  description: "A trivia game for the AI era",
  url: "https://trivai.vercel.app",
  image: "/images/logo.png",
  routes: routes,
}

// profile routes are routes relating to the user except for Results that is a site wide route
export const profileRoutes = routes.filter((route) => route.access === "USER" ).map(({route, name, icon}) => ({route , name, icon}));

// site routes are routes that are site wide
export const siteRoutes = routes.filter((route) => route.access === "ALL" ).map(({route, name, icon}) => ({route, name, icon}));