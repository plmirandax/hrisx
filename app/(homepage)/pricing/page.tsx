import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const features = [
    {
        name : "Home",
        price : "$40/month",
        fees : "3.7% + 30¢ per transaction",
        description : "Start selling online with a simple and easy to use platform. Create your first store in minutes..",
        },
        {
            name : "Commercial Spaces",
            price : "$80/month",
            fees : "2.9% + 30¢ per transaction",
            description : "Level up your business with a powerful eCommerce platform. Get access to all the features you need to grow.",
        },
        {
            name : "Land",
            price : "$200/month",
            fees : "2.4% + 30¢ per transaction",
            description : "For businesses that need more. Get access to all the features you need to grow.",
    
        }
]


const Pricing = () => {
    return ( 
    <div className="flex flex-col justify-center items-center">
        <div className="
        text-4xl 
        text-center
         md:text-6xl 
         font-bold 
         bg-gradient-to-r from-blue-600 to-blue-700
         bg-clip-text
         text-transparent md:pb-10
        
        ">
            Rental Prices
            <div className="text-2xl text-center md:text-4xl font-bold md:py-10">
                Simple and transparent rental prices for all businesses.

            </div>

        </div>

        <div className="md:flex">
            {features.map((feature, index) => (
                <div 
                key={index}
                className="p-4"
                
                >
                    <div  
                    className="
                    grid
                    justify-center
                    items-center
                    gap-4
                    border
                    rounded-xl
                    p-4 
                    w-96
                    h-96
                    
                    
                    
                    ">

                        <div>
                        <Label className="font-bold text-2xl">
                            {feature.name}
                        </Label>
                        </div>
                        <div>
                        <Label className="font-semibold text-lg">
                        {feature.price}
                        </Label>
                       </div>
                        <div>
                        <Label className="text-lg">
                        {feature.fees}
                        </Label>    
                        </div>
                        <div>
                        <Label>
                        {feature.description}
                        </Label>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            <Button>
                            Get Started
                            </Button>
                          
                            </div>



                        </div>

                    </div>
                ))}

        </div>
     
    </div> );
}
 
export default Pricing;