import { postRepository } from './repositories/postRepository.js'

const $posts = document.querySelector('.posts__list')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
let postsArr = []

let currentPage = 1

const renderPosts = async (posts) => {
    const deletedPosts = JSON.parse(localStorage.getItem('deletedPosts'))

    if (!posts) {
        postsArr = await postRepository.getAll(currentPage, 10, deletedPosts)
        posts = [...postsArr]
    }

    if (posts.length === 0) {
        $posts.innerHTML = ''
    }

    posts.forEach(async (post, idx) => {
        if (idx === 0) {
            $posts.innerHTML = ''
        }

        const $li = document.createElement('li')
        $li.classList.add('posts__list-item')
        $li.innerHTML = `
            <a href="pages/post.html?userId=${post.userId}&id=${post.id}">
                <img src="https://picsum.photos/id/${post.id}/240/300" />
            </a>
            <div class="posts__list-item__ifno">
            ${post.id}
                <p class="posts__list-item__ifno-title">${post.user.username}</p> 
                <p class="posts__list-item__ifno-title">${post.title}</p> 
                <p class="posts__list-item__ifno-body">${post.body}</p>
            </div>
            <button id="delete" data-post-id="${post.id}">Delete</button>
        `

        $posts.appendChild($li)
    })
}

$posts.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'delete') {
        e.stopImmediatePropagation()

        const postId = e.target.getAttribute('data-post-id')

        postRepository.deleteOne(postId).then(() => {
            const deletedPosts = JSON.parse(localStorage.getItem('deletedPosts'))

            if (deletedPosts) {
                localStorage.setItem('deletedPosts', JSON.stringify([...deletedPosts, postId]))
            } else {
                localStorage.setItem('deletedPosts', JSON.stringify([postId]))
            }

            renderPosts(null, currentPage)
        })
    }
})

renderPosts()

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage -= 1

        renderPosts(null)
    }
})

nextBtn.addEventListener('click', () => {
    currentPage += 1

    renderPosts(null)
})

// Search
const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const input = document.querySelector('input').value
    const select = document.querySelector('select').value
    let filteredPosts = []

    filteredPosts = await postRepository.search(input, select)

    renderPosts(filteredPosts)
})
