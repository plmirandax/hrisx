'use server'
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import {z} from 'zod'

const CreateBoard = z.object({
    title: z.string()
})

export async function create(formData: FormData) {
   const { title } = CreateBoard.parse({
    title: formData.get('title')
   })

    await prisma.board.create({
        data: {
            title,
        }
    })
    revalidatePath("/dashboard/kanban")
}

