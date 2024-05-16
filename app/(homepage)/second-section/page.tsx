

'use client'

import React from "react"
import Image from "next/image"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"


const features = [
    {
        name: "Customizable",
        description:
          "Choose from 100s of designer made templates, and change anything you want to create your professional eCommerce website.",
        image: "/images/icon-cloud.png",
        alt: "Customizable",
        color: "blue"
      },
      {
        name: "Fast ",
        description:
          "Choose from 100s of designer made templates, and change anything you want to create your professional eCommerce website.",
        image: "/images/icon-fast.png",
        alt: "Customizable",
      },
      {
        name: "Integrations",
        description:
          "Choose from 100s of designer made templates, and change anything you want to create your professional eCommerce website.",
        image: "/images/icon-journey.png",
        alt: "Customizable",
      },
      {
        name: "Full Stack",
        description:
          "Choose from 100s of designer made templates, and change anything you want to create your professional eCommerce website.",
        image: "/images/icon-layer.png",
        alt: "Customizable",
      },
      {
        name: "Loyalty",
        description:
          "Set up your loyalty program and start rewarding your customers for their purchases and actions they take on your site.",
        image: "/images/icon-location.png",
        alt: "Customizable",
      },
      {
        name: "Support",
        image: "/images/icon-support-1.png",
        description: "Get 24/7 support from our team to help you with any issues you have.",
        alt: "Customizable",
      },
    ]

const SecondSection = () => {
    return ( 
    <div className="">
        <div className="
md:flex-row
      
flex-col
items-center
flex  justify-center pb-10
        
        ">
            <div className="p-5 justify-center md:w-1/3">
                <div className="
               text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700
                md:text-6xl
                font-bold
                pb-10
                
                ">
                   RD Realty Development Corporation is your trusted partner for your real estate need.

                </div>
                <div className="text-2xl mb-8">
                  <Label className="text-xl">Built for all businesses and communities, RD Realty Development Corporation is the only realtor you need to grow your business.</Label>
              

                </div>
                <Button size='lg' className="w-[250px] h-[50px] text-lg">
                        Get Started
                </Button>
                </div>
                

                <video className="rounded-xl md:w-2/4 p-4 md:p-0 "  autoPlay muted loop >
                    <source src="/content/vid1.mp4" type="video/mp4" />

                </video>

            </div>

            <div className="flex-col items-center justify-center">
                <div className="
                text-3xl
                flex
                justify-center
                md:text-5xl
                font-bold
                pt-5
                pb-10
                bg-gradient-to-r from-blue-600 to-blue-700
                bg-clip-text
                text-transparent
                ">
                        Why choose us?


                </div>

                <div className="grid grid-cols-1 p-4 md:grid md:grid-cols-3 gap-4 md:px-40">
                    {features.map((feature, index) => (
                        <div
                        key={index}
                        className="flex-col space-y-6 pb-10 border
                        
                        p-8 rounded-xl items-center justify-center w-full hover:scale-105 transform transition-all duration-500 ease-in-out
                        "
                        >
                            <div>
                                <Image
                                src={feature.image}
                                alt={feature.alt}
                                width={300}
                                height={300}
                                className="object-contain h-20 w-20 items-center justify-center flex mb-10"
                                />
                                <div>
                                    <div>
                                      <Label className="font-semibold text-2xl">• {feature.name}</Label>
                                    </div>
                                    <div>
                                      <Label className="font-semibold text-xl">{feature.description}</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>



  );
}
 
export default SecondSection;