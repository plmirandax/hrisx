"use client";

import * as z from "zod";
import { useEffect, useState, useTransition, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UploadPayslipSchema } from "@/schemas";
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
import FileUpload from "@/components/upload-file";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Months, Periods } from "@prisma/client";
import { toast } from "sonner";
import { UploadPayslip } from "@/actions/upload-payslip";

type Employees = {
  id: string;
  firstName: string;
  lastName: string;
};

export const UploadPayslipForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/fetch-employees")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setEmployees(data.employees))
      .catch(() => toast.error("An error occurred while fetching employees. Please try again."));
  }, []);

  const form = useForm<z.infer<typeof UploadPayslipSchema>>({
    resolver: zodResolver(UploadPayslipSchema),
    defaultValues: {
      payslipFile: "",
      months: undefined,
      periods: undefined,
      userId: "",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof UploadPayslipSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      UploadPayslip(values)
        .then((data) => {
          setError(data.error);
          toast.success("Payslip uploaded successfully.")

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
  }, [form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 w-4 h-4" />
          Upload Employee Payslip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Employee Payslip Information</DialogTitle>
          <DialogDescription>
            Enter your required employee payslip details. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-4 mb-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Employee Name</FormLabel>
                    <FormControl>
                      <Controller
                        name="userId"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select employee..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {employees.map((employee) => (
                                  <SelectItem key={employee.id} value={employee.id}>
                                    {employee.firstName} {employee.lastName}
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
              <FormField
                control={form.control}
                name="months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Month of</FormLabel>
                    <FormControl>
                      <Controller
                        name="months"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPending}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select month of..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Months.January}>January</SelectItem>
                              <SelectItem value={Months.February}>February</SelectItem>
                              <SelectItem value={Months.March}>March</SelectItem>
                              <SelectItem value={Months.April}>April</SelectItem>
                              <SelectItem value={Months.May}>May</SelectItem>
                              <SelectItem value={Months.June}>June</SelectItem>
                              <SelectItem value={Months.July}>July</SelectItem>
                              <SelectItem value={Months.August}>August</SelectItem>
                              <SelectItem value={Months.September}>September</SelectItem>
                              <SelectItem value={Months.October}>October</SelectItem>
                              <SelectItem value={Months.November}>November</SelectItem>
                              <SelectItem value={Months.December}>December</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="periods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Period</FormLabel>
                    <FormControl>
                      <Controller
                        name="periods"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isPending}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select period..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Periods.FirstHalf}>1st Half</SelectItem>
                              <SelectItem value={Periods.SecondHalf}>2nd Half</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payslipFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Payslip File</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="image"
                        value={field.value}
                        onChange={(url) => field.onChange(url)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" className="w-full mt-4" disabled={isPending}>Upload Payslip</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will upload and email the payslip to the employee that you have selected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="w-1/2">Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      type="submit"
                      disabled={isPending}
                      onClick={() => form.handleSubmit(onSubmit)()}
                      className="w-1/2"
                    >
                      Confirm Upload
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
