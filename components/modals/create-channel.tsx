"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { redirect, useParams, useRouter } from "next/navigation";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { apiPaths, paths } from "@/helpers/paths";
import { useModalStore } from "@/providers/modal-store-provider";
import { ModalType } from "@/stores/modal-store";
import { ChannelType, Server } from "@prisma/client";

export const createChannelFormSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Channel name is required" })
    .refine(
      (name: string) => {
        return name !== "general";
      },
      {
        message: "Channel name cannot be 'general'",
      }
    ),
  type: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, { message: "Channel type is required" })
    .refine((value) => {
      // Take care of the case as the Channel Type is an enum with all values in uppercase
      return Object.values(ChannelType).includes(value as ChannelType);
    }),
});

export type CreateChannelFormSchemaType = z.infer<
  typeof createChannelFormSchema
>;

function CreateChannelModal() {
  const { isOpen, onClose, type } = useModalStore((state) => state);

  const router = useRouter();
  const params = useParams();

  const form = useForm<CreateChannelFormSchemaType>({
    resolver: zodResolver(createChannelFormSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: CreateChannelFormSchemaType) => {
    const serverId = params?.serverId;

    if (!serverId) {
      return;
    }
    const url = qs.stringifyUrl({
      url: `/api/channels`,
      query: {
        serverId,
      },
    });

    await axios.post(url, data);

    form.reset();
    router.refresh();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen && type === ModalType.createChannel}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs text-bold text-zinc-500 dark:text-secondary/70">
                        Channel name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter channel name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="uppercase text-xs text-bold text-zinc-500 dark:text-secondary/70">
                        Channel type
                      </FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                            <SelectValue
                              placeholder={"Select a channel type"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ChannelType).map((type) => {
                              return (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className="capitalize"
                                >
                                  {type.toLowerCase()}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant={"primary"}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChannelModal;
