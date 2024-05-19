'use client'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion'
import { TypeAnimation } from "react-type-animation";

const FirstSection = () => {
    return ( 
        <section className="md:py-20 py-10 bg-gradient-to-r from-gray-00 to-gray-200">
            <div className="container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center min-h-[20vh]"
                >
                    <h1 className="mb-4 text-4xl sm:text-5xl lg:text-8xl lg:leading-normal font-extrabold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                            RD REALTY
                        </span>
                        <br />
                        <TypeAnimation
                            sequence={[
                                "DEVELOPMENT",
                                500,
                                "CORPORATION",
                                500,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </h1>
                    <Label className="text-2xl font-bold">
                    A MEMBER OF RD GROUP OF COMPANIES
                    </Label>
                </motion.div>

                <div className="flex gap-4 justify-center pt-10">
                    <Button className="font-bold" variant='default'>Get Started</Button>
                    <Button className="font-bold" variant='outline'>Learn More</Button>
                </div>

                <div className="pt-10">
                    <video className="rounded-xl mx-auto" autoPlay muted loop>
                        <source src="/content/vid1.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
        </section> 
    );
}

export default FirstSection;
