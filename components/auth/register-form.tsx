"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PlusCircleIcon } from "lucide-react";

type Approvers = {
  id: string;
  firstName: string;
  lastName: string;
};

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [approvers, setApprovers] = useState<Approvers[]>([]);
  const user = useCurrentUser();

  useEffect(() => {
    fetch('/api/fetch-approver')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setApprovers(data.approvers))
      .catch(() =>
        toast.error('An error occurred while fetching approvers. Please try again.')
      );
  }, []);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      contactNo: "",
      address: "",
      role: undefined,
      approverId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
          
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
          Register Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Employee Information</DialogTitle>
          <DialogDescription>
            Enter your required employee details. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-semibold">First Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="Juan" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-semibold">Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="Dela Cruz" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="email@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full space-x-4">
                <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Role</FormLabel>
                      <FormControl>
                        <Controller
                          name="role"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isPending}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={UserRole.User}>User</SelectItem>
                                <SelectItem value={UserRole.Approver}>Approver</SelectItem>
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
                <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="approverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Approver</FormLabel>
                      <FormControl>
                        <Controller
                          name="approverId"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isPending}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select approver..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {approvers.map((approver) => (
                                    <SelectItem key={approver.id} value={approver.id}>
                                      {approver.firstName} {approver.lastName}
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
              <div className="flex w-full space-x-4">
                <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Address</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="Complete address.." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Contact No.</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="Contact number.." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                
                
              </div>
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              Create an account
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
