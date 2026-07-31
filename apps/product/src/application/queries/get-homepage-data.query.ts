export class GetHomepageDataQuery {
  constructor(
    readonly featuredLimit: number = 8,
    readonly newestLimit: number = 8,
  ) {}
}
