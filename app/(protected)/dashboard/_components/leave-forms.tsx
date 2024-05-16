"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateLeaveSchema, RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,  
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { CreateLeave } from "@/actions/create-leave";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { fetchLeaveTypes } from "../_data/fetch-leave-type";

type LeaveType = {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
  };

export const CreatLeaveForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();


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
      startDate: "",
      endDate: "",
      reason: "",
      leaveType: "",
      approverId: user?.approverId,
      userId: user?.id,
    },
  });

  const onSubmit = (values: z.infer<typeof CreateLeaveSchema>) => {
    setError("");
    setSuccess("");

    console.log("Form Values:", values)
    
    startTransition(() => {
      CreateLeave(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
    });
  };

  return (
<Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 w-4 h-4" />
          Submit Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Leave Form</DialogTitle>
          <DialogDescription>
            Enter your leave details here. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-1/2 mt-[-8px]">
                <FormField
                  control={form.control}
                  name="leaveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
                      <FormControl>
                      <Select
  {...form.register("leaveType")} // Register the leaveType field with react-hook-form
  defaultValue="" // Set a default value for the select field
>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-4">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-4 mb-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPending}
                      placeholder="Enter reason here..."
                      className="h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full mt-4"
            >
              Create an account
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
