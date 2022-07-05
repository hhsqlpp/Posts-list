import { postRepository } from '../repositories/postRepository.js'

const $post = document.querySelector('.post')

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
})

const renderPostInfo = async () => {
    const postInfo = await postRepository.getById(params.id)

    $post.innerHTML = `
        <p>Author name: ${postInfo.user.name}</p>
        <p>Author username: ${postInfo.user.username}</p>
        <p>Post title: ${postInfo.title}</p>
        <p>Post body: ${postInfo.body}</p>
    `
}

renderPostInfo()
