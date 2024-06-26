import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons"

export const labels = [
  {
    value: "bug",
    label: "Under Renovation",
  },
  {
    value: "feature",
    label: "For Sale",
  },
  {
    value: "documentation",
    label: "For Lease",
  },
]

export const statuses = [
  {
    value: "true",
    label: "1st Half",
  },
  {
    value: "false",
    label: "2nd Half",
  },
]

export const classification = [
  {
    value: "backlog",
    label: "Real Properties",
    icon: CheckCircledIcon,
  },
  {
    value: "todo",
    label: "Commercial Spaces",
    icon: CheckCircledIcon,
  },
  {
    value: "in progress",
    label: "Industrial Spaces",
    icon: CheckCircledIcon,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]
