// import { useIsFetching } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form"
import {
	useCreateTodo,
	useDeleteTodo,
	useUpdateTodo,
} from "../services/mutations"
import { useTodosIds, useTodos } from "../services/queries"
import { Todo } from "../types/todo"

function Todos() {
	const todosIdsQuery = useTodosIds()
	const todosQueries = useTodos(todosIdsQuery.data)
	// const isFetching = useIsFetching()

	const createTodoMutation = useCreateTodo()
	const updateTodoMutation = useUpdateTodo()
	const deleteTodoMutation = useDeleteTodo()

	const { register, handleSubmit } = useForm<Todo>()

	const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
		createTodoMutation.mutate(data)
	}

	const handleMarkAsDoneSubmit: SubmitHandler<Todo> = (
		data: Todo | undefined
	) => {
		if (data) updateTodoMutation.mutate({ ...data, checked: true })
	}

	const handleDeleteTodo = async (id: number) => {
		await deleteTodoMutation.mutateAsync(id!)
		console.log("success")
	}

	if (todosIdsQuery.isPending) {
		return <span>loading...</span>
	}

	if (todosIdsQuery.isError) {
		return <span>there is an error!</span>
	}

	return (
		<>
			{/* <p>Query function status: {todosIdsQuery.fetchStatus}</p>
			<p>Query data status: {todosIdsQuery.status}</p>
			<p>Global isFetching: {isFetching}</p> */}
			{/* {todosIdsQuery.data?.map((id) => (
				<p key={id}>id: {id}</p>
			))} */}
			<form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
				<h4>New todo:</h4>
				<input placeholder="Title" {...register("title")} />
				<br />
				<input placeholder="Description" {...register("description")} />
				<br />
				<input
					type="submit"
					disabled={createTodoMutation.isPending}
					value={createTodoMutation.isPending ? "Creating..." : "Create todo"}
				/>
			</form>
			<ul>
				{todosQueries.map(({ data }) => (
					<li key={data?.id}>
						<div>Id: {data?.id}</div>
						<span>
							<strong>Title:</strong> {data?.title} ,{" "}
							<strong>Description:</strong> {data?.description}
						</span>
						<div>
							<button
								onClick={() => handleMarkAsDoneSubmit(data!)}
								disabled={data?.checked}
							>
								{data?.checked ? "Done" : "Mark as done"}
							</button>

							<button onClick={() => handleDeleteTodo(data?.id!)}>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</>
	)
}

export default Todos
