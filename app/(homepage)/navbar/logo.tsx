
import Image from "next/image";

const Logo = () => {
    return ( <div>

    <Image 
    src="/assets/rdrdc.webp" 
    alt="logo" 
    width={40} 
    height={40} 
    className="flex flex-col"
    />
    
    </div> );
}
 
export default Logo;