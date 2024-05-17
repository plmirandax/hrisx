"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateDepartmentSchema } from "@/schemas";
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
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createDepartment } from "@/actions/department-create";

export const CreateDeptForm= () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof CreateDepartmentSchema>>({
    resolver: zodResolver(CreateDepartmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateDepartmentSchema>) => {
    setError("");
    setSuccess("");
  
    startTransition(() => {
      createDepartment(values)
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
    <Card className="xl:col-span-2 w-[650px]">
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="grid gap-2">
          <CardTitle className="font-semibold">Departments</CardTitle>
          <CardDescription>Your list of departments.</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Department name.."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Description</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="(optional)"
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
              Create Department
            </Button>
          </form>
        </Form>
                    </CardContent>
            </Card>
  );
};
