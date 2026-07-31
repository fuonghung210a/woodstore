export class ListPublishedPostsQuery {
  constructor(
    readonly pagination: { page: number; limit: number },
  ) {}
}
