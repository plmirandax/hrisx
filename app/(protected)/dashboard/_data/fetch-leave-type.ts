import { prisma } from '@/lib/db'

export const fetchLeaveTypes = async () => {
    try {
        const leaveTypes = await prisma.leaveType.findMany()
        return { leaveTypes }
    } catch (error) {
        return { error }        
    }
}