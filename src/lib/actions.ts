"use server"
import { redirect } from "next/navigation"

export const seachBlogByKeyword = async (formData: FormData) => {
  const keyword = formData.get('keyword')
  if (!keyword) {
    redirect('/blogs')
  }
  // TODO: バリデーション
  redirect(`/blogs?keyword=${keyword}`)
}