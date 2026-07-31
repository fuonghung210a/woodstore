export class ListPostsQuery {
  constructor(
    readonly filter: { search?: string; status?: string; tag?: string },
    readonly pagination: { page: number; limit: number },
  ) {}
}
