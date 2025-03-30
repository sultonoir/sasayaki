"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex-helpers/react";
import { useMutation } from "convex/react";
import React, { FormEvent, useState } from "react";

const TodoClient = () => {
  const { isPending, isError, data } = useQuery(api.todo.todo_service.getTodos);
  if (isPending) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }
  return (
    <div className="container max-w-screen-sm space-y-5 py-5">
      <div className="flex flex-wrap gap-2">
        {data.map((item) => (
          <div
            key={item._id}
            className="flex flex-col rounded-lg bg-zinc-500 px-3 py-2">
            <span>{item.value}</span>
          </div>
        ))}
      </div>
      <TodoForm />
    </div>
  );
};

function TodoForm() {
  const [name, setName] = useState("");
  const mutate = useMutation(api.todo.todo_service.createTodo);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      mutate({ name });
    } catch (error) {
      console.log(error);
    }
    setName("");
  };
  return (
    <form
      className="flex gap-2"
      onSubmit={handleSubmit}>
      <label className="sr-only">todo</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-zinc-400 px-2"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-sky-500 rounded-lg cursor-pointer">
        Submit
      </button>
    </form>
  );
}

export default TodoClient;
