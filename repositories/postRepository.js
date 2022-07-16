class PostRepository {
	async getAll(page = 1, limit = 10, ignoreArr = []) {
		const ignoreStr =
			ignoreArr && ignoreArr.length > 0
				? ignoreArr.reduce((curr, next) => curr + "&id_ne=" + next, "")
				: "";

		const res = await fetch(
			`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}&_expand=user&${ignoreStr}`
		);
		const posts = await res.json();

		return posts;
	}

	async getById(id) {
		const res = await fetch(
			`https://jsonplaceholder.typicode.com/posts/${id}?_expand=user`
		);
		const post = res.json();

		return post;
	}

	async deleteOne(id) {
		const res = await fetch(
			"https://jsonplaceholder.typicode.com/posts/" + id,
			{
				method: "DELETE",
			}
		);
		const deletedPost = await res.json();

		return deletedPost;
	}

	async search(text, field) {
		if (text === "") {
			return await this.getAll(1);
		}

		if (field === "author") {
			return await this.searchByAuthor(text);
		}

		const res = await fetch(
			`https://jsonplaceholder.typicode.com/posts?${field}_like=${text}&_expand=user`
		);
		const posts = await res.json();

		return posts;
	}

	async searchByAuthor(name) {
		if (name === "") {
			return await this.getAll(1);
		}

		const res = await fetch(
			`https://jsonplaceholder.typicode.com/users?username=${name}&_embed=posts`
		);
		const user = await res.json();
		const fixedPosts = await user[0].posts.map((post) => {
			return {
				...post,
				user: {
					username: user[0].username,
				},
			};
		});

		return fixedPosts;
	}
}

export const postRepository = new PostRepository();
