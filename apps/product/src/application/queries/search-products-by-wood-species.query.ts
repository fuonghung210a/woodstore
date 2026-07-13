import { WoodSpecies } from '../../domain/types/wood-species';

export class SearchProductsByWoodSpeciesQuery {
  constructor(readonly woodSpecies: WoodSpecies) {}
}
