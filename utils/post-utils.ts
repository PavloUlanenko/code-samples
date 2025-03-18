import { Post, Tag } from '@/common-types/types'
import { readFile, writePostsToFile } from '@/lib/utils'
import { AVERAGE_READING_SPEED } from '@/constant'

function paginatePosts(posts: Post[], page: number = 1, limit: number = 20) {
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / limit)

  if (page < 1) page = 1
  if (page > totalPages) page = totalPages

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedPosts = posts.slice(startIndex, endIndex)

  return {
    posts: paginatedPosts,
    page,
    limit,
    totalPosts,
    totalPages
  }
}

export function getFeaturedPosts(): Post[] {
  const posts = readFile('posts.json')
  const featuredPosts = JSON.parse(posts).filter((post: Post) => post.featured)
  return featuredPosts
}

export function getPostsByTag(
  tagName: string,
  page: number = 1,
  limit: number = 20
) {
  const fileContent = readFile('posts.json')
  const posts = JSON.parse(fileContent) as Post[]

  const postsByTag = posts.filter(post =>
    post.tags.some(tag => tag.name === tagName)
  )

  return paginatePosts(postsByTag, page, limit)
}

export function getRelatedPosts(postIds: number[]): Post[] {
  const posts = readFile('posts.json')
  const postsJson = JSON.parse(posts) as Post[]
  const relatedPosts = postsJson.filter(post => postIds.includes(post.id))

  return relatedPosts
}

export function getAllPosts(page: number = 1, limit: number = 20) {
  const fileContent = readFile('posts.json')
  const posts = JSON.parse(fileContent) as Post[]

  return paginatePosts(posts, page, limit)
}

export function getSinglePost(slug: string): Post | null {
  const posts = readFile('posts.json')
  const postsJson = JSON.parse(posts) as Post[]
  const post = postsJson.find(post => post.slug === slug)

  return post || null
}

export function calculateReadTime(text: string) {
  const words = text.split(' ')
  const numberOfWords = words.length

  return Math.ceil(numberOfWords / AVERAGE_READING_SPEED)
}

export function deletePostById(postId: number) {
  const posts = readFile('posts.json')
  const postsJson = JSON.parse(posts) as Post[]
  const updatedPosts = postsJson.filter(post => post.id !== postId)

  writePostsToFile(updatedPosts)
}

export function getAllUniqueTags(posts: Post[]): Tag[] {
  const tagMap: { [key: number]: Tag } = {}

  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!tagMap[tag.id]) {
        tagMap[tag.id] = tag
      }
    })
  })

  return Object.values(tagMap)
}

export function getAllTags() {
  const posts = readFile('posts.json')
  const postsJson = JSON.parse(posts) as Post[]

  return getAllUniqueTags(postsJson)
}

export function setPost(postContent: Omit<Post, 'id'>, postId?: number) {
  const posts = readFile('posts.json')
  const postsJson = JSON.parse(posts) as Post[]

  if (postId) {
    const updatedPosts = postsJson.map(post => {
      return post.id === postId ? { ...post, ...postContent } : post
    })

    writePostsToFile(updatedPosts)
    return
  }

  const newPostId = postsJson.length + 1
  const newPost = { ...postContent, id: newPostId }
  const updatedPosts = [...postsJson, newPost]

  writePostsToFile(updatedPosts)
}
