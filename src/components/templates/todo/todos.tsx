"use client";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/provider/socket-provider";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "sonner";
import { ButtonLoading } from "../button/button-loading";

export function Todos() {
  const { socket, isConnected } = useSocket();
  const { data } = api.todo.getAllTodo.useQuery();
  const mutating = api.todo.deleteTodo.useMutation({
    onSuccess: (data) => {
      if (socket && isConnected) {
        socket.emit("deleteTodo", data);
      }
    },
  });

  const handleDelete = (id: string) => {
    mutating.mutate({ id });
  };
  return (
    <div className="space-y-2 p-5">
      <div className="flex flex-wrap gap-2">
        {data?.map((item) => (
          <ButtonLoading
            onClick={() => handleDelete(item.id)}
            variant="outline"
            key={item.id}
          >
            {item.value}
          </ButtonLoading>
        ))}
      </div>
      <FormTodo />
    </div>
  );
}

const FormTodo = () => {
  const { socket, isConnected } = useSocket();
  const [value, setValue] = React.useState("");

  const { mutate, isPending } = api.todo.createTodo.useMutation({
    onSuccess: (data) => {
      if (socket && isConnected) {
        socket.emit("todo", data);
      }
    },
    onError() {
      toast.error("エラーが発生しました");
    },
  });

  const handleSubmit = () => {
    mutate({ content: value });
    setValue("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border-2 border-input px-3 py-1"
        placeholder="タスクを入力してください"
      />
      <ButtonLoading
        onClick={handleSubmit}
        disabled={isPending}
        className="rounded-lg bg-primary px-3 py-1"
      >
        送信
      </ButtonLoading>
    </div>
  );
};
