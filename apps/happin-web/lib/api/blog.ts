import { getFromCrowdCore } from "./base"

const GET_BLOG_LIST_BRIEF = '/blog/getBlogListBrief?page={pageNumber}&pageSize={pageSize}'
const GET_BLOG_BY_NAME = '/blog/getBlogByName?blogName={blogName}&page={pageNumber}&pageSize={pageSize}'
const GET_BLOG_BY_ID = '/blog/getBlog?_id={id}'
const GET_BLOG_BY_URL_TITLE='/blog/getBlog?urlTitle={title}'

const getBlogListBrief = async (pagenumber: number, pagesize: number) => {
    const response = await getFromCrowdCore(GET_BLOG_LIST_BRIEF.replace('{pageNumber}', `${pagenumber}`).replace('{pageSize}', `${pagesize}`))
    return response || {}
}

const getBlogByName = async (blogName: string, pagenumber: number, pagesize: number) => {
    const response = await getFromCrowdCore(GET_BLOG_BY_NAME.replace('{pageNumber}', `${pagenumber}`).replace('{pageSize}', `${pagesize}`).replace('{blogName}', blogName))
    return response || {}
}

const getBlogById = async (id: string) => {
    const response = await getFromCrowdCore(GET_BLOG_BY_ID.replace('{id}', id))
    return response || {}
}

const getBlogByURLTitle = async (title: string) => {
    const response = await getFromCrowdCore(GET_BLOG_BY_URL_TITLE.replace('{title}', title))
    return response || {}
}

export {getBlogListBrief, getBlogByName, getBlogById, getBlogByURLTitle}
