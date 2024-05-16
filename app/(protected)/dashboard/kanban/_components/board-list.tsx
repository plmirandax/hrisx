'use client'

import { HelpCircleIcon, User2 } from "lucide-react"
import Image from "next/image"
import { Hint } from "./hint"

export const BoardList = () => {
    return(
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg">
                <User2 className='h-6 w-6 mr-2'/>
                Your Kanban Boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:gird-cols-4 gap-4">
                <div role="button"
                className="aspect-video relative h-[50px] w-full bg-muted rounded-sm flex
                flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
                    <p className="text-sm">
                        Create New Board
                    </p>
                    <Hint
                    sideOffset={40}
                    description={'test'}
                    >
                        
                        <HelpCircleIcon className="abosolute bottom-2 right-2 h-[14px] w-[14ox]"/>
                    </Hint>
                </div>
            </div>
        </div>
    )
}