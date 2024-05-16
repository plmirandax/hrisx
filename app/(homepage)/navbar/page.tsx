import { ModeToggle } from "@/components/theme-toggle";
import ActionButtons from "./action-buttons";
import Logo from "./logo";
import { NavigationMenuBar } from "./navigation-bar";

const Navbar = () => {
    return ( 
        <div className="flex justify-between items-center px-10 border-b h-20">
            <Logo />
            <div className="flex-1 flex justify-center ml-20">
                <NavigationMenuBar />
            </div>
            <div className="ml-auto"><ActionButtons /></div>
            <div className="mt-[-8px]"><ModeToggle /></div>
        </div>
    );
}

export default Navbar;
