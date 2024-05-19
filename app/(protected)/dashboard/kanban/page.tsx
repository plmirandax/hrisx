import { Metadata } from "next"
import { BoardList} from "./_components/board-list"

export const metadata: Metadata = {
  title: "Kanban",
  description: "Advanced form example using react-hook-form and Zod.",
}
const KanbanPage = async () => {


  return (
    <div className="w-full mb-20">
      Kanban Page
    </div>
  )
}

export default KanbanPage
