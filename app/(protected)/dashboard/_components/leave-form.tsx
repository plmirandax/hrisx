'use client';

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInDays, format } from "date-fns";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { CreateLeave } from "@/actions/create-leave";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/datepicker";

type LeaveType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export const CreateLeaveForm = () => {
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
      numberOfDays: "",
      approverId: user?.approverId,
      userId: user?.id,
    },
  });

  // Watch for changes in startDate and endDate
  const startDate = useWatch({
    control: form.control,
    name: "startDate",
  });
  const endDate = useWatch({
    control: form.control,
    name: "endDate",
  });

  // Calculate the number of days between startDate and endDate
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const numberOfDays = differenceInDays(end, start) + 1; // Include the start date
      form.setValue("numberOfDays", numberOfDays.toString());
    } else {
      form.setValue("numberOfDays", ""); // Reset if dates are invalid
    }
  }, [startDate, endDate, form]);

  const onSubmit = (values: z.infer<typeof CreateLeaveSchema>) => {
    setError("");
    setSuccess("");

    console.log("Form Values:", values);

    startTransition(() => {
      CreateLeave(values)
        .then((data) => {
          setError(data.error);
        toast.success("Leave submitted successfully.");
          
          if (!data.error) {
            form.reset();
          }
        })
        .finally(() => {
          setTimeout(() => {
            setError(undefined);
            setSuccess(undefined);
          }, 5000);
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
                        <Controller
                          name="leaveType"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isPending}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a leave type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {leaveTypes.map((leaveType) => (
                                    <SelectItem key={leaveType.id} value={leaveType.name}>
                                      {leaveType.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
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
                        <Controller
                          name="startDate"
                          control={form.control}
                          render={({ field }) => (
                            <DatePicker
                              value={field.value ? new Date(field.value) : undefined}
                              onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                
                            />
                          )}
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
                        <Controller
                          name="endDate"
                          control={form.control}
                          render={({ field }) => (
                            <DatePicker
                              value={field.value ? new Date(field.value) : undefined}
                              onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
         
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-2 mb-4 flex space-x-4">
              <div className="w-1/2">
              <FormField
                control={form.control}
                name="numberOfDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total # of days</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="0"
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              <div className="mt-2 w-1/2">
                <Label>Leave Balance</Label>
                <Input
                  placeholder="0"
                  readOnly
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
            <Button disabled={isPending} type="submit" className="w-full mt-4">
              Submit Leave
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
