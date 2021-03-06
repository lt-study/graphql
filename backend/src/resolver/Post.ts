import { Post } from "../model/Post";
import { MyContext } from "../type";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx() { em }: MyContext
  ): Promise<Post[]> {
    console.log(em);
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext,
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext,
  ): Promise<Post | null> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post)
    return post;
  }

  @Mutation(() => Post, {nullable:true})
  async updatePost(
    @Arg('title', {nullable: true}) title: string,
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext,
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post || typeof title === 'undefined')
      return null;
    post.title = title;
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean, )
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext,
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true
  }
}