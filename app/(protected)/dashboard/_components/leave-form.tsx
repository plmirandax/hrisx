"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateLeaveSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/datepicker";
import { Label } from "@/components/ui/label";

// Define the type for leave types
type LeaveType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export const LeaveForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]); // Use the defined type here

  useEffect(() => {
    fetch('/api/fetch-leave-type') // replace with your API route
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setLeaveTypes(data.leaveTypes))
      .catch(() => toast.error('An error occurred while fetching leave types. Please try again.'));
  }, []);

  const form = useForm<z.infer<typeof CreateLeaveSchema>>({
    resolver: zodResolver(CreateLeaveSchema),
    defaultValues: {
      leaveTypeId: '',
      startDate: '',
      endDate: '',
      reason: '',
      approverId: user?.approverId,
      userId: user?.id,
    },
  });


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><PlusCircleIcon className="mr-2 w-4 h-4" />Submit Leave</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Leave Form</DialogTitle>
          <DialogDescription>
            Enter your leave details here. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
  <div className="flex space-x-4"> {/* Add flex and space-x-4 classes to create a horizontal layout */}
    <div className="w-1/2"> {/* Set width to half of the container */}
      <div>
        <Label>Name</Label>
        <Input value={`${user?.firstName || ''} ${user?.lastName || ''}`} readOnly/>
      </div>
    </div>
    <div className="w-1/2"> {/* Set width to half of the container */}
      <div>
        <Label>Leave Type</Label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a leave type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {leaveTypes.map((leaveType) => (
                <SelectItem key={leaveType.id} value={leaveType.id}>
                  {leaveType.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
  <div>
    <Label>Start Date</Label>
    <DatePicker value={undefined} onChange={date =>(date)} />
  </div>
  <div>
    <Label>End Date</Label>
    <DatePicker value={undefined} onChange={date =>(date)} />
  </div>
  <div>
    <Label className="mb-4">Reason</Label>
    <Textarea disabled={isPending} placeholder="Reason here" className="h-40" />
  </div>
</div>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
            >
              Submit Leave
            </Button>
      </DialogContent>
    </Dialog>
  );
};
