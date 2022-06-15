const listHelper = require('../utils/list_helper')
const oneBlog = listHelper.oneBlog
const threeBlogs = listHelper.threeBlogs

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
    test('equal to one blogs likes', () => {
        expect(listHelper.totalLikes(oneBlog)).toBe(10)
    })
    test('equal to likes in several blogs', () => {
        expect(listHelper.totalLikes(threeBlogs)).toBe(12)
    })
})

describe('favorite blog', () => {
    test('of empty list is undefined', () => {
        expect(listHelper.favoriteBlog([])).toEqual(undefined)
    })
    test('in a list of one is that blog', () => {
        expect(listHelper.favoriteBlog(oneBlog)).toEqual({
            'title': 'test3',
            'author': 'author2',
            'url': 'www.w2.w',
            'likes': 10
        })
    })
    test('most liked in a list of blogs', () => {
        const mostliked = listHelper.favoriteBlog(threeBlogs)
        console.log(mostliked)
        expect(mostliked).toEqual({
            _id: '629ef6a35cfa94a8d7a66f24',
            title: 'test3',
            author: 'author2',
            url: 'www.w2.w',
            likes: 10

        })
    })
})

describe('author info', () => {
    test('for most blogs, empty returns undefined', () => {
        expect(listHelper.mostBlogs([])).toEqual(undefined)
    })
    test('for most blogs, list of one returns that author', () => {
        expect(listHelper.mostBlogs(oneBlog)).toEqual({ author: 'author2', blogs: 1 })
    })
    test('for most blogs, list returns author with most blogs', () => {
        expect(listHelper.mostBlogs(threeBlogs)).toEqual({ author: 'author1', blogs: 2 })
    })

    test('for most likes, empty returns undefined', () => {
        expect(listHelper.mostLikes([])).toEqual(undefined)
    })
    test('for most likes, list of one returns that author', () => {
        expect(listHelper.mostLikes(oneBlog)).toEqual({ author: 'author2', likes: 10 })
    })
    test('for most likes, list returns author with most likes', () => {
        expect(listHelper.mostLikes(threeBlogs)).toEqual({ author: 'author2', likes: 10 })
    })
})